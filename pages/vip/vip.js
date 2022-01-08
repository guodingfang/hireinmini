import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { remoteImagesUrl } from '../../config'
import { getLocationInfo } from '../../models/map'
import { getVIPPriceList, getFinanceVIPPriceList, getPurchaseLog, vipCharge, isUserHaveCoupon } from '../../models/vip'
import { getUserBalance, checkPassword } from '../../models/account'
import { login, getMyCoupon, getUserBaseInfo } from '../../models/user'
import { payment } from '../../models/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip: false,
    expires: false,
    user: null,
    userVipInfo: null,
    isShowModel: false,
    showActivityModel: false,
    // bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    bgImagesUrl: '/images/advert/vip-bg.png',
    type: 'vip',
    isOpenFvip: false,
    recordList: [],
    // vip
    vipInfo: [],
    // 企业联合vip
    companyVipInfo: [],
    // 财务+vip
    financeVipInfo: [],
    // 法务+vip
    legalVipInfo: [],
    // 优惠劵
    couponList: [],
    // 选择的优惠劵
    selectCoupon: null,
    price: 0,
    selectWay: 'wechat',
    balance: '0.00',
    isUseWallet: true,
    haveWay: ['wechat', 'wallet'],
    showPay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    this.getHeaderBlock()
    await this.getUserBaseInfo()
    await this.getLocationInfo()
    await this.getUserBalance()
    await this.getVIPPriceList()
    await this.getPurchaseLog()
    await this.getMyCoupon()
    await this.isUserHaveCoupon()
  },

	async isUserHaveCoupon() {
		const { status = 0 } = await isUserHaveCoupon()
		this.setData({
			isShowModel: !status
		})
	},

  async getUserBaseInfo() {
		const {
      user: { vip, userpic, nickname }
    } = await getUserBaseInfo({})
		this.setData({
      isVip: vip && vip.vipsign > 0,
      expires: vip && vip.vipexpired === 1,
      user: {
        userpic,
        nickname,
      }
    })
    if (vip.evip) {
      this.setData({
        userVipInfo: {
          ...vip.evip,
          endDate: vip.evip.enddate.split(' ')[0],
          title: '企服联合'
        }
      })
    } else if (vip.vip) {
      this.setData({
        userVipInfo: {
          ...vip.vip,
          endDate: vip.vip.enddate.split(' ')[0],
          title: '嗨应'
        }
      })
    }
  },
  
  async onSetUserInfo () {
    await login()
  },

  async getUserBalance () {
    const { balance } = await getUserBalance()
    this.setData({
      balance,
      isUseWallet: !!parseFloat(balance)
    })
  },

  async getMyCoupon () {
    const { data = [], errcode = -1 } = await getMyCoupon()
    if(errcode === 0) {
      this.setData({
        couponList: data
      })
      this.matchCouponAndPrice()
    }
  },

  async getPurchaseLog() {
    const { data } = await getPurchaseLog({})
    this.setData({
      recordList: data
    })
  },

  matchCouponAndPrice() {
    const { couponList, type, vipInfo = [], companyVipInfo = [], financeVipInfo = [], legalVipInfo = [] } = this.data

    let price = 0

    if(type === 'vip') {
      const selectItem = vipInfo.find(item => item.select)
      price = +selectItem.price
      const selectCoupon = couponList.find(item => item.refpriceid.split(',').indexOf(selectItem.id) > -1)
      if(selectCoupon) {
        price = +(price - selectCoupon.denomination).toFixed(2)
      }
      this.setData({
        selectCoupon: selectCoupon || null
      })
    } else if (type === 'companyVip') {
      const companySelect = companyVipInfo.find(item => item.select)
      const financeSelect = financeVipInfo.find(item => item.select)
      const legalSelect = legalVipInfo.find(item => item.select)
      price = companySelect ? companySelect.price : 0

      let selectCoupon = null
      const selectCoupon1 = companySelect ? couponList.find(item => item.refpriceid.split(',').indexOf(companySelect.id) > -1) : ''
      const selectCoupon2 = financeSelect ? couponList.find(item => item.refpriceid.split(',').indexOf(financeSelect.id) > -1) : ''
      const selectCoupon3 = legalSelect ? couponList.find(item => item.refpriceid.split(',').indexOf(legalSelect.id) > -1) : ''
      if(selectCoupon1) {
        if(selectCoupon) {
          selectCoupon = parseFloat(selectCoupon1.denomination) > selectCoupon.denomination ? selectCoupon1 : selectCoupon
        } else {
          selectCoupon = selectCoupon1
        }
      }
      if(selectCoupon2) {
        if(selectCoupon) {
          selectCoupon = parseFloat(selectCoupon2.denomination) > selectCoupon.denomination ? selectCoupon2 : selectCoupon
        } else {
          selectCoupon = selectCoupon2
        }
      }
      if(selectCoupon3) {
        if(selectCoupon) {
          selectCoupon = parseFloat(selectCoupon1.denomination) > selectCoupon.denomination ? selectCoupon3 : selectCoupon
        } else {
          selectCoupon = selectCoupon3
        }
      }
      if(selectCoupon) {
        price = +(price - selectCoupon.denomination).toFixed(2)
      }

      this.setData({
        selectCoupon: selectCoupon || null
      })

      price = +price + (financeSelect ? +financeSelect.price : 0) + (legalSelect ? +legalSelect.price : 0)
    }

    this.setData({
      price: price.toFixed(2)
    })
  },

  getHeaderBlock() {
    const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
    const { tabHeight } = judgeTabBarHeight(workInfo);
    this.setData({
      statusBarHeight : statusBarHeight,
      tabHeight,
    })
  },

  async getVIPPriceList () {
    const { data, errcode, errmsg } = await getVIPPriceList({
      citycode: this.data.cityCode
    })
    const { vip, lvip, fvip, evip } = data
    this.setData({
      vipInfo: vip.price.map((item, index) => index === 0 ? {...item, select: true} : {...item, select: false}),
      companyVipInfo: evip.price.map((item, index) => index === 0 ? {...item, select: true} : {...item, select: false}),
      isOpenFvip: !!fvip.vipservice,
      financeVipInfo: fvip.price.map((item, index) => ({...item, select: false})),
      legalVipInfo: lvip.price.map((item, index) => ({...item, select: false}))
    })
  },

  async getLocationInfo () {
    const { city, cityCode } = await getLocationInfo({})
    this.setData({
      city,
      cityCode,
    })
  },

  async getFinanceVIPPriceList (e) {
    const { data, errcode, errmsg, vipservice } =await getFinanceVIPPriceList({
      citycode: this.data.cityCode
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }
    this.setData({
      financeVipInfo: data.map((item, index) => ({...item, select: false})),
      isOpenFvip: !!vipservice,
    })
  },

  onSelectItem (e) {
    const { type, index } = e.detail
    const { companyVipInfo = [], financeVipInfo = [], legalVipInfo = [] } = this.data

    if (type === 'financeVip' || type === 'legalVip') {
      let selectCompanyVipIndex = 0
      companyVipInfo.map((item, index) => {
        if(item.select) {
          selectCompanyVipIndex = index
        }
      })
      if(selectCompanyVipIndex === 0 || selectCompanyVipIndex === 1) {
        if(index === 0) {
          wx.showToast({
            title: '只支持全年VIP+1元换购',
            icon: 'none'
          })
          return
        } else {
          this.setData({
            [`${type}Info`]: this.data[`${type}Info`].map((item, _index) => index === _index ? item.select ? {...item, select: false} : {...item, select: true} : {...item, select: false} )
          })
        }
      } else {
        this.setData({
          [`${type}Info`]: this.data[`${type}Info`].map((item, _index) => index === _index ? item.select ? {...item, select: false} : {...item, select: true} : {...item, select: false} )
        })
      }
    } else if (type === 'companyVip') {
      if(index === 0 || index === 1) {
        this.setData({
          financeVipInfo: financeVipInfo.map((item, _index) => _index === 0 && item.select ? {...item, select: false} : item),
          legalVipInfo: legalVipInfo.map((item, _index) => _index === 0 && item.select ? {...item, select: false} : item)
        })
      }
      this.setData({
        [`${type}Info`]: this.data[`${type}Info`].map((item, _index) => index === _index ? item.select ? {...item, select: false} : {...item, select: true} : {...item, select: false} )
      })
    } else {
      this.setData({
        [`${type}Info`]: this.data[`${type}Info`].map((item, _index) => index === _index ? {...item, select: true} : {...item, select: false} )
      })
    }
    this.matchCouponAndPrice()
  },

  onSelectVip (e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
    this.matchCouponAndPrice()
  },

  onSelect (e) {
    this.setData({
      selectWay: e.detail.type
    })
  },

  onShowActivityModel () {
    if(this.data.isShowModel) {
      this.setData({
        showActivityModel: true
      })
    } else {
      wx.showToast({
        title: '已领取，可用于VIP付款减免',
        icon: 'none'
      })
    }
  },

  onDraw () {
    this.setData({
      isShowModel: false,
      showActivityModel: false
    })
  },

  onCloseModel () {
    this.setData({
      showActivityModel: false
    })
  },

  onSkipLocation () {
    wx.navigateTo({
      url: '/pages/city-list/city-list',
    })
  },

  onAgainLocationComplete(e) {
    this.setData({
      city: e.city,
      cityCode: e.code
    })
    this.getFinanceVIPPriceList()
  },

  onClosePay () {
    this.setData({
      showPay: false
    })
  },

  async onSubmitOrder () {
    const { selectWay = 'wechat', price = 0 } = this.data
    if (!parseFloat(price)) {
      wx.showToast({
        title: '请选择购买项目',
        icon: 'none'
      })
      return
    }

    if(selectWay === 'wechat') {
      this._onSubmitOrder()
    } else if(selectWay === 'wallet') {
      const { resetpaypass = '1' } = getUserInfo(['resetpaypass'])
      if (resetpaypass === '1') {
        const { confirm = false } = await wx.showModal({
          title: '设置支付密码',
          content: '未设置过支付密码，请先设置',
          confirmText: '设置',
        })
        if(confirm) {
          wx.navigateTo({
            url: '/pages/wallet-password/wallet-password',
          })
          return
        }
        return
      }
      this.setData({
        showPay: true
      })
    }
  },

  async onCheckingPay (e) {
    const { code = '' } = e.detail
    const { errcode = -1, errmsg = '' } = await checkPassword({
      password: code
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    } else {
      this.onClosePay()
      this._onSubmitOrder()
    }
  },

  async _onSubmitOrder () {
    const {
      type,
      selectWay,
      cityCode,
      // vip
      vipInfo,
      // 企业联合vip
      companyVipInfo,
      // 财务+vip
      financeVipInfo,
      // 法务+vip
      legalVipInfo,
      selectCoupon,
      price,
    } = this.data
    
    let params = {
      citycode: cityCode,
      paytype: selectWay === 'wechat' ? 'wxpay' : 'wallet',
      price,
    }

    if(selectCoupon) {
      params = {
        ...params,
        couponid: selectCoupon.id,
      }
    }

    if(type === 'vip') {
      const selectVipItem = vipInfo.find(item => item.select)
      params = {
        ...params,
        vip: 1,
        priceid: selectVipItem.id,
      }
    } else {
      const selectCompanyVipItem = companyVipInfo.find(item => item.select)
      const selectFinanceVipItem = financeVipInfo.find(item => item.select)
      const selectLegalVipItem = legalVipInfo.find(item => item.select)
      if(selectCompanyVipItem) {
        params = {
          ...params,
          evip: 1,
          epriceid: selectCompanyVipItem.id,
        }
      }
      if(selectFinanceVipItem) {
        params = {
          ...params,
          fvip: 1,
          fpriceid: selectFinanceVipItem.id,
        }
      }
      if(selectLegalVipItem) {
        params = {
          ...params,
          lvip: 1,
          lpriceid: selectLegalVipItem.id,
        }
      }
    }
    const { errcode = -1, errmsg = '', orderno = '', jsApiParameters = null } = await vipCharge({
      ...params
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }

    if(selectWay === 'wallet') {
      wx.showToast({
        title: '成功',
        icon: 'none'
      })
      await login()
      await this.getUserBaseInfo()
      await this.getUserBalance()
      return
    }

    const { code, msg } = await payment({
      payParams: jsApiParameters,
      ordertype: 'vip',
      orderid: orderno,
    })

    if(code !== 0) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '成功',
        icon: 'none'
      })
      await login()
      await this.getUserBaseInfo()
    }
  },

  onForgetPassword () {
    wx.navigateTo({
      url: `/pages/wallet-password/wallet-password?reset=reset`,
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
import { getUserBalance, withdrawBankCard } from '../../models/account'
import { upload } from '../../models/util'
import { promisic, getUserInfo } from '../../utils/util'
import { login } from '../../models/user'
import { bankCardFormat, verifyData } from '../../utils/tool'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectWay: 'bank',
    haveWay: ['bank', 'wechat'],
    isWithdrawComplete: false,
    cardno: '',
    amount: '',
    cardPaths: [],
    totalPrice: '0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserBalance()
  },

  async getUserBalance() {
    const { balance = '0.00' } = await getUserBalance({})
    this.setData({
      totalPrice: balance
    })
  },

  onChangeInput (e) {
    const { type = '' } = e.target.dataset
    this.setData({
      [`${type}`]: type === 'cardno'
        ? bankCardFormat(e.detail.value)
        : e.detail.value
    })
  },

  async onUploadCard (e) {
    const { tempFilePaths = [] } = await promisic(wx.chooseImage)({
      count: 1,
      sourceType: ['album', 'camera'],
    });
    wx.showLoading({
      title: '上传中',
    })
    this.setData({
      cardPaths: tempFilePaths
    })

    this._upload()
  },

  async _upload() {
    const { cardPaths } = this.data
    const [ res ] = await upload({
      url: '/User/getBankCardInfo',
      files: cardPaths
    })
    const {
      result = false,
      msg = '',
      bankinfo = '',
      cardno = '',
    } = JSON.parse(res)
    wx.hideLoading()
    if (!result) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    this.setData({
      bank: bankinfo,
      cardno: bankCardFormat(cardno)
    })
  },

  onSelect (e) {
    if (e.detail.type === 'wechat') {
      wx.showToast({
        title: '试用版本，敬请期待',
        icon: 'none'
      })
      return
    }
    this.setData({
      selectWay: e.detail.type
    })
  },

  onClose() {
    this.setData({
      price: ''
    })
  },

  onAllWithdraw() {
    this.setData({
      amount: +this.data.totalPrice
    })
  },

  async onSetUserInfo () {
    await login()
  },

  async onWithdraw () {
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
    this._onWithdraw()
  },

  async _onWithdraw() {
    if(this.data.isWithdrawComplete) {
      wx.navigateBack({
        delta: 1,
      })
      return
    }
    const {
      amount = '',
      cardno = '',
      name = '',
      bank = ''
    } = this.data

    const { verify } = verifyData(this.data, [
      { type: 'amount', label: '金额' },
      { type: 'cardno', label: '银行卡号' },
      { type: 'name', label: '真实姓名' },
      { type: 'bank', label: '开户行' },
    ])

    if(!verify) return

    const reg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
    if(!reg.test(cardno.replace(/\s+/g,""))) {
      wx.showToast({
        title: '请输入正确的银行卡号',
        icon: 'none'
      })
      return
    }

    if(amount < 200) {
      wx.showToast({
        title: '提现金额需大于200',
        icon: 'none'
      })
      return
    }

    const { errcode = 0, errmsg = '' } = await withdrawBankCard({
      amount,
      cardno: cardno.replace(/\s+/g,""),
      name,
      bank
    })
    if(errcode === 0) {
      this.setData({
        isWithdrawComplete: !this.data.isWithdrawComplete
      })
    } else {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }
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
})
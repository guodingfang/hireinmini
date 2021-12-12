import { publishArtic } from '../../models/article'
import { payment } from '../../models/util'
import { verifyData } from '../../utils/tool'
import { getUserInfo } from '../../utils/util'
import { upload } from '../../models/util'
import { getUserBalance, checkPassword } from '../../models/account'
import { login } from '../../models/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectWay: 'wechat',
    haveWay: ['wechat', 'wallet'],
    isComplete: false,
    balance: 0,
    price: 0,
    exitUpload: false,
    isUseWallet: true,
    showPay: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    this.getUserBalance()
  },

  async getUserBalance () {
    const { balance } = await getUserBalance()
    this.setData({
      balance
    })
  },

  onSelect(e) {
    this.setData({
      selectWay: e.detail.type
    })
  },

  onInputChange(e) {
    const { value } = e.detail
    const { type } = e.target.dataset
    if(type === 'price') {
      const isUseWallet = +value <= +this.data.balance
      this.setData({
        isUseWallet,
        selectWay: isUseWallet ? this.data.selectWay : 'wechat'
      })
    }
    this.setData({
      [type]: value
    })
  },

  onUploadComplete(e) {
    const { type = '',  uploadImages = [], uploadVideo = '', formDataParams = null } = e.detail
    this.setData({
      selectUploadType: type,
      uploadImages,
      uploadVideo,
      formDataParams,
      exitUpload: true,
    })
  },

  async onSetUserInfo () {
    await login()
  },

  async onPublishArtic () {
    const { price = 0, selectWay = 'wechat' } = this.data
    const { verify } = verifyData(this.data, [
      { type: 'title', label: '问答的标题' }
    ])

    if (!verify) return

    if(selectWay === 'wechat') {
      this._onPublishArtic()
    } else if(selectWay === 'wallet') {
      if (price == 0) {
        wx.showToast({
          title: '请输入打赏金额',
          icon: 'none'
        })
        return
      }
      
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

  async _onPublishArtic() {
    const { title = '', content = '', price = 0, selectWay = 'wechat' } = this.data

    const { userid = '', wxappid = '' } = getUserInfo(['userid', 'wxappid'])
    const { errcode = -1, qaid = '', jsApiParameters = null } = await publishArtic({
      title,
      content,
      price,
      userid,
      qatype: 'q',
      paytype: selectWay === 'wechat' ? 'wxpay' : 'wallet',
      openid: wxappid,
    })
    if (errcode !== 0) return
    const { selectUploadType = '' } = this.data
    if (selectUploadType === 'img') {
      const { uploadImages = [] } = this.data
      await upload({
        url: '/QuestionAnswer/uploadQAPicture',
        files: uploadImages
      }, {
        formData: {
          qaid: qaid
        }
      })
    } else if (selectUploadType === 'video') {
      const { formDataParams, uploadVideo } = this.data
      await upload({
        url: '/QuestionAnswer/uploadQAVideo',
        files: [uploadVideo]
      }, {
        formData: {
          qaid: qaid,
          ...formDataParams,
        }
      })
    }
    if(price && selectWay === 'wechat' && jsApiParameters) {
      const { code, msg } = await payment({
        payParams: jsApiParameters,
        ordertype: 'qa',
        orderid: qaid,
      })
      if(code !== 0) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      } else {
        this.setData({
          isComplete: true
        })
      }
    } else {
      this.setData({
        isComplete: true
      })
    }
  },

  // 发布完成
  onComplete () {
    wx.navigateBack({
      delta: 1,
    })
  },
  
  onClosePay () {
    this.setData({
      showPay: false
    })
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
      this._onPublishArtic()
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
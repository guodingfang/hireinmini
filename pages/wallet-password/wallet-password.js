import { promisic, getUserInfo, formatDate } from '../../utils/util.js'
import { sendSMSCode, resetPassword } from '../../models/account'
import { verifyData } from '../../utils/tool'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reset: false,
    phone: '',
    remainingTime: '',
    isShowPassword: true
  },

  pageLifetimes: {
    hide () {
      console.log('#')
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { reset = 'notReset' } = options
    this.setData({
      reset: reset === 'reset'
    })
    this.getUserPhone()
  },

  getUserPhone () {
    const { phone = '' } = getUserInfo(['phone'])
    this.setData({
      phone
    })
  },

  async sendCode() {
    if(this.data.remainingTime) {
      wx.showToast({
        title: `请在${formatDate(new Date(this.data.endDate - this.data.startDate), "ss")}s后重新获取`,
        icon: 'none'
      })
      return
    }
    const { errcode = -1, errmsg = '' } = await sendSMSCode({
      phone: this.data.phone
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '已发送验证码，注意查收',
      icon: 'none'
    })
    const startDate = (new Date()).valueOf()
    this.setData({
      startDate,
      endDate: startDate + 59 * 1000,
    })
    this.countDown();
  },
  // 倒计时计算
  countDown() {
    const self = this;
    const t = () => {
      const { startDate, endDate } = self.data;
      self.timer = setTimeout(() => {
        if (endDate - startDate > 0) {
          self.setData({
            startDate: startDate + 1000,
            remainingTime: `${formatDate(new Date(endDate - startDate), "ss")}s后重新获取`
          });
          t();
        } else {
          self.setData({
            remainingTime: '',
          });
          clearInterval(self.timer);
        }
      }, 1000)
    }
    t();
  },
  
  onChangeInput (e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [type]: e.detail.value
    })
  },

  onShowPassword () {
    this.setData({
      isShowPassword: !this.data.isShowPassword
    })
  },

  async onSetPassword () {
    const {
      smscode = '',
      password = '',
      againPassword = ''
    } = this.data

    const { verify } = verifyData(this.data, [
      { type: 'smscode', label: '验证码' },
      { type: 'password', label: '密码' },
      { type: 'againPassword', label: '确定密码' },
    ])
    if (!verify) return

    if(password !== againPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return
    }

    if(password.length < 6) {
      wx.showToast({
        title: '请输入6位密码',
        icon: 'none'
      })
      return
    }

    const { errcode = -1, errmsg = '' } = await resetPassword({
      smscode,
      password
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '密码设置成功',
        icon: 'none'
      })
      setTimeout(() => {
        // 通知上一个页面信息已修改
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.onSetUserInfo({})
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import { login, registerUser, getUserPhone } from '../../models/user'
import { promisic } from '../../utils/util'
import { storageSet } from '../../utils/storage'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canGetUserProfile: false,
    code: '',
    userinfo: null,
    phoneModel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    const { status = '' } = options
    if(status === 'userInfo') {
      this.setData({
        phoneModel: true,
      })
      this._getUserBaseInfo()
    }
    this.initUser()
  },

  // 获取用户基本信息
  _getUserBaseInfo() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getUserBaseInfo', ({ userinfo }) => {
      this.setData({
        userinfo
      })
    })
  },

  async initUser() {
    if(wx.getUserProfile) {
      this.setData({
        canGetUserProfile: true
      })
    }
  },

  // 获取用户信息并登陆
  async getUserInfo() {
    try {
      const { encryptedData = '', iv } = await wx.getUserProfile({
        desc: '用于完善会员资料',
      })
      const { code } = await promisic(wx.login)();
      // 注册用户
      const userinfo = await registerUser({
        encryptedData,
        iv,
        code
      })
      this.setData({
        userinfo,
        phoneModel: userinfo.code === 1,
      })
    } catch (err) {
      console.log('err', err)
    }
  },

  async getUserPhone(e) {
    const { errMsg, encryptedData, iv } = e.detail
    if (errMsg == 'getPhoneNumber:ok'){
      const { userinfo } = this.data
      const { code } = await promisic(wx.login)();
      const data = await getUserPhone({
        encryptedData,
        iv,
        code,
        reguserid: userinfo.reguserid
      })
      // 注册成功
      if(data.code === 0) {

        const { code = -1 } = await login()
        if(code !== 0) return
        
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2]; //上一个页面
    
        prevPage.onAgainGetUserInfo && prevPage.onAgainGetUserInfo({})

        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
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
})
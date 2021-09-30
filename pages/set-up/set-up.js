import { getUserEditableInfo, setUserInfo } from '../../models/user'

import { promisic } from '../../utils/util'
import config from '../../config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadUrl: `${config.baseUrl}/User/changeUserHeadPic`,
    userInfo: null,
    genderList: [{label: '男'}, {label: '女'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  async getUserInfo() {
    const userInfo = await getUserEditableInfo()
    this.setData({
      userInfo,
      userpic: userInfo.userpic,
      nickname: userInfo.nickname,
      remark: userInfo.remark,
      gender: +userInfo.gender - 1,
      city: userInfo.city
    })
  },

  async onChooseImage(event) {
    const { tempFilePaths } = await promisic(wx.chooseImage)({
      count: 1,
      sourceType: ['album', 'camera'],
    });
    this.setData({
      userpic: tempFilePaths[0]
    })
    this._upload()
  },

    // 上传
    async _upload() {
      const { uploadUrl, userpic, userInfo } = this.data
      const data = await promisic(wx.uploadFile)({
        url: uploadUrl,
        filePath: userpic,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          userid: userInfo.userid,
        },
      })
      this.setData({
        userpic: data.userpic
      })
    },

  onSelectCity() {
    wx.navigateTo({
      url: '/pages/city-list/city-list',
    })
  },

  onChangeInput(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [type]: e.detail.value
    })
  },

  onGenderChange(e) {
    this.setData({
      gender: e.detail.value
    })
  },

  // 重新选择城市
  onAgainLocationComplete(e) {
    this.setData({
      city: e.city,
    })
  },

  async onSubmit() {
    const {
      userInfo = null,
      userpic = '',
      nickname = '',
      remark = '',
      gender = '',
      city = ''
    } = this.data
    const res = await setUserInfo({
      userid: userInfo.userid,
      file: userpic,
      nickname,
      remark,
      gender: +gender + 1,
      city
    })

    // 通知上一个页面信息已修改
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.onSetUserInfo({})
    
    wx.navigateBack({
      delta: 1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
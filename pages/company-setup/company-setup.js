import { getCompanyLabels, createCompany } from '../../models/company'

import { getUserInfo } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    companyname: '',
    contact: '',
    phone: '',
    city: '',
    citycode: '',
    address: '',
    introduction: '',
    tags: [],
    picidstr: '',     // 修改时删除原图片id-string
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
    this.getCompanyLabels()
  },

  getInfo() {
    const { userid, nickname: contact, phone } = getUserInfo(['userid', 'nickname', 'phone'])
    const { city } = wx.getStorageSync('locationInfo')
    this.setData({
      userid,
      contact,
      phone,
      city
    })

  },

  async getCompanyLabels() {
    const tags = await getCompanyLabels({})
    this.setData({
      tags: tags.map(item => ({id: item.id, label: item.labelname, select: false}))
    })
  },

  onSelectCity() {
    wx.navigateTo({
      url: '/pages/city-list/city-list',
    })
  },

  onAgainLocationComplete(e) {
    this.setData({
      city: e.city,
      citycode: e.code
    })
  },

  async onAddress() {
    const { address } = await wx.chooseLocation()
    this.setData({
      address,
    })
  },

  onSelectLabel(e) {
    const { tags } = this.data
    this.setData({
      tags: tags.map(tag => tag.id === e.detail.id ? {...tag, select: !tag.select} : tag)
    })
  },

  isUpload(e) {
    console.log('e', e)
  },

  onUploadComplete(e) {
    console.log('@', e)
  },

  onChanageInput(e) {
    console.log('e', e)
    const { type } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [type]: value
    })
  },

  // 提交信息
  async onSubmit() {
    const {
      userid = '',
      companyname = '',
      contact = '',
      phone = '',
      city = '',
      citycode = '',
      address = '',
      introduction = '',
      tags = [],
      picidstr = '',
    } = this.data
    const params = {
      companyid: '',
      companyname,
      contact,
      phone,
      citycode,
      address,
      introduction,
      userid,
      mainbusiness: tags.filter(tag => tag.select).map(tag => ({
        labelid: tag.id,
        labelname: tag.label
      })),
      picidstr
    }
    await createCompany({
      ...params
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
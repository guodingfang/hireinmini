import { joinCompany } from '../../models/company'
import { getUserInfo } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid: '',
    phone: '',
    employeename: '',
    comments: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { companyid = '' } = options
    const { phone } = getUserInfo(['phone'])
    this.setData({
      companyid,
      phone
    })
  },

  onChanageInput(e) {
    const { type } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [type]: value
    })
  },

  async joinCompany() {
    const { companyid, phone, employeename, comments } = this.data
    if (!employeename) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    const { result = false, msg = '' } = await joinCompany({
      companyid,
      phone,
      employeename,
      comments
    })
    if(!result) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    wx.navigateBack({
      delta: 2,
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
})
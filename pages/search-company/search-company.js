import { getCompanyList } from '../../models/company'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    companyname: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onChanageInput(e) {
    this.setData({
      companyname: e.detail.value
    })
  },

  async onSearchCompanyList() {
    const { companyname } = this.data
    if(!companyname) {
      
      return
    }
    const { data = [] } = await getCompanyList({
      companyname
    })
    this.setData({
      list: data
    })
  },

  onSelect(e) {
    const { companyid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/add-company/add-company?companyid=${companyid}`,
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
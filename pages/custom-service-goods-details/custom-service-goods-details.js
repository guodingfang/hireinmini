import { getCarousel } from '../../models/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [],
    imageConfigs: {
      width: 750,
      height: 600,
      radius: 0
    },
    priceConfigs: {
      bigFontSize: 60,
      smallFontSize: 28
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarousel()
  },

    // 获取首页轮播
	async getCarousel() {
		const list = await getCarousel({
			tabname: 'recommend'
		})
		this.setData({
			carouselList: list
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
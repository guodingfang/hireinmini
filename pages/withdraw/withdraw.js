// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWithdrawComplete: false,
    price: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onChangeInput (e) {
    this.setData({
      price: e.detail.value
    })
  },

  onClose() {
    this.setData({
      price: ''
    })
  },

  onAllWithdraw() {
    this.setData({
      price: 2000
    })
  },

  onWithdraw() {
    this.setData({
      isWithdrawComplete: !this.data.isWithdrawComplete
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
})
// pages/order-list/order-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        name: '商品订单',
        type: 'goods-order',
        select: true
      },
      {
        name: '租赁订单',
        type: 'lease-order'
      }
    ],
    statusList: [
      { type: 'all', name: '全部' },
      { type: 'notPay', name: '待付款' },
      { type: 'pay', name: '已付款' },
      { type: 'complete', name: '已完成' },
      { type: 'after', name: '售后' },
    ],
    goodsList: [],
  },

  onSelectTab(e) {
    this.setData({
      tabList: this.data.tabList.map(tab => tab.type === e.detail.type 
        ? {...tab, select: true} 
        : {...tab, select: false})
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
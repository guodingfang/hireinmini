import { getMessageList } from '../../models/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  async getMessageList ({ type = 'all' }) {
    const { code = -1, data = [] } = await getMessageList({
      unread: type
    })
    if (code === 0) {
      const newMessageList = data.filter(item => !(this.data.messageList.find(msg => msg.userid === item.userid)))
      const messageList = this.data.messageList.map(item => data.find(msg => msg.userid === item.userid) || item)
      this.setData({
        messageList: [...newMessageList, ...messageList]
      })
    }
    this.timer = setTimeout(() => {
			this.getMessageList({ type: 'new' })
		}, 10000)
  },

  onSkipDetail (e) {
    const { rid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/message-detail/message-detail?rid=${rid}`,
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
    this.getMessageList({})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer);
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
import { getAttentionedList, addAttention } from '../../models/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAttentionedList()
  },

  async getAttentionedList() {
    const list = await getAttentionedList()
    this.setData({
      list
    })
  },

  onSkipUserInfo(e) {
    const { userid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/content-account/content-account?userid=${userid}`
    })
  },

  async onUnFocus(e) {
    const { userid: targetuserid } = e.currentTarget.dataset
    await addAttention({
      targetuserid,
      focused: 0,
    })
    this.setData({
      list: this.data.list.filter(item => item.userid !== targetuserid)
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
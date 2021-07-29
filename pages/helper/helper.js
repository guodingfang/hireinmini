import {
  getknowledgeRecommend,
  getTopNQuestions
} from '../../models/helper'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledgeList: [],
    questionsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getknowledgeRecommend()
    this.getTopNQuestions()
  },

  // 知识推荐
  async getknowledgeRecommend() {
    const list = await getknowledgeRecommend({})
    this.setData({
      knowledgeList: list
    })
  },

  // 问答推荐
  async getTopNQuestions() {
    const list = await getTopNQuestions({})
    this.setData({
      questionsList: list
    })
  },

  onSkipTool() {
    wx.navigateTo({
      url: '/pages/calculator/calculator',
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
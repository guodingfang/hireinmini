import {
  getknowledgeRecommend,
  getTopNQuestions
} from '../../models/helper'

import { judgeTabBarHeight } from '../../utils/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerBlock: 0,
    tools: [{
        type: 'power',
        val: '功耗公式',
      }, {
        type: 'led',
        val: 'LED公式',
      }, {
        type: 'rhea',
        val: '雷亚架公式',
      }, {
        type: 'open',
        val: '开窗公式',
      }
    ],
    knowledgeList: [],
    questionsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHeaderBlock()
    this.getknowledgeRecommend()
    this.getTopNQuestions()
  },

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
    const { tabHeight } = judgeTabBarHeight(workInfo);
    console.log('statusBarHeight, headerTopHeader', statusBarHeight, headerTopHeader)
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader - 2,
			tabHeight,
		})
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
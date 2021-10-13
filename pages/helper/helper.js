import {
  getknowledgeRecommend,
  getTopNQuestions
} from '../../models/helper'
import { getLocationInfo } from '../../models/map'
import { login } from '../../models/user'
import { judgeTabBarHeight, isLogin } from '../../utils/util'


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
        type: 'ly',
        val: '雷亚架公式',
      }, {
        type: 'scal',
        val: '开窗公式',
      }
    ],
    knowledgeList: [],
    questionsList: [],
    locationInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHeaderBlock()
    this.getLocationInfo()
    this.getknowledgeRecommend()
    this.getTopNQuestions()
  },

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
    const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader - 2,
			tabHeight,
		})
  },
  
  async getLocationInfo() {
    const info = await getLocationInfo()
		this.setData({
			city: info.city,
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

  onSkipTool(e) {
    const login = isLogin()
    if(!login) return
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/tool/tool?type=${type}`,
    })
  },

  onSkipVip() {
    wx.showToast({
      title: '试用版本，该功能敬请期待',
      icon: 'none'
    })
  },

  getLocation(e) {
    this.setData({ locationInfo: e.detail.locationInfo })
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
    const { cityname = '' } = wx.getStorageSync('cityinfo')
    if(cityname !== this.data.cityname) {
      this.setData({
        cityname
      })
    }
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
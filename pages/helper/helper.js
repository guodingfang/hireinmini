import { getTopArticleList } from '../../models/article'
import { getLocationInfo } from '../../models/map'
import { judgeTabBarHeight, isLogin } from '../../utils/util'
import { remoteImagesUrl } from '../../config'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remoteImagesUrl,
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
        isVip: true
      }, {
        type: 'scal',
        val: '开窗公式',
      }
    ],
    knowledgeList: [],
    topArticleList: [],
    articleTotal: 0,
    locationInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHeaderBlock()
    this.getLocationInfo()
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

  // 问答推荐
  async getTopArticleList() {
    const { data, page } = await getTopArticleList({})
    this.setData({
      topArticleList: data,
      articleTotal: page.questioncounts
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
      title: '试用版本，敬请期待',
      icon: 'none'
    })
  },

  getLocation(e) {
    this.setData({ locationInfo: e.detail.locationInfo })
  },

  onPublishArticle () {
    wx.navigateTo({
      url: '/pages/article-publish/article-publish',
    })
  },

  onSkipArticleList () {
    wx.navigateTo({
      url: '/pages/article-list/article-list',
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
  async onShow () {
    const { cityname = '' } = wx.getStorageSync('cityinfo')
    if(cityname !== this.data.cityname) {
      this.setData({
        cityname
      })
    }
    await this.getTopArticleList()
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
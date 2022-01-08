import { getArticleList } from '../../models/article'


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    pagesize: 15,
    loadingComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderBlock()
    this.getArticleList()
  },

  getHeaderBlock() {
		const { statusBarHeight, headerTopHeader } = app.globalData;
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader - 2,
		})
  },

  async getArticleList () {
    if(this.data.loadingComplete) return
    const { data = [], page } = await getArticleList({
      page: this.data.page,
      pagesize: this.data.pagesize
    })
    if(page.rowcount < this.data.page * this.data.pagesize) {
      this.setData({
        loadingComplete: true
      })
    }
    this.setData({
      page: this.data.page + 1,
      list: [...this.data.list, ...data]
    })
  },

  onScrollButton () {
    this.getArticleList()
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

  }
})
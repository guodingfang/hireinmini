import { remoteImagesUrl } from '../../config'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { getUserBalanceLog, getBalanceSum } from '../../models/account'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    categorys: [],
    isScroll: false,
    detailData: [],
    page: 0,
    type: '',
    detailsLoading: false,
    isLoading: '下拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    this.getHeaderBlock()
    this.getBalanceSum()
    this.getUserBalanceLog()
  },

  getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader,
			tabHeight,
		})
  },

  async getBalanceSum () {
    const { balance, data } = await getBalanceSum({
      type: this.data.type,
      userid: 8469
    })
    this.setData({
      totalPrice: balance,
      categorys: data
    })
  },

  async onSelectType (e) {
    this.setData({
      type: e.detail.type,
      page: 0,
    })
    await this.getBalanceSum()
    await this.getUserBalanceLog()
  },

  async onLoadDetails () {
    if(!this.data.detailsLoading) {
      this.setData({
        page: this.data.page + 1,
        detailsLoading: true
      })
      await this.getUserBalanceLog()
      this.setData({
        detailsLoading: false
      })
    }
  },

  // 获取流水
  async getUserBalanceLog () {
    const { data, page } = await getUserBalanceLog({
      page: this.data.page,
      type: this.data.type,
      userid: 8469
    })

    this.setData({
      detailData: data,
      isLoading: '已经没有更多啦'
    })
  },

  onScrollTop () {
    this.setData({
      isScroll: false
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

  onPageScroll (e) {
    if(this.data.isScroll) {
      this.setData({
        isScroll: false
      })
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isScroll: true
    })
  },
})
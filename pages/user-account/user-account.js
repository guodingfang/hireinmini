import { remoteImagesUrl } from '../../config'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { login } from '../../models/user'
import { getAccountType, getUserBalance, getUserBalanceLog, getBalanceSum } from '../../models/account'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImagesUrl: `${remoteImagesUrl}/user-account.png`,
    categorys: [],
    categorysDetails: [],
    isScroll: false,
    detailData: [],
    page: 1,
    pagesize: 20,
    type: '',
    detailsLoading: false,
    isLoadingComplete: false,
    isLoading: '下拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    this.getHeaderBlock()
    this.getAccountType()
    this.getBalanceSum()
    this.getUserBalanceLog()
  },

  async onSetUserInfo() {
    await login()
  },

  async getAccountType () {
    const { data = [] } = await getAccountType()
    this.setData({
      categorys: [{
        typecode: '',
        typename: '全部'
      }, ...data]
    })
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
    const { data } = await getBalanceSum({
      type: this.data.type,
    })
    this.setData({
      categorysDetails: data
    })
  },

  async onSelectType (e) {
    this.setData({
      type: e.detail.type,
      isLoadingComplete: false,
      page: 0,
    })
    await this.getBalanceSum()
    await this.getUserBalanceLog({ reset: true })
  },

  async onLoadDetails () {
    if(!this.data.detailsLoading && !this.data.isLoadingComplete) {
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
  async getUserBalanceLog (option = {}) {
    const { reset = false } = option
    const { data, page } = await getUserBalanceLog({
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: this.data.type,
    })

    if(this.data.page * this.data.pagesize >= page.rowcount) {
      this.setData({
        isLoadingComplete: true,
        isLoading: '已经没有更多啦'
      })
    } else {
      this.setData({
        isLoadingComplete: false,
        isLoading: '下拉加载更多'
      })
    }

    this.setData({
      detailData: reset ? data : [...this.data.detailData, ...data],
    })
  },

  async getUserBalance() {
    const { balance = '0.00' } = await getUserBalance({})
    this.setData({
      totalPrice: balance
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
    this.getUserBalance()
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this
    wx.pageScrollTo({
      scrollTop: 2000,
      duration: 100,
      success() {
        that.setData({
          isScroll: true
        })
      }
    })
  },
})
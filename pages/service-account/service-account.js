import { getCompanyInfo } from '../../models/company'
import { getCompanyGoodsList } from '../../models/goods'
import config from '../../config'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    carouselList: [],
    goodsList: [],
    imageConfigs: {
      width: 690,
      height: 450,
      radius: 20
    },
    type: 'about',
    tabList: [{
      type: 'about',
      name: '简介',
      select: true
    }, {
      type: 'service',
      name: '服务'
    }, {
      type: 'comment',
      name: '评论'
    }],
    companyid: '',
    imgUrl: config.imgUrl,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { companyid = '' } = options
    this.setData({
      companyid
    })
    this.getCompanyInfo()
    this.getCompanyGoodsList()
  },

  async onAgainRequestCompany() {
    this.getCompanyInfo()
    this.getCompanyGoodsList()
  },

  async getCompanyInfo() {
    const info = await getCompanyInfo({ id: this.data.companyid })
    this.setData({
      info,
      carouselList: info.compamypiclist.map(item => ({
        ...item,
        picfile: item.picfilename
      }))
    })
  },

  async getCompanyGoodsList() {
    const { data } = await getCompanyGoodsList({
      companyid: this.data.companyid,
      type: 'recommend',
      page: 1,
      pagesize: 10
    })
    this.setData({
      goodsList: data.data
    })
  },

  onSelectTab(e) {
    const { type } = e.detail
    this.setData({
      type,
      tabList: this.data.tabList.map(tab => tab.type === type ? {...tab, select: true} : {...tab, select: false})
    })
  },

  onEnterCompany() {
    const { companyid = '' } = this.data
    wx.navigateTo({
      url: `/pages/company-setup/company-setup?companyid=${companyid}`,
    })
  },
  onCompanyManage() {
    wx.navigateTo({
      url: '/pages/product-manage/product-manage',
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
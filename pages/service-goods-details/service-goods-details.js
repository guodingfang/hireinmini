import { getGoodsDetail } from '../../models/goods'
import { getCompanyInfo } from '../../models/company'
import config from '../../config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [],
    imageConfigs: {
      width: 750,
      height: 600,
      radius: 0
    },
    priceConfigs: {
      bigFontSize: 40,
      smallFontSize: 28
    },
    contentAccont: null,
    imgUrl: config.imgUrl,
    prodid: '',
    detail: null,
    companyInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { prodid = '' } = options
    this.setData({
      prodid,
    })
    await this.getGoodsDetail()
    await this.getCompanyInfo()
  },

  async getGoodsDetail() {
    const detail = await getGoodsDetail({
      prodid: this.data.prodid
    })
    this.setData({
      detail,
      carouselList: detail.pics
    })
  },

  async getCompanyInfo() {
    const { detail, imgUrl } = this.data;
    const companyInfo = await getCompanyInfo({
      id: detail.companyid
    })
    this.setData({
      contentAccont: {
        logo: `${imgUrl}${companyInfo.logopic}`,
        name: companyInfo.companyname,
        des: companyInfo.briefintroduction,
      },
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
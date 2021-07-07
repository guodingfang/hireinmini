// pages/equipmentDetail/equipmentDetail.js
import { Config } from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrl: Config.imgUrl,
      autoplay: true, //轮播图配置
      interval: 5000, //轮播图配置
      duration: 1000, //轮播图配置
      imglist: [],
      indicatorDots: true, //轮播图配置
      detailList: {
          // "rent": "40元/m²/天/2天",
          // "rentLong1": "30元/m²/3天",
          // "rentLong2": "20元/m²/5天",
          // "params": "P3.91",
          // "point": "128*128",
          // "light": "800ccd",
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.request({
        url: Config.baseUrl + 'Company/getGoodsDetail',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { prodid: options.prodid },
        // data: { prodid: 884 },
        method: 'POST',
        success: function (res) {
            if(res.statusCode == 200){
              // console.log("res=", res);
              that.setData({
                imglist: res.data.pics,
                detailList: res.data
              })
            }
        }
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
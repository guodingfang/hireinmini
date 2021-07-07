// pages/detaillocation/detaillocation.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    controls: [],
    markers: [],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取当前位置
    wx.getLocation({
      success: function (res) {
        //经度
        var longitude = res.longitude
        //纬度
        var latitude = res.latitude
        //把实际的经纬度赋值个当前对象的拷贝
        that.setData({
          longitude: longitude,
          latitude: latitude
        })
        wx.chooseLocation({
          success: function (res) {
            that.setData({
              name: res.name,
              addres: res.address,
            })
            var addres = that.data.addres;
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            var infos = prevPage.data.info;
            infos.address =  addres;
            prevPage.setData({
              info : infos
            })         
            wx.navigateBack();
          },
          
        })
      },
      fail: function (res) {
          
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('map')
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
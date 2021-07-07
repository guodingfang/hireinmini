// pages/createOrganize/createOrganize.js
import {Config} from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    cityname: '', //城市
    citycode: '', //城市code
    typeDefault: "请选择类型",
    typeList: [
      {type: "类型一"},
      {type: "类型二"},
      {type: "类型三"},
    ],
    index: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /*获取城市*/
  getPortid: function(e) {
    wx.navigateTo({
        url: '../citylist/citylist?rurl=release'
    })
  },
  // 选择类型
  selectType(e){
    // console.log("e", e)
    var index = e.detail.value;
    this.setData({
      index: index
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
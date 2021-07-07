// const { fa } = require("../../utils/pinYin");
import { Config } from '../../utils/config.js';
// pages/serverPage/serverPage.js
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
      recommendEquipment: [
        {
          "name": "设备名字",
          "price": "40元/m²/2天",
          "size": "500mm*500mm",
          "brand": "设备品牌",
        },
        {
          "name": "设备名字",
          "price": "40元/m²/2天",
          "size": "500mm*500mm",
          "brand": "设备品牌",
        },
      ],  //推荐设备
      favouriteEquipment: [
        {
          "name": "设备名字",
          "price": "40元/m²/2天",
          "size": "500mm*500mm",
          "brand": "设备品牌",
        },
        {
          "name": "设备名字",
          "price": "40元/m²/2天",
          "size": "500mm*500mm",
          "brand": "设备品牌",
        },
      ], //最受欢迎设备
      number: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击更多
  more(e){
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/equipmentList/equipmentList?type='+type,
    })
  },
  getCompanyInfo(){
    var that = this;
    var userinfo = wx.getStorageSync('userinfo');
    var companyid = userinfo.companyid;
    // console.log("userinfo=", userinfo)
    wx.request({
      url: Config.baseUrl + 'Company/companyHomePage',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { companyid: 2191 },
      method: 'POST',
      success: function (res) {
          // console.log("res=", res);
          if(res.statusCode == 200){
            that.setData({
              imglist: res.data.pics,
              favouriteEquipment: res.data.hot,
              recommendEquipment: res.data.recommend
            })
          }
      }
    })
  },
  // 点击租
  rentClick(e){
    // console.log("e==",e);
    // console.log("e==",this.data.recommendEquipment);
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var recommendEquipment = this.data.recommendEquipment;
    var favouriteEquipment = this.data.favouriteEquipment;
    var number = this.data.number;
    if(type == "recommend"){  //推荐设备
      var rent = recommendEquipment[index].rent;
      if(rent){
        number -= 1;
        delete recommendEquipment[index].rent;
      }else{
        number += 1;
        recommendEquipment[index].rent = true;
      }
      this.setData({
        number: number,
        recommendEquipment: recommendEquipment
      })
    }
    if(type == "favourite"){  //最受欢迎设备
      var rent = favouriteEquipment[index].rent;
      if(rent){
        number -= 1;
        delete favouriteEquipment[index].rent
      }else{
        number += 1;
        favouriteEquipment[index].rent = true;
      }
      this.setData({
        number: number,
        favouriteEquipment: favouriteEquipment
      })
    }
  },
  // 进入客服页面
  toCustomerService(){
    wx.navigateTo({
      url: '/pages/customerService/customerService',
    })
  },
  // 进入详情页
  toDetail(e){
    var prodid = e.currentTarget.dataset.prodid;
    wx.navigateTo({
      url: '/pages/equipmentDetail/equipmentDetail?prodid='+prodid,
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
      this.setData({
        number: 0
      })
      this.getCompanyInfo();
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
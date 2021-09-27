// pages/equipmentList/equipmentList.js
import { Config } from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: Config.imgUrl,
    type: '',
    // page: 1,
    total: '',
    equipmentList: [],
    number: 0,
  },
  page: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    this.setData({
      type: type
    })
    this.getRecommendGoodsList(this.page);
  },
  // 获取列表
  getRecommendGoodsList(page){
    var that = this;
    var userinfo = wx.getStorageSync('userinfo');
    var type = this.data.type;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: Config.baseUrl + 'Company/companyRecommendGoodsList',
      header: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { companyid:2191, type:type, page:page },
      // data: { companyid:userinfo.companyid, type:type, page:page },
      method: 'POST',
      success: function (res) {
          if(res.statusCode == 200){
            console.log("res=", res);
            var equipmentList = that.data.equipmentList;
            var newEquipmentList = [];
            var getEquipmentList = res.data.data.data;
            newEquipmentList = equipmentList.concat(getEquipmentList);
            that.setData({
              total: res.data.data.page.pagecount,
              equipmentList: newEquipmentList
            })
          }
      }
    })
    wx.hideLoading();
  },
  // 点击租
  rentClick(e){
    var index = e.currentTarget.dataset.index;
    var equipmentList = this.data.equipmentList;
    var number = this.data.number;
    var rent = equipmentList[index].rent;
    if(rent){
      number -= 1;
      delete equipmentList[index].rent;
    }else{
      number += 1;
      equipmentList[index].rent = true;
    }
    this.setData({
      number: number,
      equipmentList: equipmentList
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
    console.log("上拉加载。。。");
    // var page = this.data.page;
    //上次网络返回数据小于10条，则没有上拉操作
    if (Number(this.data.total) <= Number(this.page)) {
      console.log("最后一页")
      return;
    }
    this.page++;
    console.log(this.page);
    this.getRecommendGoodsList(this.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
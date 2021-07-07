// pages/company-manage/company-manage.js
import { Config } from '../../utils/config.js';
var config = new Config();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '公司管理'
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
* 跳转到主页
*/
    returnindex: function (e) {
        config.permission('index/index', function () {
            wx.switchTab({
                url: '../index/index'
            })
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
   * 跳转到精选图片
   */
    picture: function (e) {
        config.permission('com-picture/com-picture', function () {
        wx.navigateTo({
            url: '../com-picture/com-picture',
        })
        })
    },
    /**
  * 跳转到精选视频
  */
    video: function (e) {
        config.permission('com-video/com-video', function () {
        wx.navigateTo({
            url: '../com-video/com-video',
        })
        })
    },
    /**
  * 跳转到公司修改
  */
    comselect: function (e) {
        var companyid = wx.getStorageSync('userinfo').companyid;
        config.permission('establish_company/establish_company', function () {
        wx.redirectTo({
            url: '../establish_company/establish_company?companyid=' + companyid,
        })
        })
    },

    /**
   * 跳转到产品管理
   */
    product: function (e) {
        config.permission('product-manage/product-manage', function () {
        wx.navigateTo({
            url: '../product-manage/product-manage',
        })
        })
    },

})
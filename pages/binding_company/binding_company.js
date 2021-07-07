// pages/binding_company/binding_company.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
/*绑定公司 */
var GetList = function (that) {
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    var companyname = that.data.companyname;
    wx.request({
        url: Config.baseUrl + 'Company/getCompanyList',
        data: { companyname: companyname, userid: userid, },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                list: data.data.data,
            })
        }
    })
}
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
            title: '绑定公司'
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
    * 点击加入公司
     */
    joincompany: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission('company_select/company_select', function () {
        wx.navigateTo({
            url: '../'+url,
        })
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
   * 获取公司名字
   */
    companyname: function (e) {
        this.setData({
            companyname: e.detail.value
        })
    },

    /**
     * 搜索
     */
    search: function (e) {
        this.setData({
            list: [],
        })
        GetList(this);
    },
})
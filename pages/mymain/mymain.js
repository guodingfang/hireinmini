// pages/mymain/mymain.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
/*获取主营产品列表*/
var getmainlist = function (that) {
    wx.request({
        url: Config.baseUrl + "Company/getProductList",
        data: {
            companyid: wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0,
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            that.setData({
                list: res.data,
                loadingHidden: true
            })
        }
    });
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: false,
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '主营产品管理'
        })
        //获取主营产品列表
        getmainlist(this);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
        this.setData({
            list: [],
        })
        //获取主营产品列表
        getmainlist(this);
        //停止刷新
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    /**
    * 点击进入产品、
    */
    add_mymain: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 跳转到新增商品页面
     */
    addmain: function (event) {
        config.permission('add_mymain/add_mymain', function () {
            wx.navigateTo({
                url: '../add_mymain/add_mymain',
            })
        })
    }
})
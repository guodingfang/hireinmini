// pages/main/main.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
/*获取主营产品列表*/
var getmainlist = function (that) {
    wx.request({
        url: Config.baseUrl + "Company/getProductList",
        data: {
            companyid: wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 164,
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
        list: [],
        loadingHidden: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '主营产品'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //获取主营产品列表
        getmainlist(this);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //下拉  
        p = 0;
        this.setData({
            list: [],
        });
        var that = this
        GetList(that);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        var that = this
        GetList(that);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /*跳转到我的公司页面*/
    tabcompany: function (event) {
        config.permission('mycompany/mycompany', function () {
            wx.redirectTo({
                url: '../mycompany/mycompany',
            })
        })
    }
})

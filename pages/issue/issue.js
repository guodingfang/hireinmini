// pages/issue/issue.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pagehide: false,
        notLogin: true,
        notRegister: true,
        loadingHidden: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '发布'
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
        var that = this;
        // 获取信息
        getInfo(that);
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
    * 点击进入发单、求租、出售、求购
    */
    choosetype: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 查询code是否过期
     */
    getCode: function (e) {
        app.wxLogin(function () { });
    },

    /**
     * 登录
     */
    login: function (e) {
        if (e.detail != '') {
            wx.setStorageSync('getPhoneNumber', e.detail);
        }
        var that = this;
        //登录
        config.userLogin(function () {
            getInfo(that);
        });
    },

    /**
     * 手机号注册跳转
     */
    register: function () {
        // 跳转注册页面
        wx.navigateTo({
            url: "../register/register",
        })
    }
})

/**
 * 获取信息
 */
function getInfo(that) {
    config.judgeUserinfo(function(res){
        if(res == 1){
            /* 查询用户信息缓存是否失效 */
            app.judgeLogoNBrace(function () {
                that.setData({
                    pagehide: false,
                    notLogin: true,
                    notRegister: true,
                    loadingHidden: true,
                })
            })
        }else if(res == 2){
            that.setData({
                pagehide: true,
                notLogin: true,
                notRegister: false,
                loadingHidden: true,
            })
        }else if(res == 3){
            that.setData({
                loadingHidden: false,
            })
            app.wxLogin(function () {
                app.getWxUserInfo(function () {
                    getInfo(that);
                })
            });
        }else {
            that.setData({
                pagehide: true,
                notLogin: false,
                notRegister: true,
                loadingHidden: true,
            })
        }
    })
}
// pages/company_select/company_select.js
import {
    Config
} from '../../utils/config.js';
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
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '公司管理'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 获取用户信息
        getInfo(this);
    },
    /**
     * 点击进入选择公司类型
     */
    aboutcompany: function(event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function() {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 跳转到主页
     */
    returnindex: function(e) {
        config.permission('index/index', function() {
            wx.switchTab({
                url: '../index/index'
            })
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 查询code是否过期
     */
    getCode: function(e) {
        app.wxLogin(function() {});
    },

    /**
     * 登录
     */
    login: function(e) {
        if (e.detail != '') {
            wx.setStorageSync('getPhoneNumber', e.detail);
        }
        var that = this;
        //登录
        config.userLogin(function() {
            getInfo(that);
        });
    },

    /**
     * 手机号注册跳转
     */
    register: function() {
        config.permission('register/register', function() {
            // 跳转注册页面
            wx.navigateTo({
                url: "../register/register",
            })
        })
    }
})

/**
 * 获取信息
 */
function getInfo(that) {
    if (wx.getStorageSync('userinfo').userid > 0) {
        /* 查询用户信息缓存是否失效 */
        app.judgeLogoNBrace(function() {
            var companyid = wx.getStorageSync('userinfo').companyid;
            if (companyid > 0) {
                // config.permission('companydetails/companydetails', function () {
                wx.redirectTo({
                    url: '../companydetails/companydetails?typeid=1&companyid=' + companyid,
                })
                // })
            } else {
                that.setData({
                    pagehide: false,
                    notLogin: true,
                    notRegister: true,
                    loadingHidden: true,
                })
            }
        })

    }
}
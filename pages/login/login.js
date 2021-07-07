// pages/login/login.js
import {
    Config
} from '../../utils/config.js';
import emoji from '../../utils/emoji';
var login = require('../../template/login.js');
var config = new Config();
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accesstoken: '',
        userid: 0,
        unionid: 0,
        userinfo: [],
        verification: "获取验证码",
        phone: '',
        logourl: '',
        canGetUserProfile: false,  //使用getUserProfile取用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        var userinfo = wx.getStorageSync('userinfo');
        this.setData({
            userinfo: userinfo,
        })
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        this.getLogoUrl();
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
        // 判断用户登录信息是否缓存
        config.userLogin(function() {
            var userinfo = wx.getStorageSync('userinfo');
            var userid = userinfo.userid ? userinfo.userid : 0;
            var code = userinfo.code ? userinfo.code : 2;
            if (userid > 0) {
                wx.navigateBack({
                    delta: 1
                })
            } else {
                app.getWxCode();
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /*取系统logo*/
    getLogoUrl: function(e) {
        var that = this;
        wx.request({
            url: Config.baseUrl + "WXAppLogin/getWxMiniLogo",
            data: {
                userid: that.data.userid,
                accesstoken: that.data.accesstoken,
                unionid: that.data.unionid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                console.log('logo url:',res);
                if (res.data.logo.length>0) {
                    that.setData({
                        logourl: Config.imgUrl + res.data.logo
                    })
                }
            }
        })
    },
})
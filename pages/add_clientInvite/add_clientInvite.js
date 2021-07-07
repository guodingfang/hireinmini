// pages/add_clientInvite/add_clientInvite.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var login = require('../../template/login.js');
var config = new Config();
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        companyname: '',
        logourl: '',
        canGetUserProfile: false,  //使用getUserProfile取用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        wx.setNavigationBarTitle({
            title: '邀请加入'
        })
        var id = options.id;
        var companyname = options.companyname;
        this.setData({
            id: id,
            companyname: companyname,
        })
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        that.getLogoUrl();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        // 获取用户信息
        getInfo(that);
    },

    /**
     * 确定
     */
    confirm: function () {
        var id = this.data.id;
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        wx.request({
            url: Config.baseUrl + 'Customer/thirdPartyConfirm',
            data: { id: id, userid: userid },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (res) {
                console.info(res.data);
                if (res.data.result){
                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        success: function(){
                            wx.switchTab({
                                url: '../index/index',
                            })
                        }
                    })
                }
            }
        })
    },

    /**
     * 取消
     */
    cancel: function () {
        config.modalqd('确定取消吗? ',function(res){
            if(res.confirm){
                wx.switchTab({
                    url: '../index/index',
                })
            }
        })
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

/**
 * 获取信息
 */
function getInfo(that) {
    config.userLogin(function () {
        /* 查询用户信息缓存是否失效 */
        app.judgeLogoNBrace(function () {
            that.setData({
                pagehide: false,
                notLogin: true,
                notRegister: true,
                loadingHidden: true,
            })
        })
    })
}
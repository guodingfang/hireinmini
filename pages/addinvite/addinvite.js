// pages/addinvite/addinvite.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var login = require('../../template/login.js');
var config = new Config();
var app = getApp();
/*接受邀请*/
function acceptinvite(that, submitdata) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + 'Employee/inviteJoin',
        data: submitdata,
        method: "post", 
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
            wx.hideLoading();
            if (res.data.result) {
                wx.showToast({
                    title: "提交成功",
                    icon: 'success',
                    duration: 2000,
                    success: function (e) {
                        config.permission('index/index', function () {
                        wx.reLaunch({
                            url: "../index/index"
                        })
                        })
                    }
                })
            } else {
                config.modaljy(res.data.msg);
            }
        }

    })
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        notLogin: true,
        userinfo: [],
        verification: "获取验证码",
        phone: '',
        verificationCode: '',
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
        var companyname = options.companyname;
        var invitecode = options.invitecode;
        this.setData({
            companyname: companyname,
            invitecode: invitecode
        })
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        that.getLogoUrl();
    },
    onShow: function () {
        /*sh*/
        userInfo_cache(this);
    },
    
    chooseuser: function (e) {
        var that = this;
        var submitdata = e.detail.value;
        var recontactphone = /^[1][123457890][0-9]{9}$/;//手机号
        if (submitdata.employeename == "") {
            config.modaljy("请输入姓名");
            return;
        }
        if (!recontactphone.test(submitdata.phone)) {
            config.modaljy("请输入正确的联系方式");
            return;
        }
        submitdata['invitecode'] = that.data.invitecode;
        submitdata['reguserid'] = wx.getStorageSync("userinfo").reguserid;
        submitdata['userid'] = wx.getStorageSync("userinfo").userid;
        acceptinvite(that, submitdata);
    },
    /*sh*/
    login: function () {
        // 获取本地缓存的用户信息
        userInfo_cache(this);
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

function userInfo_cache(that) {
    config.userLogin(function () {
        var userinfo = wx.getStorageSync('userinfo');
        if (userinfo.code > 0) {
            that.setData({
                pagehide: true,
                notLogin: true,
                notRegister: false,
                loadingHidden: true,
                userinfo: userinfo,
            })
            app.getWxCode();
        } else {
            /* 查询用户信息缓存是否失效 */
            app.judgeLogoNBrace(function () {
                that.setData({
                    pagehide: false,
                    notLogin: true,
                    notRegister: true,
                    loadingHidden: true,
                })
            })
        }
        // if (res == 1) {
        //     /* 查询用户信息缓存是否失效 */
        //     app.judgeLogoNBrace(function () {
        //         that.setData({
        //             pagehide: false,
        //             notLogin: true,
        //             notRegister: true,
        //             loadingHidden: true,
        //         })
        //     })
        // } else if (res == 2) {
        //     that.setData({
        //         pagehide: true,
        //         notLogin: true,
        //         notRegister: false,
        //         loadingHidden: true,
        //     })
        // } else if (res == 3) {
        //     that.setData({
        //         loadingHidden: false,
        //     })
        //     app.wxLogin(function () {
        //         app.getWxUserInfo(function () {
        //             userInfo_cache(that);
        //         })
        //     });
        // } else {
        //     that.setData({
        //         pagehide: true,
        //         notLogin: false,
        //         notRegister: true,
        //         loadingHidden: true,
        //     })
        // }
    })
}
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var userid;
var companyid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: [],
        created: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的公司'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 20;
        companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        //获取公司基本信息
        getUserCompanyInfo(this);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
     * 跳转到主营产品页面
     */
    main: function (event) {
        config.permission('main/main', function () {
            wx.redirectTo({
                url: '../main/main',
            })
        })
    },

    /**
     * 跳转修改公司页面
     */
    exitCompany: function (event) {
        config.permission('establish_company/establish_company', function () {
            wx.redirectTo({
                url: '../establish_company/establish_company?companyid=' + companyid,
            })
        })
    },

    /**
     * 解除公司绑定
     */
    relieve: function (event) {
        wx.request({
            url: Config.baseUrl + 'Company/relieveMyCompany',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: { id: wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 140 },
            method: 'POST',
            success: function (res) {
                if (res.data.result == true) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            wx.removeStorageSync('userinfo');
                            config.permission('user/user', function () {
                                wx.switchTab({
                                    url: '../user/user',
                                })
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        })
    },

    /**
     * 删除我的公司
     */
    delCompany: function (e) {
        wx.request({
            url: Config.baseUrl + 'Company/delMyCompany',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: { id: companyid },
            method: 'POST',
            success: function (res) {
                if (res.data.result == true) {
                    wx.removeStorageSync('userinfo');
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            config.permission('user/user', function () {
                                wx.switchTab({
                                    url: '../user/user',
                                })
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        })
    }
})

/**
 * 获取公司基本信息
 */
function getUserCompanyInfo(that) {
    wx.request({
        url: Config.baseUrl + 'Company/getMyCompanyInfo',
        data: { companyid: companyid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.createdby == userid) {
                that.setData({
                    created: false,
                })
            }
            that.setData({
                info: res.data,
            })
        }
    })
}
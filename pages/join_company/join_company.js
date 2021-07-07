// pages/join_company/join_company.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var companyid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        employeename: '',
        phone: '',
        comments: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '申请加入'
        })
        var phone = wx.getStorageSync('userinfo').phone;
        //获取我的公司信息
        this.setData({
            phone: phone,
        })
        companyid = options.companyid;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var url = Config.baseUrl + 'Company/joinCompany';
        var employeename = e.detail.value.employeename;

        if (employeename == '') {
            config.modaljy("请输入姓名");
            return;
        }
        var phone = this.data.phone;
        var comments = e.detail.value.comments;
        if (comments == '') {
            config.modaljy("请输入申请理由");
            return;
        }
        e.detail.value.phone = phone;
        e.detail.value.userid = userid;
        e.detail.value.companyid = companyid;
        wx.request({
            url: url,
            data: e.detail.value,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                if (res.data.result == true) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        complete: function () {
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
                        icon: '失败',
                        duration: 2000,
                    })
                }
            }
        })
    }
})
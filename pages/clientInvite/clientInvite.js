// pages/clientInvite/clientInvite.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var id; // 邀请id
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
            title: '第三方邀请'
        })
        id = options.id;
        var companyname = wx.getStorageSync('userinfo').companyname ? wx.getStorageSync('userinfo').companyname : '';
        this.setData({
            id: id,
            companyname: companyname,
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var companyname = this.data.companyname;
        return {
            title: '第三方邀请',
            path: 'pages/add_clientInvite/add_clientInvite?companyname=' + companyname + '&id=' + id
        }
    },


})
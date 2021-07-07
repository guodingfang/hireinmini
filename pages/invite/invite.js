// pages/invite/invite.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
/*发送邀请*/
function addinvite(that) {
    wx.request({
        url: Config.baseUrl + 'Employee/inviteMember',
        data: {
            userid: that.data.userid,
            employeeid: that.data.employeeid,
            companyid: that.data.companyid
        },
        method: "post",
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
            if (res.data.result) {
                that.setData({
                    invitecode: res.data.invitecode
                })
            }

        }

    })
}
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
            title: '成员邀请'
        })
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var companyname = wx.getStorageSync('userinfo').companyname ? wx.getStorageSync('userinfo').companyname : '';
        this.setData({
            companyid: companyid,
            userid: userid,
            employeeid: employeeid,
            companyname: companyname,
        })
        /*调用addinvite方法发送邀请获取邀请码*/
        addinvite(this);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var companyname = this.data.companyname;
        var invitecode = this.data.invitecode;
        return {
            title: '邀请成员',
            path: 'pages/addinvite/addinvite?companyname=' + companyname + '&invitecode=' + invitecode
        }
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


})


'use strict';
import { Config } from '../../utils/config.js';
var config = new Config();
/*执行反馈备注提交*/
var getLeaseDetail = function (orderid, companyid, that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Lease/leasedetail",
        data: {
            orderid: orderid,
            companyid: companyid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            wx.hideLoading();
            that.setData({
                orderinfo: res.data.orderinfo,
                detailinfo: res.data.specinfo,
            })
        }
    });
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
            title: '租赁详情'
        })
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;

        this.setData({
            orderid: options.orderid,
            leaseorderid: options.orderid,
            companyid: companyid
        })
        getLeaseDetail(this.data.orderid, this.data.companyid, this);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
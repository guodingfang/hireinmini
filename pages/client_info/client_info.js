// pages/client_info/client_info.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var customerid = '';
var customername;
//获取客户详情
var getclient = function (that) {
    wx.request({
        url: Config.baseUrl + 'Customer/getCustomerInfo',
        data: { customerid: customerid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                info: data.data,
            })
            customername = data.data.customername;
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sliderLeft: 64,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '客户详情'
        })
        customerid = options.id;
        if (options.customerid > 0) {
            customerid = options.customerid;
            customername = options.customername;
        }
        getclient(this);
    },

    /**
     * 跳转修改
     */
    clickEdit: function (e) {
        config.permission('add_client/add_client', function () {
        wx.redirectTo({
            url: '../add_client/add_client?customerid=' + customerid,
        })
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
    /**
     * 页面跳转
     */
    skip: function (e) {
        var url = config.getDataSet(e,'url');
        config.permission(url, function () {
        wx.redirectTo({
            url: '../' + url+'?customerid=' + customerid + '&customername=' + customername,
        })
    })
    }
})
// pages/contact/contact.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var customerid;
var customername;
/*获取指定客户的联系人信息 */
var GetList = function (that) {
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    wx.request({
        url: Config.baseUrl + 'Customer/getCustomerContacts',
        data: { customerid: customerid, userid: userid, employeeid: employeeid, customername: customername, companyid: companyid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                list: data.data.data,
            })
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sliderLeft: 316,
        list: [],
        customername: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '联系人'
        })
        
        if (options.customerid > 0) {
            customerid = options.customerid;
            customername = options.customername;
            this.setData({
                customername: customername,
            })
        }
        GetList(this);
    },

    /**
     * 页面跳转
     */
    skip: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
            wx.redirectTo({
                url: '../' + url +'?customerid= ' + customerid + ' &customername=' + customername,
            })
        })
    },
    /**
     * 跳转新增
     */
    addcont: function (e) {
        config.permission('add_contact/add_contact', function () {
            wx.redirectTo({
                url: '../add_contact/add_contact?customerid=' + customerid + '&customername=' + customername,
            })
        })
    },

    /*拨打电话*/
    callme: function (e) {
        var callphone = config.getDataSet(e, 'phone');
        wx.makePhoneCall({
            phoneNumber: callphone,
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
     * 跳转修改
     */
    clickEdit: function (e) {
        var contid = config.getDataSet(e, 'contid');
        config.permission('add_contact/add_contact', function () {
            wx.redirectTo({
                url: '../add_contact/add_contact?contid=' + contid + '&customername=' + customername + '&customerid=' + customerid,
            })
        })
    },
    /**
     * 跳转删除
     */
    clickDel: function (e) {
        var contid = config.getDataSet(e, 'contid');
        var url = Config.baseUrl + 'Customer/delCustomerContact';
        var that = this;
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { userid: userid, contid: contid },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'post',
                        success: function (res) {
                            if (res.data.result == true) {
                                wx.showToast({
                                    title: "删除成功",
                                    icon: 'success',
                                    duration: 2000,
                                    success: function (e) {
                                        that.setData({
                                            list: [],
                                        });
                                        GetList(that);
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: "删除失败",
                                    icon: 'success',
                                    duration: 2000,
                                })
                            }
                        }
                    })
                }
            }
        })
    },
})
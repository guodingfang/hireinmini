// pages/add_contact/add_contact.js
var statusArrs = [false];
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var customerid;
var customername;
/**
 * 获取联系人详情
 */
var getInfo = function (that, options) {
    wx.request({
        url: Config.baseUrl + 'Customer/getContactInfo',
        data: options,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                contname: data.data.contname,
                phone: data.data.phone,
                gender: data.data.gender,
                gendername: data.data.gendername,
            })
        }
    })
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contname: '',
        phone: '',
        sexid: 1,
        gendername: '',
        sexlist: [{ sexid: 0, gendername: '女' }, { sexid: 1, gendername: '男' }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.contid > 0) {
            wx.setNavigationBarTitle({
                title: '修改联系人'
            })

            this.setData({
                contid: options.contid,
            })

        } else {
            wx.setNavigationBarTitle({
                title: '新增联系人'
            })

            this.setData({
                contid: 0,
            })
        }

        if (options.customerid > 0) {
            customerid = options.customerid;
            customername = options.customername;
        }
        if (options.contid > 0) {
            var contid = options.contid;
            getInfo(this, options);
        }
    },

    /**
     * 性别选择
     */
    getsexid: function (e) {
        var id = e.currentTarget.id;
        statusArrs = [false];
        this.setData({
            id: e.detail.value,
            sexid: this.data.sexlist[e.detail.value].sexid,
            gendername: this.data.sexlist[e.detail.value].gendername
        });
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
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        if (!this.data.contid) {
            var url = Config.baseUrl + 'Customer/addCustomerContact';
        } else {
            var url = Config.baseUrl + 'Customer/editCustomerContact';
        }
        var contactname = e.detail.value.contactname;
        if (contactname == '') {
            config.modaljy("请输入名称");
            return;
        }
        var contactphone = e.detail.value.contactphone;
        var yanphone = /^[1][123457890][0-9]{9}$/;//手机号
        if (!yanphone.test(e.detail.value.contactphone)) {
            config.modaljy("请输入正确的联系方式");
            return;
        }
        e.detail.value.contid = this.data.contid;
        e.detail.value.companyid = companyid;
        e.detail.value.userid = userid;
        e.detail.value.customerid = customerid;
        e.detail.value.customername = customername;
        e.detail.value.employeeid = employeeid;
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
                            config.permission('contact/contact', function () {
                            wx.redirectTo({
                                url: "../contact/contact",
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
})
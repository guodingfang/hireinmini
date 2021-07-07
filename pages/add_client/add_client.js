// pages/add_client/add_client.js
var statusArrs = [false];
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
/**
 * 获取客户详情
 */
var getInfo = function (that, options) {
    wx.request({
        url: Config.baseUrl + 'Customer/getCustomerInfo',
        data: options,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                customerid: data.data.customerid,
                customername: data.data.customername,
                address: data.data.address,
            })
        }
    })
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        edit: false,//修改时，隐藏联系人添加。新增时显示。
        contname: '',
        phone: '',
        sexid: 1,
        gendername: '',
        address: '',
        sexlist: [{ sexid: 0, gendername: '女' }, { sexid: 1, gendername: '男' }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.customerid > 0) {
            wx.setNavigationBarTitle({
                title: '修改客户'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '新增客户'
            })
        }
        if (options.customerid > 0) {
            this.setData({
                edit: true,
            })
            getInfo(this, options);
        }
    },
    /**
     * 页面显示
     */

    onShow: function () {

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
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var judge;
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        var customerid = e.detail.value.customerid;
        var customername = e.detail.value.customername;
        if (customername == '') {
            config.modaljy("请输入名称");
            return;
        }
        var address = e.detail.value.address;
        if (address == '') {
            config.modaljy("输入地址");
            return;
        }
        
        if (customerid == '') {
            var url = Config.baseUrl + 'Customer/addCustomerAndContact';
            var contactname = e.detail.value.contactname;
            if (contactname == '') {
                config.modaljy("请输入姓名");
                return;
            }
            var gender = e.detail.value.sexid;
            var contactphone = e.detail.value.contactphone;
            var yanphone = /^[1][123457890][0-9]{9}$/;//手机号
            if (!yanphone.test(e.detail.value.contactphone)) {
                config.modaljy("请输入正确的联系方式");
                return;
            }
            judge = true;//判定修改与新增。
        } else {
            var url = Config.baseUrl + 'Customer/editCustomer';
            judge = false;
        }
        e.detail.value.userid = userid;
        e.detail.value.companyid = companyid;
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
                            if (judge) {
                                config.permission('client/client', function () {
                                wx.redirectTo({
                                    url: '../client/client',
                                })
                                })
                            } else {
                                config.permission('client_info/client_info', function () {
                                wx.redirectTo({
                                    url: '../client_info/client_info?customerid=' + customerid,
                                })
                                })
                            }

                        }
                    })
                } else {
                    config.modaljy(res.data.msg);
                }
            }
        })
    }
})
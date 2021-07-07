import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
/**
 * 获取第三方详情
 */
var getInfo = function (that, options) {
    var thirdpartyid = options.thirdpartyid;
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    wx.request({
        url: Config.baseUrl + 'Customer/getThirdParty',
        data: { companyid: companyid, userid: userid, employeeid: employeeid, thirdpartyid: thirdpartyid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                label: data.data.label,
                contact: data.data.contact,
                contactphone: data.data.contactphone,
                comments: data.data.comments,
                company: data.data.company,
                thirdpartyid: data.data.id,
            })
        }
    })
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        label: '',
        thirdname: '',
        contact: '',
        contactphone: '',
        comments: '',
        company: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.thirdpartyid > 0) {
            wx.setNavigationBarTitle({
                title: '修改第三方'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '新增第三方'
            })
        }
        if (options.thirdpartyid != undefined && options.thirdpartyid > 0) {
            getInfo(this, options);
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
    /**
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        var id = e.detail.value.thirdpartyid;
        if (id == '') {
            var url = Config.baseUrl + 'Customer/addThirdParty';
        } else {
            var url = Config.baseUrl + 'Customer/editThirdParty';
        }
        var thirdpartyid = config.getDataSet(e, 'thirdpartyid');
        var label = e.detail.value.label;
        if (label == '') {
            config.modaljy("请输入标签");
            return;
        }
        var contact = e.detail.value.contact;
        if (contact == '') {
            config.modaljy("请输入联系人");
            return;
        }
        var contactphone = e.detail.value.contactphone;
        var yanphone = /^[1][123457890][0-9]{9}$/;//手机号
        if (!yanphone.test(e.detail.value.contactphone)) {
            config.modaljy("请输入正确的联系方式");
            return;
        }
        var comments = e.detail.value.comments;
        var company = e.detail.value.company;
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
                            config.permission('thirdparty/thirdparty', function () {
                            wx.redirectTo({
                                url: '../thirdparty/thirdparty',
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
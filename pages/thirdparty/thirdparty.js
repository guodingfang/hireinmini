// pages/client/client.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var p = 0;
var s_pagecount = 1;
var formdata = [];
var userid;
var url = Config.baseUrl + 'Customer/getThirdPartyList';
//分页
var GetList = function (that) {
    formdata.page = p;
    formdata.userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    formdata.companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    formdata.employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    /*加载完毕*/
    if (p == s_pagecount) {
        that.setData({
            hidden: false,
            finish: true,
            noresult: false
        });
    }
    if (s_pagecount > p) {
        that.setData({
            hidden: true,
            finish: false,
            noresult: false
        });
        wx.request({
            url: url,
            data: formdata,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (res) {
                wx.stopPullDownRefresh();
                var l = that.data.list;
                that.setData({
                    finish: false,
                    noresult: false,
                    loadingHidden: true
                });
                if (res.data.page.pagecount == 0) {
                    that.setData({
                        finish: false,
                        hidden: false,
                        loadingHidden: false,
                        noresult: true,
                        list: []
                    });
                } else {
                    s_pagecount = res.data.page.pagecount;
                    for (var i = 0; i < res.data.data.length; i++) {
                        l.push(res.data.data[i])
                    }
                    that.setData({
                        list: l
                    });

                    if (res.data.page.pagecount == 1) {
                        that.setData({
                            finish: true,
                            hidden: false,
                            noresult: false
                        });
                    }
                }
            }
        });

        p = p + 1;
    }
    /*pagecount > p 结尾*/
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        finish: false,
        noresult: false,
        loadingHidden: false,
        list: [],
        sliderLeft: 540,
        operate: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '通讯录-第三方合作'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid;
        this.setData({
            employeeid: employeeid,
        })
        //分页加载数据
        p = 0;
        s_pagecount = 1;
        GetList(this);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //下拉  
        p = 0;
        this.setData({
            list: [],
        });
        GetList(this)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        GetList(this)
    },

    /*拨打电话*/
    callme: function (e) {
        var callphone = config.getDataSet(e, 'phone');
        wx.makePhoneCall({
            phoneNumber: callphone,
        })
    },

    /**
     * 页面跳转
     */
    skip: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
            wx.redirectTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 跳转修改
     */
    clickEdit: function (e) {
        var thirdpartyid = config.getDataSet(e, 'thirdpartyid');
        config.permission('add_third/add_third', function () {
            wx.redirectTo({
                url: '../add_third/add_third?thirdpartyid=' + thirdpartyid,
            })
        })
    },

    /**
     * 跳转删除
     */
    clickDel: function (e) {
        var thirdpartyid = config.getDataSet(e, 'thirdpartyid');
        var url = Config.baseUrl + 'Customer/delThirdParty';
        var that = this;
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { companyid: companyid, userid: userid, employeeid: employeeid, thirdpartyid: thirdpartyid },
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
                                        p = 0;
                                        that.setData({
                                            list: [],
                                            hidden: false,
                                            finish: false,
                                            noresult: false,
                                            loadingHidden: false,
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

    /**
     * 邀请
     */
    invite: function (e) {
        var id = config.getDataSet(e, 'id');
        wx.navigateTo({
            url: '../clientInvite/clientInvite?id=' + id,
        })
    }
})
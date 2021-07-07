// pages/client/client.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var p = 0;
var s_pagecount = 1;
var formdata = [];
var userid;
var url = Config.baseUrl + 'Employee/getEmployeeList';
//分页
var GetList = function (that) {
    formdata.page = p;
    formdata.employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    formdata.userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    formdata.companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
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
        sliderLeft: 275,
        hidden: false,
        finish: false,
        noresult: false,
        loadingHidden: false,
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '通讯录-成员'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        //分页加载数据
        p = 0;
        s_pagecount = 1;
        GetList(this);
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
        var url = config.getDataSet(e, 'url')
        config.permission(url, function () {
            wx.redirectTo({
                url: '../' + url,
            })
        })
    }

})
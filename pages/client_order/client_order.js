// pages/client_order/client_order.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var p = 0;
var s_pagecount = 1;
var formdata = [];
var userid;
var customerid;
var customername;
var url = Config.baseUrl + 'Lease/getCustomerOrderList';
//分页
var GetList = function (that) {
    formdata.page = p;
    formdata.customerid = customerid;
    formdata.customername = customername;
    formdata.startdate = that.data.startDate;
    formdata.enddate = that.data.endDate;
    formdata.address = that.data.address;
    formdata.companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    formdata.employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    formdata.userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
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
        sliderLeft: 566,
        startDate: '',
        endDate: '',
        address: '',
        customername: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '查看订单'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        customerid = options.id;
        if (options.customerid > 0) {
            customerid = options.customerid;
            customername = options.customername;
            this.setData({
                customername: customername,
            })
        }
        //分页加载数据
        p = 0;
        s_pagecount = 1;
        GetList(this);
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

    /**
     * 页面跳转
     */
    skip: function (e) {
        var url = config.getDataSet(e,'url');
        config.permission(url, function () {
        wx.redirectTo({
            url: '../' + url + '?customerid= ' + customerid + '&customername=' + customername,
        })
        })
    },
    /**
     * 起始日期选择
     */
    startDateChange: function (e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    /**
     * 截止日期选择
     */
    endDateChange: function (e) {
        this.setData({
            endDate: e.detail.value
        })
    },

    /**
     * 获取地址
     */
    addressval: function (e) {
        this.setData({
            address: e.detail.value
        })
    },

    /**
     * 搜索
     */
    search: function (e) {
        p = 0;
        this.setData({
            list: [],
        })
        GetList(this);
    },

    /**
     * 跳转
     */
    skip1: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
        wx.navigateTo({
            url: '../'+url,
        })
        })
    }
})
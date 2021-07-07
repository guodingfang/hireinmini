// pages/myorder/myorder.js
import { Config } from '../../utils/config.js';
var config = new Config();
var companyid; //公司id
var employeeid; //员工id
var userid; //用户id
//分页
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url;
var GetList = function (that) {
    formdata.startdate = that.data.startDate;
    formdata.enddate = that.data.endDate;
    formdata.address = that.data.address;
    formdata.companyid = companyid;
    formdata.employeeid = employeeid;
    formdata.userid = userid;
    formdata.page = p;
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
                        loadingHidden: true,
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
        startDate: '',
        endDate: '',
        address: '',
        operhide: false,
        types: '',
        audithide: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        userid = wx.getStorageSync("userinfo").userid ? wx.getStorageSync("userinfo").userid : 0;
        this.setData({
            types: options.type,
        })
        if (options.type == 1) {//审核中
            url = Config.baseUrl + 'Order/myOrderListForAudit';
            this.setData({
                audithide: true,
            })
            wx.setNavigationBarTitle({
                title: '我的待审核订单'
            })
        } else if (options.type == 2) {//取消
            url = Config.baseUrl + 'Order/myCanceledOrderList';
            this.setData({
                operhide: true,
            })
            wx.setNavigationBarTitle({
                title: '我的已取消订单'
            })
        } else if (options.type == 3) {// 订单审核 
            url = Config.baseUrl + 'Order/orderListForAudit';
            wx.setNavigationBarTitle({
                title: '订单审核'
            })
        } else {//我的订单
            url = Config.baseUrl + 'Lease/myOrderList';
            wx.setNavigationBarTitle({
                title: '我的订单'
            })
            this.setData({
                operhide: true,
            })
        }
        p = 0;
        //获取订单列表
        GetList(this);
    },

    /**
     * 生命周期函数--监听页面显示
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        p = 0
        this.setData({
            list: [],
        })
        //获取订单列表
        GetList(this);
        //停止刷新
        wx.stopPullDownRefresh();
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        var that = this
        GetList(that)
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
    * 点击进入我的客户订单详情、
    */
    orderdetail: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },

    /**
   * 点击进入审核订单、
   */
    checkorder: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.redirectTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 筛选
     */
    search: function (e) {
        this.setData({
            list: [],
        })
        p = 0;
        GetList(this);
    },

    /**
     * 取消提示
     */
    canceler: function (e) {
        var orderid = e.currentTarget.dataset.orderid;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '您确定要取消吗？',
            success: function (res) {
                if (res.confirm) {
                    cancel(that, orderid);
                }
            }
        })
    },
})
/**
   * 取消订单
   */
var cancel = function (that, orderid) {
    wx.request({
        url: Config.baseUrl + 'Order/cancelOrder',
        data: { companyid: companyid, employeeid: employeeid, userid: userid, orderid: orderid },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
            if (res.data.result = true) {
                wx.showToast({
                    title: "取消成功",
                    icon: 'success',
                    duration: 2000,
                    success: function (e) {
                        p = 0
                        that.setData({
                            list: [],
                        })
                        GetList(that)
                    }
                })
            } else {

            }
        }
    })
}

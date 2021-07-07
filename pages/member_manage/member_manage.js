// pages/member_manage/member_manage.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var p = 0;
var s_pagecount = 1;
var formdata = [];
var userid;
var url = Config.baseUrl + 'Employee/getAllEmployee';
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
/*审核成员人数*/
var getcount = function (that, options) {
    var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    wx.request({
        url: Config.baseUrl + 'Employee/getEmployeeCountForAudit',
        data: { companyid: companyid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                mun: data.data,
            })
        }
    })
};
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
        mun: '',
        userid: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '成员管理'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        this.setData({
            userid: userid
        })
        //分页加载数据
        p = 0;
        s_pagecount = 1;
        GetList(this);
        getcount(this);
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
    * 点击进入成员详情、
    */
    member_details: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        GetList(this)
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
    /*跳转到审核成员页面*/
    examine: function (e) {
        config.permission('examine/examine', function () {
            wx.navigateTo({
                url: '../examine/examine',
            })
        })
    },
    /*跳转到成员修改页面*/
    memalter: function (e) {
        var employeeid = config.getDataSet(e, 'employeeid');
        config.permission('add-member/add-member', function () {
            wx.redirectTo({
                url: '../add-member/add-member?employeeid=' + employeeid,
            })
        })
    },
    /*跳转到邀请页面*/
    invite: function (e) {
        config.permission('invite/invite', function () {
            wx.navigateTo({
                url: '../invite/invite',
            })
        })
    },
    /**
     * 跳转删除
     */
    clickDel: function (e) {
        var employeeid = config.getDataSet(e, 'employeeid');
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var url = Config.baseUrl + 'Employee/delEmployee';
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { companyid: companyid, userid: userid, employeeid: employeeid },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'post',
                        success: function (res) {
                            if (res.data.result == true) {
                                wx.showToast({
                                    title: res.data.msg,
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
                                    title: '删除成功',
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
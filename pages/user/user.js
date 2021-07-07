import {
    Config
} from '../../utils/config.js';
var util = require('../../utils/util.js');
var login = require('../../template/login.js');
var config = new Config();
var app = getApp();
var companyid;
var typeid; //公司跳转标识，1是显示公司管理按钮，2不显示。
Page({

    /**
     * 页面的初始数据
     */
    data: {
        companyinfo: [],
        userinfo: [],
        pageshow: 1,
        ordernumber: '',
        ordernumbers: '',
        loadingHidden: false,
        orderaudit: true,
        verification: "获取验证码",
        phone: '',
        verificationCode: '',
        logourl: '',
        canGetUserProfile: false,  //使用getUserProfile取用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.setNavigationBarTitle({
            title: '个人中心'
        })
        login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        that.getLogoUrl();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        // 判断用户登录信息是否缓存
        config.userLogin(function() {
            var userinfo = wx.getStorageSync('userinfo');
            if (userinfo.code > 0) {
                that.setData({
                    pageshow: 0,
                    userinfo: userinfo,
                    loadingHidden: true
                })
                app.getWxCode();
            } else {
                app.judgeLogoNBrace(function() {
                    that.setData({
                        pageshow: 1,
                        userinfo: userinfo,
                    })
                    // 获取信息
                    getUserCompanyInfo(that)
                    // 获取我的审核的订单数量
                    getcheckcount(that);
                    // 获取订单审核的订单数量
                    getcheckordercount(that);
                    // 获取订单审核权限(有显示,无不显示)
                    getCheckOrderoper(that);
                })
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    toServerPage(){
        wx.navigateTo({
          url: '/pages/serverPage/serverPage',
        })
    },
    toAttestation(){
        wx.navigateTo({
          url: '/pages/attestation/attestation',
        })
    },
    toDiscern(){
        wx.navigateTo({
            url: '/pages/discern/discern',
        })
    },
    toProjection(){
        wx.navigateTo({
          url: '/pages/projection/projection',
        })
    },
    toTool(){
        wx.navigateTo({
          url: '/pages/tool/tool',
        })
    },
    toCreateOrganize(){
        wx.navigateTo({
          url: '/pages/createOrganize/createOrganize',
        })
    },
    // 跳转修改个人信息页面
    modifyInfo(){
        wx.navigateTo({
          url: '/pages/userInfoDetail/userInfoDetail',
        })
    },

    /* 注销 */
    setup: function(event) {
        wx.showModal({
            title: '提示',
            content: '您确定注销吗 ?',
            success: function(res) {
                if (res.confirm) {
                    wx.removeStorage({
                        key: 'logininfo',
                        success: function(res) {
                            wx.switchTab({
                                url: '../index/index',
                            })
                        }
                    })
                }
            }
        })
    },
    /**
     * 点击我的公司旧版
     */
    company1: function(event) {
        wx.navigateTo({
            url: '../mycompany/mycompany',
        })
    },
    /**
     * 点击我的订单
     */
    myorder: function(event) {
        config.permission('myorder/myorder', function() {
            wx.navigateTo({
                url: '../myorder/myorder',
            })
        })
    },

    /**
     * 跳转到我的审核订单
     */
    checkmyorder: function(event) {
        config.permission('myorder/myorder', function() {
            wx.navigateTo({
                url: '../myorder/myorder?type=1',
            })
        })
    },
    /**
     * 跳转到我的已取消订单
     */
    ordercancel: function(event) {
        config.permission('myorder/myorder', function() {
            wx.navigateTo({
                url: '../myorder/myorder?type=2',
            })

        })
    },
    /**
     * 跳转到我的订单审核
     */
    orderaudit: function(event) {
        config.permission('myorder/myorder', function() {
            wx.navigateTo({
                url: '../myorder/myorder?type=3',
            })

        })
    },
    /**
     * 跳转到我的任务
     */
    mytask: function(event) {
        config.permission('mytask/mytask', function() {
            wx.navigateTo({
                url: '../mytask/mytask?',
            })
        })
    },
    /**
     * 跳转到我的发布
     */
    mylease: function(event) {
        config.permission('mylease/mylease', function() {
            wx.navigateTo({
                url: '../mylease/mylease',
            })
        })
    },
    /**
     * 点击我的公司
     */
    company: function(e) {
        if (companyid > 0) { // 有公司跳转公司详情页
            config.permissionht('company-manage/company-manage', function(res) {
                if (res.data.result) {
                    wx.navigateTo({
                        url: '../companydetails/companydetails?typeid=1&companyid=' + companyid,
                    })
                } else {
                    wx.navigateTo({
                        url: '../companydetails/companydetails?typeid=2&companyid=' + companyid,
                    })
                }
            })
        } else { // 无公司跳转创建公司或绑定公司页
            wx.navigateTo({
                url: '../company_select/company_select',
            })
        }
    },

    /**
     * 跳转到主营产品管理
     */
    mymain: function(e) {
        if (companyid > 0) {
            config.permission('mymain/mymain', function() {
                wx.navigateTo({
                    url: '../mymain/mymain',
                })
            })
        } else {
            config.modalqd('请先创建或绑定公司', function(res) {
                if (res.confirm) {
                    config.permission('company_select/company_select', function() {
                        wx.navigateTo({
                            url: '../company_select/company_select',
                        })
                    })
                }
            });
        }
    },

    /**
     * 跳转到成员管理
     */
    membermanage: function(e) {
        if (companyid > 0) {
            config.permission('member_manage/member_manage', function() {
                wx.navigateTo({
                    url: '../member_manage/member_manage',
                })
            })
        } else {
            config.modalqd('请先创建或绑定公司', function(res) {
                if (res.confirm) {
                    config.permission('company_select/company_select', function() {
                        wx.navigateTo({
                            url: '../company_select/company_select',
                        })
                    })
                }
            });
        }
    },
    /**
        * 跳转到客户
        */
    client: function(e) {
        if (companyid > 0) {
            config.permission('client/client', function() {
                wx.navigateTo({
                    url: '../client/client',
                })
            })
        } else {
            config.modalqd('请先创建或绑定公司', function(res) {
                if (res.confirm) {
                    config.permission('company_select/company_select', function() {
                        wx.navigateTo({
                            url: '../company_select/company_select',
                        })
                    })
                }
            });
        }
    },

    /*取系统logo*/
    getLogoUrl: function(e) {
        var that = this;
        wx.request({
            url: Config.baseUrl + "WXAppLogin/getWxMiniLogo",
            data: {
                userid: that.data.userid,
                accesstoken: that.data.accesstoken,
                unionid: that.data.unionid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                console.log('logo url:',res);
                if (res.data.logo.length>0) {
                    that.setData({
                        logourl: Config.imgUrl + res.data.logo
                    })
                }
            }
        })
    },
})

/**
 * 获取我的公司信息
 */
function getUserCompanyInfo(that) {
    companyid = that.data.userinfo.companyid ? that.data.userinfo.companyid : 0;
    var phone = that.data.userinfo.phone ? that.data.userinfo.phone : '';
    wx.request({
        url: Config.baseUrl + 'Company/getMyCompanyInfo',
        data: {
            companyid: companyid,
            phone: phone
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                companyinfo: res.data,
                loadingHidden: true
            })
        }
    })
}

/**
 * 获取我的审核的订单数量
 */
function getcheckcount(that) {
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    wx.request({
        url: Config.baseUrl + 'Order/myOrderForAuditNum',
        data: {
            companyid: companyid,
            userid: userid,
            employeeid: employeeid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                ordernumber: res.data.ordernum
            })
        }
    })
}

/**
 * 获取订单审核的订单数量
 */
function getcheckordercount(that) {
    var userid = '';
    companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
    wx.request({
        url: Config.baseUrl + 'Order/myOrderForAuditNum',
        data: {
            companyid: companyid,
            userid: userid,
            employeeid: employeeid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                ordernumbers: res.data.ordernum
            })
        }
    })
}

/**
 * 获取订单审核权限
 */
function getCheckOrderoper(that) {
    config.permissionht('ordexamine/ordexamine', function(res) {
        if (res.data.result) {
            that.setData({
                orderaudit: false
            })
        } else {
            that.setData({
                orderaudit: true
            })
        }
    })
}
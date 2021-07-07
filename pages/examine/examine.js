// pages/examine/examine.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
/*待审核列表*/
var GetList = function (that, companyid) {
    wx.request({
        url: Config.baseUrl + 'Employee/getUnActiveEmployeeList',
        data: { companyid: companyid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                list: data.data.data
            })
        }
    })
}
/*职务*/
var getspeclist = function (that) {
    var companyid = wx.getStorageSync('userinfo').companyid;
    wx.request({
        url: Config.baseUrl + "Employee/getGroupList",
        data: {
            companyid: companyid,
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            that.setData({
                grouplist: res.data
            })
        }
    });
}
/*部门*/
var getaclist = function (that) {
    var companyid = wx.getStorageSync('userinfo').companyid;
    wx.request({
        url: Config.baseUrl + "Company/getDepartmentList",
        data: {
            companyid: companyid //164,
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            that.setData({
                deptlist: res.data
            })
        }
    });
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        popup: true,
        deptname: '',
        deptid: '',
        groupid: '',
        groupname: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '审核成员'
        })
        var companyid = wx.getStorageSync('userinfo').companyid;
        GetList(this, companyid);
        /*获取部门和员工类型*/
        getspeclist(this);
        getaclist(this);
    },

    /*审核通过弹窗弹出 */
    exchk: function (e) {
        this.setData({
            popup: false,

            employeeid: config.getDataSet(e, 'employeeid'),
            phone: config.getDataSet(e, 'phone'),
            activate: config.getDataSet(e, 'activate'),
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
    /*审核通过弹窗关闭 */
    feng: function (e) {
        this.setData({
            popup: true,
        })
    },
    /**
       * 部门的选择
       */
    getdeptid: function (e) {
        var that = this;
        var deptlist = that.data.deptlist;
        this.setData({
            deptid: deptlist[e.detail.value].deptid,
            deptname: deptlist[e.detail.value].deptname,
        });
    },

    /**
    * 类型的选择
    */
    getgroupid: function (e) {
        var that = this;
        var grouplist = that.data.grouplist;
        this.setData({
            groupid: grouplist[e.detail.value].id,
            groupname: grouplist[e.detail.value].title,
        });
    },

    /**
     * 审核通过后数据验证及提交
     */
    getok: function (e) {
        var that = this;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var famell = [];
        var url = Config.baseUrl + 'Employee/auditUserJoin';
        var groupid = that.data.groupid ? that.data.groupid : 0;
        var deptid = that.data.deptid ? that.data.deptid : 0;
        famell.groupid = groupid;
        famell.deptid = deptid;
        famell.phone = that.data.phone;
        famell.activate = that.data.activate;
        famell.employeeid = that.data.employeeid;
        famell.companyid = companyid;
        wx.request({
            url: url,
            data: famell,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                if (res.data.result == true) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000,
                        complete: function () {
                            that.setData({
                                list: [],
                                popup: true,
                            })
                            GetList(that, companyid);
                        }
                    })
                } else {
                    config.modaljy(res.data.msg);
                }
            }
        })
    },
    /**
     * 点击拒绝后确认弹窗
     */
    exchk12: function (e) {
        var employeeid = config.getDataSet(e, 'employeeid');
        var phone = config.getDataSet(e, 'phone');
        var activate = config.getDataSet(e, 'activate');

        wx.showModal({
            title: '提示',
            content: '您确定要拒绝吗？',
            success: function (res) {
                if (res.confirm) {
                    getok1(employeeid, phone, activate);
                } else {
                }
            }
        })
    },
})
/**
  * 拒绝后方法调用数据验证及提交
  */
var getok1 = function (employeeid, phone, activate) {
    var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    var famell = [];
    var url = Config.baseUrl + 'Employee/auditUserJoin';
    famell.groupid = 0;
    famell.deptid = 0;
    famell.phone = phone;
    famell.activate = activate;
    famell.employeeid = employeeid;
    famell.companyid = companyid;
    wx.request({
        url: url,
        data: famell,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.result == true) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000,
                    complete: function () {
                        config.permission('examine/examine', function () {
                        wx.redirectTo({
                            url: '../examine/examine',
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


// pages/add-member/add-member.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
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
            companyid: companyid,
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
/**
 * 获取详情
 */
var getInfo = function (that, employeeid) {
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    wx.request({
        url: Config.baseUrl + 'Employee/getEmployeeInfo',
        data: { userid: userid, employeeid: employeeid, },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                employeename: data.data.employeename,
                deptname: data.data.deptname,
                groupname: data.data.employeetypename,
                employeenumber: data.data.employeenumber,
                phone: data.data.phone,
                address: data.data.address,
                groupid: data.data.groupid,
                deptid: data.data.deptid,
            })
        }
    })
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        employeename: '',
        deptname: '',
        deptid: '',
        titlename: '',
        employeenumber: '',
        phone: '',
        address: '',
        groupid: '',
        groupname: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '修改成员'
        })
        var employeeid = options.employeeid;
        getInfo(this, employeeid);
        /*获取部门和员工类型*/
        getspeclist(this);
        getaclist(this);
        this.setData({
            employeeid: employeeid,
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
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = this.data.employeeid;
        var url = Config.baseUrl + 'Employee/editEmployeeInfo';
        var employeename = e.detail.value.employeename;
        if (employeename == '') {
            config.modaljy("请输入姓名");
            return;
        }
        var phone = e.detail.value.phone;
        var yanphone = /^[1][123457890][0-9]{9}$/;//手机号
        if (!yanphone.test(e.detail.value.phone)) {
            config.modaljy("请输入正确的联系方式");
            return;
        }
        var deptid = e.detail.value.deptid;
        if (!deptid){
            e.detail.value.deptid = 0;
        }
        var groupid = e.detail.value.groupid;
        if (!groupid) {
            e.detail.value.groupid = 0;
        }
        var employeenumber = e.detail.value.employeenumber;
        e.detail.value.companyid = companyid;
        e.detail.value.employeeid = employeeid;
        wx.request({
            url: url,
            data: e.detail.value,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                console.info(res);
                if (res.data.result == true) {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000,
                        complete: function () {
                            config.permission('member_manage/member_manage', function () {
                            wx.redirectTo({
                                url: '../member_manage/member_manage',
                            })
                            })
                        }
                    })
                } else {
                    config.modaljy('修改失败');
                }
            }
        })
    }
})
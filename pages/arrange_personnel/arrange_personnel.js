'use strict';
import { Config } from '../../utils/config.js';
var config = new Config();
var employeelist = [],
    thirdparty = [];
/*获取订单详情数据*/
var getOrderInfo = function (orderid, companyid, that) {
    wx.request({
        url: Config.baseUrl + "Lease/orderdetail_manalloc",
        data: {
            orderid: orderid,
            companyid: companyid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                var employeelist_data = [], thirdparty_data = [];
                employeelist = res.data.employeelist.data;
                thirdparty = res.data.thirdparty;
                employeelist_data[0] = { 'employeelist': employeelist, 'employeename': "请选择人员", 'employeeid': 0 };
                thirdparty_data[0] = { 'thirdparty': thirdparty, 'id': 0, 'contact': "请选择第三方人员" };
                that.setData({
                    orderinfo: res.data.orderinfo,
                    detailinfo: res.data.specinfo,
                    employeelist: employeelist_data,
                    thirdparty: thirdparty_data,
                })
            }
        }
    });
}
/*安排人员数据提交*/
var formCommitFunc = function (dataparam, that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Lease/manalloc_bgo",
        data: dataparam,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                wx.hideLoading();
                wx.showToast({
                    title: "提交成功",
                    icon: 'success',
                    duration: 2000,
                    success: function (e) {
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2]; //上一个页面
                        /*1是收缩，0是展开*/
                        var isexpand = (prevPage.data.isExpand)?0:1;
                        prevPage.calculateDays(that.data.year, that.data.month, prevPage.data.cur_year + "-" + prevPage.data.cur_month + "-" + prevPage.data.cur_date,isexpand);
                        prevPage.getOrderlistByDate(prevPage.data.companyid, prevPage.data.cur_year + "-" + prevPage.data.cur_month + "-" + prevPage.data.cur_date);
                        wx.navigateBack();
                    }
                })
            }
        }
    });
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hidden: 'hide',
        facilitname: '展开',
        faciliticon: '../../images/unfold.png',
        facilitytype: 1, // 1 收,2 展
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '安排人员'
        })
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;

        this.setData({
            companyid: companyid,
            orderid: options.orderid,
            year: options.year,
            month: options.month
        })
        getOrderInfo(options.orderid, this.data.companyid, this);
    },
    /**
     * 日期选择-派单日期
     */
    startChange: function (e) {
        this.setData({
            instime: e.detail.value
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
     * 添加人员
     * @author sh
     */
    addEmployeeItem: function (e) {
        var that = this;
        var newEmployeelist = { 'employeelist': employeelist, 'employeeid': 0, 'employeename': '请选择人员' };
        var newList = that.data.employeelist;
        newList.push(newEmployeelist);
        that.setData({
            employeelist: newList
        })
    },
    /**
     * 添加第三方人员
     * @author sh
     */
    addThirdpartyItem: function (e) {
        var that = this;
        var newthirdparty = { 'thirdparty': thirdparty, 'id': 0, 'contact': '请选择第三方人员' };
        var newList = that.data.thirdparty;
        newList.push(newthirdparty);
        that.setData({
            thirdparty: newList
        })
    },
    /**
     * 选择人员安排
     */
    getEmployeeid: function (e) {
        var emp_index = e.detail.value;
        var parent_index = config.getDataSet(e, "parentindex");
        var employeelist = this.data.employeelist;
        employeelist[parent_index]['employeename'] = employeelist[parent_index]['employeelist'][emp_index]['employeename'];
        employeelist[parent_index]['employeeid'] = employeelist[parent_index]['employeelist'][emp_index]['employeeid'];
        this.setData({
            employeelist: employeelist
        })
    },
    /**
     * 选择第三方人员
     */
    getThirtparty: function (e) {
        var emp_index = e.detail.value;
        var parent_index = config.getDataSet(e, "parentindex");
        var thirdparty = this.data.thirdparty;
        thirdparty[parent_index]['contact'] = thirdparty[parent_index]['thirdparty'][emp_index]['contact'];
        thirdparty[parent_index]['id'] = thirdparty[parent_index]['thirdparty'][emp_index]['id'];
        this.setData({
            thirdparty: thirdparty
        })
    },
    /**
     * 删除人员
     */
    delman: function (e) {
        var that = this,
            parent_index = config.getDataSet(e, "parentindex"),
            parent_type = config.getDataSet(e, "type"),
            employeelist = that.data.employeelist,
            thirdparty = that.data.thirdparty;
        if (parent_type == "employee") {
            employeelist.splice(parent_index, 1);
            that.setData({
                employeelist: employeelist
            })
        } else if (parent_type == "thirdparty") {
            thirdparty.splice(parent_index, 1);
            that.setData({
                thirdparty: thirdparty
            })
        }
    },
    /**
     * 安排人员提交数据
     */
    formSubmit: function (e) {
        var employeelist = this.data.employeelist,
            thirdparty = this.data.thirdparty,
            that = this,
            commit_param = e.detail.value;
        var new_emplist = [], new_thirdlist = [];
        if (commit_param.theme.length == '') {
            config.modaljy("请输入派单主题");
            return;
        }
        if (commit_param.instime == '') {
            config.modaljy("请选择派单日期");
            return;
        }
        if (employeelist[0]['employeeid'] > 0 || thirdparty[0]['id'] > 0) {
            commit_param['orderid'] = that.data.orderid;
            commit_param['companyid'] = that.data.companyid;
            commit_param['employeelist'] = JSON.stringify(this.filterArray(employeelist, "employeeid"));
            commit_param['thirdparty'] = JSON.stringify(this.filterArray(thirdparty, "id"));
            formCommitFunc(commit_param, that);
        } else {
            config.modaljy("请选择人员或第三方人员");
            return;
        }
    },
    /**
     * 过滤空数组
     */
    filterArray: function (dataArray, param) {
        var new_emplist = [];
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i][param] > 0) {
                var tempArray = {};
                tempArray[param] = dataArray[i][param];
                new_emplist.push(tempArray);
            }
        }
        return new_emplist;
    },
    /**
     * 设备展开/收回
     */
    facility: function (e) {
        config.slideToggle(this);
    },
})
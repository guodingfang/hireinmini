// pages/ordexamine/ordexamine.js
import { Config } from '../../utils/config.js';
var config = new Config();
/*根据订单id获取订单详情*/
function getOrderInfo(that, orderid) {
    var url = Config.baseUrl + "Order/getOrderInfo";
    wx.request({
        url: url,
        data: {
            orderid: orderid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
            that.setData({
                order: res.data.order,
                goods: res.data.goods
            })
        }
    })
}

/*根据通过状态服务器选择是否通过*/
function getexamine(that) {
    var url = Config.baseUrl + "Order/orderAudit";
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: url,
        data: {
            orderid: that.data.orderid,
            companyid: that.data.companyid,
            employeeid: that.data.employeeid,
            auditstatus: that.data.auditstatus,
            userid: that.data.userid,
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
            wx.hideLoading();
            if (res.data.result) {
                wx.showToast({
                    title: "提交成功",
                    icon: 'success',
                    duration: 2000,
                    success: function (e) {
                        config.permission('myorder/myorder', function () {
                            wx.redirectTo({
                                url: "../myorder/myorder?type=3"
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
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        order: ''

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '审核订单'
        })
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        /*获取参数orderid*/
        var orderid = options.orderid;
        this.setData({
            orderid: orderid,
            companyid: companyid,
            userid: userid,
            employeeid: employeeid,
        })
        //获取审核订单详情
        getOrderInfo(this, orderid);

    },
    /**
  * 跳转到审核通过
  */
    passfunc: function (e) {
        var status = config.getDataSet(e, "status");
        this.setData({
            auditstatus: status,
        })
        //请求审核
        getexamine(this);
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

})
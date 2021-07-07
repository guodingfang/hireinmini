// pages/arrange_details/arrange_details.js
'use strict';
import { Config } from '../../utils/config.js';
var config = new Config();
/*执行情况*/
var getArrangeDetail = function (orderid, stepid, that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Lease/getCompleteDetail",
        data: {
            orderid: orderid,
            stepid: stepid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            wx.hideLoading();
            that.setData({
                orderinfo: res.data.orderinfo,
                detailinfo: res.data.specinfo,
                arrange: res.data.arrange,
                pics: res.data.arrangepic,
                arrangecomments: res.data.arrangecomments
            })
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
            title: '执行情况'
        })
        this.setData({
            orderid: options.orderid,
            stepid: options.stepid,
            imgurl: Config.imgUrl,
        })
        /*获取执行情况详情*/
        getArrangeDetail(this.data.orderid, this.data.stepid, this);
    },
    callphone: function (e) {
        var phone = config.getDataSet(e, "phone");
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },
    /**
     * 设备展开/收回
     */
    facility: function (e) {
        config.slideToggle(this);
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
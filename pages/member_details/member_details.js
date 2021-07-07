// pages/member_details/member_details.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var getclient = function (that, employeeid) {
    var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;

    wx.request({
        url: Config.baseUrl + 'Employee/getEmployeeInfo',
        data: { employeeid: employeeid, userid: userid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                info: data.data,
            })
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '成员详情'
        })
        var employeeid = options.employeeid;
        getclient(this, employeeid);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
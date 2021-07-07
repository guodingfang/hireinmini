// pages/bill_info/bill_info.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        imgurl: Config.imgUrl,
        piclist: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '发单详情'
        })
        var that = this;
        wx.request({
            url: Config.baseUrl + 'Advert/getBillInfo',
            data: options,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (data) {
                that.setData({
                    info: data.data,
                    piclist: data.data.piclist
                })
            }
        })
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
        config.permission('',function(){
            wx.switchTab({
                url: '../index/index'
            })
        })   
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        var info = this.data.info;
        return {
            title: '发单详情 - ' + info.topic
        }
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
     * 留言图片预览
     */
    previewImage: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.piclist.length; i++) {
            arr[i] = this.data.piclist[i].picfilename;
        }
        var current = config.getDataSet(e, 'src');
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    },

    /**
     * 拨打电话
     */
    dial: function (e) {
        var phone = e.currentTarget.dataset.val;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    }
})
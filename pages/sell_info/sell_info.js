// pages/sell_info/sell_info.js
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
        imgurl: Config.imgUrl,
        piclist: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '出售详情'
        }),
            //获取详情
            getInfo(this, options);

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var info = this.data.info;
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: '出售详情 - ' + info.goodsname + ' ' + info.goodsbrand + ' ' + info.goodsspec,
        }
    },

    /**
     * 图片预览
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

/**
 * 获取详情
 */
function getInfo(that, options) {
    wx.request({
        url: Config.baseUrl + 'Advert/getSellInfo',
        data: options,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                info: data.data,
                piclist: data.data.piclist,
            })
        }
    })
}
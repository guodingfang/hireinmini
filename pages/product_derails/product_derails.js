// pages/product_derails/product_derails.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
//获取客户详情
var getclient = function (prodid, that) {
    wx.request({
        url: Config.baseUrl + 'Company/getProductInfo',
        data: { prodid: prodid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                info: data.data,
                prodname: data.data.prodname
            })
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prodid: "",
        info: [],
        imageurl: Config.imgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '产品详情'
        })
        var prodid = options.prodid;

        getclient(prodid, this);
    },

    /**
    * 分享公司
    */
    onShareAppMessage: function (e) {
        var prodname = this.data.prodname;
        return {
            title: prodname,
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

    /*图片预览*/
    Imageappear: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.info.pics.length; i++) {
            arr[i] = this.data.info.pics[i].picfilename;
        }
        console.info(arr);
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    },

})
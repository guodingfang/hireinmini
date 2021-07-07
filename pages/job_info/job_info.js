// pages/job_info/job_info.js
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
            title: '求租详情'
        })
        var that = this;
        getInfo(that, options);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        var info = this.data.info;
        return {
            title: '求租详情 - ' + info.topic
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
/**
 * 获取详细
 */
function getInfo(that, options) {
    wx.request({
        url: Config.baseUrl + 'Advert/getJobInfo',
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
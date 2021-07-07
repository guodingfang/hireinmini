// pages/client_order_info/client_order_info.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: [],
        scenepic: true,
        evaluate: true,
        imgurl: Config.imgUrl,
        hidden: 'hide',
        facilitname: '展开',
        faciliticon: '../../images/unfold.png',
        facilitytype: 1, // 1 收,2 展
        picmsg: [], //公司留言图片
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '订单详情'
        })
        //获取订单详情
        getOrderInfo(this, options);
    },

    /*拨打电话*/
    callme: function (e) {
        var callphone = config.getDataSet(e, 'phone');
        wx.makePhoneCall({
            phoneNumber: callphone,
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
    /**
     * 留言图片预览
     */
    previewImage: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.picmsg.length; i++) {
            arr[i] = this.data.imgurl + this.data.picmsg[i].picfilename;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    }
})

/**
 * 获取订单详情
 */
function getOrderInfo(that, options) {
    var types = options.type;
    console.info(types);
    if (types < 4 && types > 0) {
        var url = Config.baseUrl + 'Order/getOrderInfo';
    } else {
        var url = Config.baseUrl + 'Lease/getOrderAllInfo';
    }
    var orderid = options.orderid;
    wx.request({
        url: url,
        data: { orderid: orderid },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
            that.setData({
                info: res.data,
                picmsg: res.data.picmsg,
            })
        }
    })
}
// pages/add_mymain/add_mymain.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var rurl;
var types = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id == undefined) {
            wx.setNavigationBarTitle({
                title: '新增主营产品'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '修改主营产品'
            })
            //获取产品详情
            getMainProductInfo(this, options.id);
        }
        if (this.options.rurl == 'getspec') {
            rurl = '../getspec/getspec';
            types = true;
        } else {
            rurl = '../mymain/mymain';
            types = false;
        }
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
        config.permission('index/index', function () {
            wx.switchTab({
                url: '../index/index'
            })
        })
    },
    /**
   * 数据验证及提交
   */
    formSubmit: function (e) {
        var content = e.detail.value;
        var id = content.id;
        if (id == '') {
            var url = Config.baseUrl + 'Goods/addMainproduct';
        } else {
            var url = Config.baseUrl + 'Goods/editMainproduct';
        }
        var prodname = content.prodname;
        if (prodname == '') {
            config.modaljy("请输入名称");
            return;
        }
        var pordspec = content.pordspec;
        if (pordspec == '') {
            config.modaljy("请输入规格");
            return;
        }
        var produnit = content.produnit;
        if (produnit == '') {
            config.modaljy("请输入单位");
            return;
        }
        var prodbrand = content.prodbrand;
        if (prodbrand == '') {
            config.modaljy("请输入品牌");
            return;
        }
        content.stocknumber = 0;
        content.companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        // 提交数据
        submitData(content, url);
    }
})

/**
 * 获取主营产品详情
 */
function getMainProductInfo(that, id) {
    wx.request({
        url: Config.baseUrl + 'Goods/getMainProductInfo',
        data: { id: id },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function (res) {
            that.setData({
                info: res.data,
            })
        }
    })
}

/**
 * 提交数据
 */
function submitData(content, url) {
    wx.request({
        url: url,
        data: content,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.result == true) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000,
                    complete: function () {
                        if (content.id == '') {
                            var prodid = res.data.pk;
                        } else {
                            var prodid = content.id;
                        }
                        var datas = { prodid: prodid, prodname: content.prodname, pordspec: content.pordspec, produnit: content.produnit, prodbrand: content.prodbrand };
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2]; //上一个页面
                        if (types) {
                            var datalist = prevPage.data.checkboxItems;
                        } else {
                            var datalist = prevPage.data.list;
                        }
                        datalist.unshift(datas);
                        if (types) {
                            prevPage.setData({
                                checkboxItems: datalist,
                            })
                        } else {
                            prevPage.setData({
                                list: datalist,
                            })
                        }
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            } else {
                wx.showModal({
                    content: res.data.msg,
                    showCancel: false,
                    confirmText: "确定"
                })
                return;
            }
        }
    })
}
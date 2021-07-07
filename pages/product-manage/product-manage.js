// pages/product-manage/product-manage.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var p = 0;
var s_pagecount = 1;
var formdata = [];
var userid;
var url = Config.baseUrl + 'Company/getCompanyProductList';
//分页
var GetList = function (that) {
    formdata.pagenum = p;
    formdata.companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
    /*加载完毕*/
    if (p == s_pagecount) {
        that.setData({
            hidden: false,
            finish: true,
            noresult: false
        });
    }
    if (s_pagecount > p) {
        that.setData({
            hidden: true,
            finish: false,
            noresult: false
        });
        wx.request({
            url: url,
            data: formdata,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function (res) {
                wx.stopPullDownRefresh();
                var l = that.data.list;
                that.setData({
                    finish: false,
                    noresult: false,
                    loadingHidden: true
                });
                if (res.data.page.pagecount == 0) {
                    that.setData({
                        finish: false,
                        hidden: false,
                        loadingHidden: true,
                        noresult: true,
                        list: []
                    });
                } else {
                    s_pagecount = res.data.page.pagecount;
                    for (var i = 0; i < res.data.data.length; i++) {
                        l.push(res.data.data[i])
                    }
                    that.setData({
                        list: l
                    });

                    if (res.data.page.pagecount == 1) {
                        that.setData({
                            finish: true,
                            hidden: false,
                            noresult: false
                        });
                    }
                }
            }
        });

        p = p + 1;
    }
    /*pagecount > p 结尾*/
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        finish: false,
        noresult: false,
        loadingHidden: true,
        list: [],
        imageurl: Config.imgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '产品管理'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        //分页加载数据
        p = 0;
        s_pagecount = 1;
        GetList(this);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //下拉  
        p = 0;
        this.setData({
            list: [],
        });
        GetList(this)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        GetList(this)
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
  * 跳转到新增
  */
    addpro: function (e) {
        config.permission('add-product/add-product', function () {
            wx.redirectTo({
                url: '../add-product/add-product',
            })
        })
    },
    /**
     * 跳转修改
     */
    clickEdit: function (e) {
        var prodid = config.getDataSet(e, 'prodid');
        config.permission('add-product/add-product', function () {
            wx.redirectTo({
                url: '../add-product/add-product?prodid=' + prodid,
            })
        })
    },

    /**
       * 跳转删除
       */
    clickDel: function (e) {
        var prodid = config.getDataSet(e, 'prodid');
        var url = Config.baseUrl + 'Company/delCompanyProduct';
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { prodid: prodid },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'post',
                        success: function (res) {
                            if (res.data.result == true) {
                                wx.showToast({
                                    title: "删除成功",
                                    icon: 'success',
                                    duration: 2000,
                                    success: function (e) {
                                        p = 0;
                                        that.setData({
                                            list: [],
                                            hidden: false,
                                            finish: false,
                                            noresult: false,
                                            loadingHidden: true,
                                        });
                                        GetList(that);
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: "删除失败",
                                    icon: 'success',
                                    duration: 2000,
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    /*图片预览*/
    Imageappear: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.list.length; i++) {
            arr[i] = this.data.imageurl + this.data.list[i].prodimage;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    },
    /*跳转到产品详情页*/
    returnprodetail: function (e) {
        var prodid = config.getDataSet(e, 'prodid');
        config.permission('product_derails/product_derails', function () {
            wx.navigateTo({
                url: '../product_derails/product_derails?prodid=' + prodid,
            })
        })
    },
})
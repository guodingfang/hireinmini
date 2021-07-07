import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var userid = 0;
// 分页获取搜索内容
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url = Config.baseUrl + 'Company/getCompanyListByCode';
var GetList = function (that) {
    formdata.citycode = that.data.citycode;
    formdata.pagenum = p;
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
            success: function (res) {
                wx.stopPullDownRefresh();
                var l = that.data.list;
                that.setData({
                    finish: false,
                    noresult: false,
                    loadingHidden: true,
                    search: true,
                    lists: false,
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
        list: [],
        loadingHidden: false,
        hide: true,
        companyid: 0,
        citycode: '',
        imgurl: Config.imgUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '推荐'
        });
        var that = this;
        var citycode = options.citycode ? options.citycode : wx.getStorageSync('cityinfo').citycode;
        var companyid = wx.getStorageSync('userinfo').companyid;
        if (companyid > 0) {
            that.setData({
                hide: false,
                companyid: companyid,
            })
        }
        that.setData({
            citycode: citycode
        })
        //分页获取推荐列表
        p = 0;
        GetList(that);
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
        var that = this;
        //下拉  
        p = 0;
        that.setData({
            list: [],
        });
        GetList(that);
        //停止刷新
        wx.stopPullDownRefresh();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return {
            title: '公司推荐',
            path: 'pages/companylist/companylist?citycode=' + this.data.citycode
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        GetList(this)
    },

    /**
     * 页面跳转
     */
    skip: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
        wx.navigateTo({
            url: '../'+url,
        })
        })
    }
})
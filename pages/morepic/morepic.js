// pages/morepic/morepic.js
import { Config } from '../../utils/config.js';
var config = new Config();
var util = require('../../utils/util.js');
var app = getApp();
var userid = 0;
// 分页获取搜索内容
var p = 0;
var s_pagecount = 1;
var formlistdata = [];
var url = Config.baseUrl + 'Company/getCompanyAllPics';
var GetList = function (that) {
    formlistdata.companyid = that.data.companyid;
    formlistdata.pagenum = p;
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
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: formlistdata,
            method: 'POST',
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
        loadingHidden: true,
        files: [],
        baseurl: Config.imgUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '更多图片'
        })
        var companyid = options.companyid;
        this.setData({
            companyid: companyid,
        })
        //分页获取图片
        p = 0;
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /*图片预览*/
    seeImage: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.list.length; i++) {
            arr[i] = this.data.baseurl + this.data.list[i].picture;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    }
})
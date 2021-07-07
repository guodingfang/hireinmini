import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var userid = 0;
// 分页获取搜索内容
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url = Config.baseUrl + 'Search/getSearchList';
var GetList = function (that) {
    formdata.userid = userid;
    formdata.searchval = that.data.searchsContent;
    formdata.citycode = wx.getStorageSync('cityinfo').citycode;
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
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
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
        hotlist: [],
        hislist: [],
        searchsContent: '',
        loadingHidden: false,
        search: false,
        his: false,
        lists: true,
        imgurl: Config.imgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '搜索'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        //获取历史搜索列表
        getHisSearchList(this);
        //获取热门搜索列表
        getHotSearchList(this);
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
        p = 0;
        this.setData({
            list: [],
        });
        GetList(this)

    },
    /**
    * 点击进入公司详情、
    */
    companydetails: function (event) {
        var url = config.getDataSet(event, 'url')
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        GetList(this)
    },

    /**
     * 获取搜索内容
     */
    searchsContent: function (e) {
        this.setData({
            searchsContent: e.detail.value,
        })
        if (!e.detail.value) {
            this.setData({
                search: false,
                lists: true,
            })
        }
    },

    /*点击搜索*/
    search: function (event) {
        p = 0,
            this.setData({
                search: false,
                lists: true,
                list: [],
            })
        GetList(this);
    },

    /**
     * 点击热门及历史搜索
     */
    searchs: function (e) {
        p = 0,
            this.setData({
                search: true,
                money: false,
                searchsContent: e.currentTarget.dataset.val,
            })
        GetList(this)
    },

    /**
     * 清空历史搜索
     */
    clear: function (e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: Config.baseUrl + 'Search/clearHisSearch',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: { userid: userid },
                        method: 'POST',
                        success: function (res) {
                            if (res.data.result == true) {
                                that.setData({
                                    hislist: [],
                                    his: true,
                                })
                            }
                        }
                    })
                }
            }
        })
    }
})

/**
 * 历史搜索列表
 */
function getHisSearchList(that) {
    wx.request({
        url: Config.baseUrl + 'Search/getSearchHistoryList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { userid: userid },
        method: 'POST',
        success: function (res) {
            if (res.data == '') {
                that.setData({
                    his: true,
                })
            } else {
                that.setData({
                    hislist: res.data,
                })
            }
        }
    })
}

/**
 * 热门搜索列表
 */
function getHotSearchList(that) {
    wx.request({
        url: Config.baseUrl + 'Search/getSearchHotList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { userid: userid },
        method: 'POST',
        success: function (res) {
            that.setData({
                hotlist: res.data,
            })
        }
    })
}
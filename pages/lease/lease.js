// pages/lease/lease.js
import {
    Config
} from '../../utils/config.js';
var Util = require('../../utils/util.js');
var publiclist = require('../../template/publiclist.js');
import emoji from '../../utils/emoji';
var config = new Config();
var app = getApp();
//分页获取租圈列表
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url = Config.baseUrl + 'Release/releaseList';
var GetList = function(that) {
    formdata.userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    formdata.pagenum = p;
    formdata.cityname = that.data.cityname;
    formdata.keyword = that.data.keyword;
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
            success: function(res) {
                wx.stopPullDownRefresh();
                var l = that.data.list;
                that.setData({
                    switchover: false,
                    finish: false,
                    noresult: false,
                    loadingHidden: true,
                    rowcount: res.data.page.rowcount,
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
                    l.map(
                        (value, index) => {
                            if (value['content'] != null) {
                                l[index]['content'] = emoji.encodeEmoji(value['content']);
                            } else {
                                l[index]['content'] = '';
                            }
                            l[index]['discuss'].map(
                                (value1, index1) => {
                                    l[index]['discuss'][index1]['content'] = emoji.encodeEmoji(value1['content']);
                                }
                            );
                        }
                    );
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
        skiptype: 1,
        hidden: false,
        finish: false,
        noresult: false,
        list: [],
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        videourl: Config.videoUrl,
        cityname: '全国', // 筛选城市
        switchover: true,
        keyword: '', //搜索条件
        unreadcount: 0, //未读信息条数
        pageshow: 1,
        page: "lease",
        forwardcount: 0,   //转发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        publiclist.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        wx.setNavigationBarTitle({
            title: '租圈信息'
        })
        if (options.cityname && options.citycode && options.keyword) {
            var cityinfo = {
                'cityname': options.cityname,
                'citycode': options.citycode
            }
            wx.setStorageSync('userinfo', cityinfo);
            this.setData({
                cityname: options.cityname,
                citycode: options.citycode,
                keyword: options.keyword
            })
        }
    },

    onShow: function() {
        var that = this;
        // 获取本地信息
        //cache(that);
        // 判断用户登录信息是否缓存
        config.userLogin(function() {
            var userinfo = wx.getStorageSync('userinfo');
            var userid = userinfo.userid ? userinfo.userid : 0;
            if (userid > 0) {
                /* 查询用户信息缓存是否失效 */
                app.judgeLogoNBrace(function() {
                    that.setData({
                        userid: userid,
                        username: userinfo.nickname,
                        pageshow: 1,
                        loadingHidden: true,
                    })
                    // 获取未读信息条数
                    getReplyCountByUserid(that);
                });
            } else {
                that.setData({
                    userid: userid,
                    pageshow: 1,
                    loadingHidden: true,
                })
            }
            if (that.data.switchover) {
                that.setData({
                    list: [],
                })
                p = 0;
                //分页获取租圈列表
                GetList(that);
            }
        })
    },
    /**
     * 跳转到主页
     */
    returnindex: function(e) {
        config.permission('index/index', function() {
            wx.switchTab({
                url: '../index/index'
            })
        })
    },
    /*跳转到消息列表*/
    jumpreplylist: function(e) {
        wx.navigateTo({
            url: "../replylist/replylist"
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        //下拉  
        p = 0;
        this.setData({
            hidden: false,
            finish: false,
            noresult: false,
            list: [],
            keyword: '', //搜索条件
        })
        //分页获取租圈列表
        GetList(this);
        //停止刷新
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        //上拉  
        var that = this
        GetList(that)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        if (res.from === 'button' && res.target.id.length>0) {
            // 来自页面内转发按钮
            let msgid = res.target.id;
            return {
                title: '赁客+',
                path: 'pages/detail/detail?msgid=' + msgid
                // imageUrl: '/images/child.png'
                // imageUrl: 'https://wxapp.ilinking.com.cn/upload/wood/20210601/60b5927ed0301.jpg'
            }
        }
        else{
            return {
                title: '租圈信息',
                path: 'pages/lease/lease?keyword=' + this.data.keyword + '&cityname=' + this.data.cityname + '&citycode=' + this.data.citycode
            }
        }
    },

    /**
     * 跳转发布
     */
    issue: function() {
        wx.navigateTo({
            url: '../release/release',
        })
        // config.permission('release/release', function() {
        // })
    },

    /**
     * 点击进入城市列表、
     */
    citylist: function(event) {
        var url = config.getDataSet(event, 'url');
        wx.navigateTo({
            url: '../citylist/citylist?rurl=' + url,
        })
        // config.permission(url, function() {
        // })
    },
    /**
     * 获取条件
     */
    searchInput: function(e) {
        var keyword = e.detail.value;
        this.setData({
            keyword: keyword
        })
    },
    /**
     * 搜索
     */
    search: function(e) {
        p = 0;
        this.setData({
            list: [],
        })
        GetList(this);
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
    }
})

/**
 * 增加浏览次数
 */
function addBrowse(that, index, id, typeid, callback) {
    wx.request({
        url: Config.baseUrl + 'Advert/addBrowse',
        data: {
            id: id,
            typeid: typeid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            if (res.data.result == true) {
                var datalist = that.data.list;
                for (var i = 0; i < datalist.length; i++) {
                    if (i == index) {
                        datalist[i]['viewcounts'] = parseInt(datalist[i]['viewcounts']) + 1;
                    }
                    that.setData({
                        list: datalist,
                    })
                }
                callback();
            }
        }
    })
}

/**
 * 获取未读消息数
 */
function getReplyCountByUserid(that) {
    wx.request({
        url: Config.baseUrl + "Release/getReplyCountByUserid",
        data: {
            userid: wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            wx.hideLoading();
            if (res.data) {
                that.setData({
                    unreadcount: res.data
                })
            } else {
                that.setData({
                    unreadcount: 0
                })
            }
        }
    })
}
// pages/com-video/com-video.js
import { Config } from '../../utils/config.js';
var config = new Config();
var util = require('../../utils/util.js');
var app = getApp();
// 分页获取搜索内容
var p = 0;
var s_pagecount = 1;
var formlistdata = [];
var url = Config.baseUrl + 'Company/getCompanyAllVideos';
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
/*视频URL上传*/
var uploadurl = function (that, e) {
    wx.request({
        url: Config.baseUrl + 'Company/addCompanyVideos', //仅为示例，非真实的接口地址
        data: {
            userid: that.data.userid,
            companyid: that.data.companyid,
            videourl: e.detail.value.videourl,
        },
        method: 'post',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function (res) {
            p = 0;
            that.setData({
                list: [],
                vurl: '',
            });
            GetList(that)


        }
    })
}
Page({



    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loadingHidden: true,
        files: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '精选视频'
        })
        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        this.setData({
            companyid: companyid,
            userid: userid,
        })
        //分页获取视频
        p = 0;
        GetList(this);

    },
    chooseVideo: function (e) {
        var videourl = e.detail.value.videourl;
        if (videourl !== ''){
              uploadurl(this, e);
        }else{
           wx.showModal({
             title: '友情提示',
             content: '视频的地址不能为空',
           })
        }
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
      * 跳转删除
      */
    clickDel: function (e) {
        var videoid = config.getDataSet(e, 'videoid');
        var url = Config.baseUrl + 'Company/deleteCompanyVideosById';
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { videoid: videoid },
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
                                            loadingHidden: false,
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
})
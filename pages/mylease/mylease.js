// pages/mylease/mylease.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
import emoji from '../../utils/emoji';
var config = new Config();
var userid
//分页
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url = Config.baseUrl + 'Release/getMyRelease';
var GetList = function (that) {
    formdata.userid = wx.getStorageSync("userinfo").userid;
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
                    switchover: false
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
        hidden: false,
        finish: false,
        noresult: false,
        loadingHidden: false,
        list: [],
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        videourl: Config.videoUrl,
        currentVid: null,
        currentVideo: null,
        switchover: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的发布'
        }),
        userid = wx.getStorageSync('userinfo').userid;
        this.setData({
            username: wx.getStorageSync('userinfo').username
        })
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
     * 监听页面显示
     */
    onShow: function () {
        var that = this;
        if (that.data.switchover){
            p = 0;
            that.setData({
                list: [],
            })
            //分页加载页面
            GetList(that);
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
        var that = this
        GetList(that);
        //停止刷新
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //上拉  
        var that = this
        GetList(that)
    },
    /**
     * 跳转发布
     */
    issue: function () {
        wx.navigateTo({
            url: '../release/release',
        })
        // config.permission('issue/issue', function () {
        // })
    },
    /**
     * 跳转修改
     */
    editmsg: function (e) {
        var url = config.getDataSet(e, "url");
        wx.navigateTo({
            url: url
        })
    },
    /*删除*/
    delmsg: function (e) {
        var that = this;
        var msgid = config.getDataSet(e, "msgid");
        delmsg(that, msgid);
    },
    /*创建视频*/
    playVideo: function (e) {
        var that = this;
        var vid = config.getDataSet(e, "vid");
        if (that.data.currentVid !== null) {
            that.data.currentVideo.pause()
        }
        let currentVideo = wx.createVideoContext(vid);
        that.setData({
            currentVideo,
            currentVid: vid
        })
        setTimeout(function () {
            currentVideo.requestFullScreen();
            currentVideo.play();
        }, 100)
    },
    /*退出全屏执行的操作*/
    exitfullscreenfunc: function (e) {
        var that = this;
        if (!e.detail.fullScreen) {
            that.data.currentVideo.pause();
            that.setData({
                currentVid: null,
                currentVideo: null
            })
        }
    },
    /*图片预览*/
    prevPublicImg: function (e) {
        var that = this;
        var imgsrc = config.getDataSet(e, "src");
        var imglist = config.getDataSet(e, "imglist");
        var prevArray = [];
        for (var i = 0; i < imglist.length; i++) {
            prevArray.push(that.data.imgurls + imglist[i]['picurl']);
        }
        wx.previewImage({
            current: imgsrc, // 当前显示图片的http链接
            urls: prevArray // 需要预览l图片http链接列表
        })
    },
    /*点赞或取消点赞*/
    editPraise: function (e) {
        var that = this,
            msgid = config.getDataSet(e, "msgid"),
            index = e.currentTarget.dataset['index'],
            praised = e.currentTarget.dataset['praised'],
            userid = config.getDataSet(e, "userid");
        var url = praised == 0 ? Config.baseUrl + "Release/addPraise" : Config.baseUrl + "Release/deletePraise";
        editPraiseDetail(that, userid, msgid, index, url);
    },
    /**
     * 点击进入详情页
     */
    indetailurl: function (e) {
        var msgid = e.currentTarget.dataset['msgid'];
        wx.navigateTo({
            url: "../detail/detail?msgid=" + msgid
        })
    },
    // 内容列表
    recommendurl: function (e) {
        var userid = e.currentTarget.dataset['userid'];
        var companyid = e.currentTarget.dataset['companyid'];
        if (companyid > 0) {
            wx.navigateTo({
                url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
            })
        } else {
            var msgid = e.currentTarget.dataset['msgid'];
            wx.navigateTo({
                url: "../detail/detail?msgid=" + msgid
            })
        }
    },
})

/*删除信息*/
var delmsg = function (that, msgid) {
    wx.showModal({
        title: '删除信息',
        content: '确定要删除该信息吗？',
        confirmText: "删除",
        cancelText: "取消",
        success: function (res) {
            if (res.confirm) {
                wx.showLoading({
                    title: "正在加载中",
                    mask: true
                })
                /*删除请求后台*/
                wx.request({
                    url: Config.baseUrl + "Release/deleteMsgRelease",
                    data: {
                        userid: that.data.userid,
                        msgid: msgid,
                        accesstoken: that.data.accesstoken,
                        unionid: that.data.unionid
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "post",
                    success: function (res) {
                        if (res.data.code == 100) {
                            app.wxLogin(function () {
                                var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
                                var username = wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : (wx.getStorageSync('userinfo').nickname ? wx.getStorageSync('userinfo').nickname : "匿名");
                                var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
                                var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
                                that.setData({
                                    accesstoken: accesstoken,
                                    username: username,
                                    userid: userid,
                                    unionid: unionid,
                                })
                                // 删除信息
                                delmsg(that, msgid);
                            })
                        } else {
                            if (res.data.result) {
                                wx.hideLoading();
                                wx.showToast({
                                    title: "操作成功",
                                    icon: 'success',
                                    duration: 2000,
                                    success: function (e) {
                                        p = 0;
                                        that.setData({
                                            list: [],
                                        });
                                        GetList(that);
                                    }
                                })
                            }
                        }
                    }
                })
                /*删除请求后台*/
            } else {
                return;
            }
        }
    });
}

/**
 * 点赞和取消点赞
 */
function editPraiseDetail(that, tuserid, msgid, index, url) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: url,
        data: {
            userid: userid,
            msgid: msgid,
            tuserid, tuserid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            wx.hideLoading();
            if (res.data.result) {
                var list = that.data.list;
                var myuserid = userid;
                list[index].praised = (list[index].praised == 1) ? 0 : 1;
                list[index].praisecount = (list[index].praised == 1) ? (parseInt(list[index].praisecount) + 1) : (parseInt(list[index].praisecount) - 1);
                that.setData({
                    list: list
                })
            } else {
                config.modaljy(res.data.msg);
                return;
            }
        }
    });
}
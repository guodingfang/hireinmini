import {Config} from '../../utils/config.js';
import Card from '../../utils/card';
import emoji from '../../utils/emoji';
var publiclist = require('../../template/publiclist.js');
var config = new Config();
//获取应用实例
const app = getApp()
var p = 0;
var s_pagecount = 1;
/*获取用户信息*/
var getUserMes = function(that) {
    wx.request({
        url: Config.baseUrl + "Release/getWxMiniUserInfoByUserid",
        data: {
            userid: that.data.hostuserid,
            companyid: that.data.companyid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            that.setData({
                userRequestInfo: res.data,
                failFlag: false,
            })
            /*绘制图片*/
            that.setData({
                template: new Card().palette(that, Config.baseUrl),
            });
        }
    })
}
/*获取列表*/
var getList = function(that) {
    // if (that.data.userid <= 0) {
    //     that.setData({
    //         list: []
    //     })
    //     return;
    // }
    /*加载完毕*/
    if (p == s_pagecount) {
        that.setData({
            loadhidden: false,
            finish: true,
            noresult: false
        });
    }
    if (s_pagecount > p) {
        that.setData({
            loadhidden: true,
            finish: false,
            noresult: false
        });
        wx.request({
            url: Config.baseUrl + 'Release/companyMsgList',
            data: {
                userid: that.data.userid,
                pagenum: p,
                companyid: that.data.companyid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                wx.stopPullDownRefresh();
                var l = that.data.data;
                that.setData({
                    finish: false,
                    noresult: false,
                    loadingHidden: true,
                    switchover: false
                });
                if (res.data.page.pagecount == 0) {
                    that.setData({
                        loadhidden: false,
                        finish: false,
                        noresult: true,
                        list: []
                    });
                } else {
                    s_pagecount = res.data.page.pagecount;
                    var list = that.data.list;
                    list = list.concat(res.data.data);
                    list.map(
                        (value, index) => {
                            if (value['content'] != null) {
                                list[index]['content'] = emoji.encodeEmoji(value['content']);
                            } else {
                                list[index]['content'] = '';
                            }
                            list[index]['discuss'].map(
                                (value1, index1) => {
                                    list[index]['discuss'][index1]['content'] = emoji.encodeEmoji(value1['content']);
                                }
                            );
                        }
                    );
                    that.setData({
                        list: list
                    });
                    if (res.data.page.pagecount == 1) {
                        that.setData({
                            loadhidden: false,
                            finish: true,
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
    imagePath: '',

    data: {
        left: 800,
        finish: false,
        noresult: false,
        loadingHidden: false,
        list: [],
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        videourl: Config.videoUrl,
        failFlag: true,
        currentVid: null,
        currentVideo: null,
        userid: 19,
        hostuserid: 0,
        companyid: 0,
        switchover: true, // 是否加载
        template: [], // 分享朋友圈
    },
    onLoad: function(options) {
        publiclist.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        wx.setNavigationBarTitle({
            title: '内容列表'
        })
        var that = this;
        var qrcodeScene = decodeURIComponent(options.scene);
        if (qrcodeScene != "undefined"){
            var jxScene = config.parseUrl(qrcodeScene);
            that.setData({
                hostuserid: jxScene[0]['userid'],
                companyid: jxScene[1]['companyid']
            })
        }else {
            that.setData({
                hostuserid: options.userid,
                companyid: options.companyid
            })
        }
    },
    onPullDownRefresh: function() {
        //下拉  
        p = 0;
        this.setData({
            list: [],
        });
        var that = this
        getList(that);
    },
    onReachBottom: function() {
        //上拉  
        var that = this
        getList(that)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var that = this;
        return {
            title: '内容列表',
            path: 'pages/recommend/recommend?userid=' + that.data.hostuserid + '&companyid=' + that.data.companyid
        }
    },
    onShow: function() {
        p = 0;
        var that = this;
        config.userLogin(function() {
            var userinfo = wx.getStorageSync('userinfo');
            var userid = userinfo.userid ? userinfo.userid : 0;
            var pageshow = 1;
            if (userinfo.code > 0) {
                var pageshow = 0;
            }
            if (that.data.switchover){
                that.setData({
                    userid: userid,
                    pageshow: pageshow,
                    list: [],
                    username: userinfo.nickname
                });
                getUserMes(that);
                getList(that);
            }
        })
    },
    /*跳转到个人修改页*/
    jumpurl: function(e) {
        var userid = this.data.userid;
        var hostuserid = this.data.hostuserid;
        var url = config.getDataSet(e, "url");
        if (userid == hostuserid) {
            wx.navigateTo({
                url: url
            })
        }
    },

    onImgOK(e) {
        this.imagePath = e.detail.path;
        console.log(e);
    },
    // 保存分享图片
    saveImage() {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: this.imagePath,
            success: function (res) {
                wx.showModal({
                    title: "成功保存图片",
                    content: '已成功为您保存图片到手机相册，请自行前往朋友圈分享',
                    showCancel: false,
                    confirmText: '知道啦',
                    confirmColor: '#72B9C3',
                    success: function (res) {
                        if (res.confirm) {
                            that.setData({
                                left: 800
                            })
                        }
                    }
                })
            },
            fail: function (res) {
                wx.showModal({
                    title: "保存出错",
                    content: '保存出错',
                    showCancel: false,
                    confirmText: '知道啦',
                    confirmColor: '#72B9C3',
                })
            }
        });
    },

    /*生成分享图*/
    shareimg: function () {
        var that = this;
        if (that.data.list.length == 0) {
            config.modaljy("没有可分享到朋友圈的内容");
            return;
        } else {
            if (!that.data.failFlag) {
                this.setData({
                    left: 0
                })
            } else {
                config.modaljy("请稍后再试");
                return;
            }
        }
    },
    /*关闭遮罩*/
    closemask: function () {
        this.setData({
            left: 800
        })
    }
})

/*绘制发送朋友圈图片*/
var drawCanvas = function(that, callback) {
    
}

/*换行展示*/
let getWishBlocks = function(content) {
    let result = [
        [],
        [],
        []
    ];
    let num = 0; //返回数组序列
    content = content;
    let position = 0,
        emojiArr = []; //记录emoji表情位置,以及映射关系
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    content = content.replace(patt,
        char => {
            emojiArr.push({
                char,
                position: position
            });
            return `mucairen&#*${position}*`;
        }
    );
    content = emoji.emojiToArray(content);
    if (typeof content === 'object') {
        // 将文字简单分行，每20个字符为一行
        const COUNT_PER_BLOCK = 23;
        content.forEach(
            (value, index) => {
                if (num < 3) {
                    if ((index + 1) % COUNT_PER_BLOCK === 0) {
                        num++;
                        if (num === 3) {
                            return;
                        }
                        result[num].push(value);
                    } else {
                        result[num].push(value);
                    }
                }
            }
        );
    }
    return {
        wishesContentBlocks: result,
        emojiArr
    };
}
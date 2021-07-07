import {
    Config
} from '../../utils/config.js';
import emoji from '../../utils/emoji';
var publiclist = require('../../template/publiclist.js');
var login = require('../../template/login.js');
var WxParse = require('../../wxParse/wxParse.js');
var config = new Config();
const app = getApp()

Page({
    data: {
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        videourl: Config.videoUrl,
        pageshow: 1,
        otherMsgDetail: [],
        pagetype: "detail", //为了在template中区分是不是详情的
        failFlag: true,
        hidden: true,
        item: [],
        videoList: [],  //视频列表
        companyinfo: [], //公司信息
        operationFlag: false,
        commentShow: false,
        com_tuserid: 0,
        com_fuserid: 0,
        placeInput: "请输入评论内容",
        currentVid: null,
        currentVideo: null,
        verification: "获取验证码",
        phone: '',
        verificationCode: '',
        logourl: '',
        canGetUserProfile: false,  //使用getUserProfile取用户信息
    },
    onLoad: function(options) {
        publiclist.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        wx.setNavigationBarTitle({
            title: '详情'
        })
        var that = this;
        that.setData({
            msgid: options.msgid
        })
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        that.getLogoUrl();
    },
    onShow: function() {
        var that = this;
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userinfo = wx.getStorageSync('userinfo');
            var userid = userinfo.userid ? userinfo.userid : 0;
            that.setData({
                userid: userid,
                username: userinfo.nickname
            })
            getMes(that, function () {
                getOtherMes(that);
            });
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {
        var that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
        }
        return {
            title: "",
            path: 'pages/detail/detail?msgid=' + that.data.msgid + '&hostuserid=' + that.data.hostuserid,
            success: function(res) {
                config.addShareRecord(that, "pages/detail/detail", "详情页", "msgid", that.data.msgid, "", 1);
            }
        }
    },
    /*关闭遮罩*/
    closemask: function() {
        this.setData({
            hidden: true
        })
    },
    /*删除*/
    delmsg: function(e) {
        var that = this;
        var msgid = config.getDataSet(e, "msgid");
        delmsg(that, msgid);
    },
    /*修改*/
    editmsg: function(e) {
        var url = config.getDataSet(e, "url");
        wx.navigateTo({
            url: url
        })
    },
    /*点赞或取消点赞*/
    editPraiseDetail: function(e) {
        var that = this,
            msgid = config.getDataSet(e, "msgid"),
            praised = e.currentTarget.dataset['praised'],
            userid = config.getDataSet(e, "userid");
        var userinfo = wx.getStorageSync('userinfo');
        if (userinfo.userid > 0) {
            var url = praised == 0 ? Config.baseUrl + "Release/addPraise" : Config.baseUrl + "Release/deletePraise";
            editPraiseDetail1(that, userid, msgid, url);
        } else {
            that.setData({
                pageshow: 0,
                userinfo: userinfo,
            })
        }
    },
    /* 跳转公司详情 */
    company: function(e) {
        var companyid = config.getDataSet(e, 'companyid');
        wx.navigateTo({
            url: '../companydetails/companydetails?companyid=' + companyid + '&typeid=2',
        })
    },
    /**
     * 点击进入内容列表
     */
    reurlFunc: function(e) {
        var userid = config.getDataSet(e, 'userid');
        var companyid = config.getDataSet(e, 'userid');
        if (companyid > 0) {
            wx.navigateTo({
                url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
            })
        }
    },
    /*点击评论按钮*/
    commentboxFunc: function(e) {
        var that = this;
        var ctusername = config.getDataSet(e, "ctusername");
        var userinfo = wx.getStorageSync('userinfo');
        if (userinfo.userid > 0) {
            that.setData({
                commentShow: true,
                com_tuserid: that.data.item.userid,
                com_fuserid: that.data.userid,
                com_tusername: ctusername,
                com_fusername: that.data.username,
                placeInput: "请输入评论内容"
            })
        } else {
            that.setData({
                pageshow: 0,
                userinfo: userinfo,
            })
        }

    },
    /*隐藏评论框*/
    hideCommentBox: function(e) {
        var that = this;
        that.setData({
            commentShow: false
        })
    },
    /*添加评论*/
    sendComment: function(e) {
        var commit_param = e.detail.value;
        var that = this;
        commit_param['userid'] = that.data.userid;
        if (config.Trim(commit_param.content) == '') {
            config.modaljy("请输入评论内容");
            return;
        }
        sendcontent(that, commit_param);
    },

    /*回复评论*/
    replyComment: function(e) {
        var that = this;
        var msguserid = config.getDataSet(e, "msguserid");
        var tuserid = config.getDataSet(e, "tuserid");
        var fuserid = config.getDataSet(e, "fuserid");
        var fusername = config.getDataSet(e, "fusername");
        var myuserid = that.data.userid;
        if (myuserid != fuserid) {
            that.setData({
                commentShow: true,
                com_tuserid: fuserid,
                com_fuserid: myuserid,
                com_tusername: fusername,
                com_fusername: that.data.username,
                placeInput: "回复" + fusername + ":"
            })
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

    /*取系统logo*/
    getLogoUrl: function(e) {
        var that = this;
        wx.request({
            url: Config.baseUrl + "WXAppLogin/getWxMiniLogo",
            data: {
                userid: that.data.userid,
                accesstoken: that.data.accesstoken,
                unionid: that.data.unionid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                console.log('logo url:',res);
                if (res.data.logo.length>0) {
                    that.setData({
                        logourl: Config.imgUrl + res.data.logo
                    })
                }
            }
        })
    },
})

/*根据msgid获取信息*/
var getMes = function(that, callback) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Release/getMsgReleaseDetail",
        data: {
            msgid: that.data.msgid,
            // msgid: 4561,
            // msgid: 4397,
            userid: that.data.userid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            wx.hideLoading();
            if (res.data.info.content != null) {
                res.data.info.content = emoji.encodeEmoji(res.data.info.content);
            }

            let operationFlag = false;
            if (res.data.info.userid == that.data.userid && that.data.userid > 0) {
                operationFlag = true;
            }
            res.data.info.discuss.map(
                (value, index) => {
                    res.data.info.discuss[index]['content'] = emoji.encodeEmoji(value['content']);
                }
            );
            var companyinfo = [];
            if (res.data.companyinfo){
                res.data.companyinfo.logopic = res.data.companyinfo.logopic == '' ? '' : that.data.imgurl + res.data.companyinfo.logopic
                companyinfo = res.data.companyinfo;
            }
            // 获取视频
            // var article =res.data.info.content;
            // var videoList = [];
            // let videoReg = /<video.*?(?:>|\/>)/gi;   //匹配到字符串中的 video 标签
            // let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;  //匹配到字符串中的 video 标签 的路径
            // let arr = article.match(videoReg) || [];  // arr 为包含所有video标签的数组
            // let articleList = article.split('</video>')   // 把字符串  从视频标签分成数组
            // arr.forEach((item,index)=>{
            //     var src = item.match(srcReg);
            //     console.log("视频地址",src)
            //     videoList.push(src[1])     //所要显示的字符串中 所有的video 标签 的路径
            // })
            // console.log("视频",videoList)
            that.setData({
                // videoList: videoList,
                userids: res.data.info.userid,
                item: res.data.info,
                companyinfo: companyinfo,
                operationFlag: operationFlag
            })
            WxParse.wxParse('msgarticle', 'html', res.data.info.content, that, 5);
            callback(that, res.data.msgid);
        }
    });
}
/*获取该用户发布的其他信息*/
var getOtherMes = function(that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Release/otherHostMsgList",
        data: {
            userid: that.data.userid,
            userids: that.data.userids,
            msgid: that.data.msgid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            if (res.data.code == 100) {
                // 判断用户登录信息是否缓存
                config.userLogin(function() {
                    app.wxLogin(function() {
                        var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
                        var username = wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : (wx.getStorageSync('userinfo').nickname ? wx.getStorageSync('userinfo').nickname : "匿名");
                        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
                        var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
                        that.setData({
                            accesstoken: accesstoken,
                            userid: userid,
                            username: username,
                            unionid: unionid,
                        })
                        getOtherMes(that);
                    })
                })
            } else {
                wx.hideLoading();
                res.data.data.map(
                    (value, index) => {
                        res.data.data[index]['content'] = emoji.encodeEmoji(value['content']);
                        res.data.data[index].discuss.map(
                            (dv,di)=>{
                                res.data.data[index].discuss[di]['content'] = emoji.encodeEmoji(dv['content']);
                            }
                        );
                    }
                );
                that.setData({
                    list: res.data.data
                })
            }
        }
    });
}

/*删除信息*/
var delmsg = function(that, msgid) {
    wx.showModal({
        title: '删除信息',
        content: '确定要删除该信息吗？',
        confirmText: "删除",
        cancelText: "取消",
        success: function(res) {
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
                    success: function(res) {
                        if (res.data.code == 100) {
                            app.wxLogin(function() {
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
                                    title: "提交成功",
                                    icon: 'success',
                                    duration: 2000,
                                    success: function(e) {
                                        wx.reLaunch({
                                            url: '../index/index',
                                        })
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
function editPraiseDetail1(that, tuserid, msgid, url) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: url,
        data: {
            userid: that.data.userid,
            msgid: msgid,
            tuserid, tuserid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            wx.hideLoading();
            if (res.data.result) {
                var list = that.data.item;
                var myuserid = that.data.userid;
                list.praised = (list.praised == 1) ? 0 : 1;
                list.praisecount = (list.praised == 1) ? (parseInt(list.praisecount) + 1) : (parseInt(list.praisecount) - 1);
                /*点赞列表添加或删除对应的点赞人*/
                var containUserid = getArraycontains(list.praiser, 'userid', myuserid);
                var containIndex = list.praiser.indexOf(containUserid);
                if (containIndex > -1) {
                    list.praiser.splice(containIndex, 1);
                } else {
                    list.praiser.push({
                        'username': that.data.username,
                        'userid': that.data.userid
                    });
                }
                that.setData({
                    item: list
                })
            } else {
                config.modaljy(res.data.msg);
                return;
            }
        }
    });
}


/**
 * 数组的每一项是否包含一个字串  param1：主串，param2：字串,返回包含该字符串的新数组
 * @author  sh
 */
function getArraycontains(dataArray, param, str) {
    var newData = {};
    if (str != '') {
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i][param].indexOf(str) > -1) {
                newData = dataArray[i];
            }
        }
        return newData;
    } else {
        return {};
    }
}

/*发送评论*/
var sendcontent = function(that, data) {
    data.content = emoji.decodeEmoji(data.content);
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Release/addComment",
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            if (res.data.code == 100) {
                // 判断用户登录信息是否缓存
                config.userLogin(function() {
                    app.wxLogin(function() {
                        var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
                        var username = wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : (wx.getStorageSync('userinfo').nickname ? wx.getStorageSync('userinfo').nickname : "匿名");
                        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
                        var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
                        that.setData({
                            accesstoken: accesstoken,
                            userid: userid,
                            username: username,
                            unionid: unionid,
                        })
                        sendcontent(that);
                    })
                })
            } else {
                wx.hideLoading();
                if (res.statusCode != 200) {
                    config.modaljy("提交失败，请联系管理员");
                    return;
                }
                if (res.data.result) {
                    that.setData({
                        commentShow: false
                    })
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                            var item = that.data.item;
                            item.commentlist.push({
                                "content": emoji.encodeEmoji(data.content),
                                "userid_receiver": data.tuserid,
                                "userid_sender": data.fuserid,
                                "touser": data.tusername,
                                "sender": data.fusername
                            });
                            /*更改评论次数*/
                            item.commentcount = parseInt(item.commentcount) + 1;
                            that.setData({
                                item: item
                            })
                        }
                    })
                } else {
                    config.modaljy(res.data.msg);
                    return;
                }
            }
        }
    });
}
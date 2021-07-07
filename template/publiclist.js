import {
    Config
} from '../utils/config.js';
import emoji from '../utils/emoji.js';
const app = getApp();
var config = new Config();

function init() {
    var that = this;
    //header中相应的数据
    that.setData({
        currentVid: null,
        currentVideo: null
    });

    // 内容列表
    that.recommendurl = function(e) {
        var userid = e.currentTarget.dataset['userid'];
        var companyid = e.currentTarget.dataset['companyid'];
        var skiptype = e.currentTarget.dataset['skiptype'];
        if (companyid > 0) {
            if (skiptype == 1){
                wx.navigateTo({
                    url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
                })
            }else {
                wx.redirectTo({
                    url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
                })
            }
        } else {
            var msgid = e.currentTarget.dataset['msgid'];
            if (skiptype == 1){
                wx.navigateTo({
                    url: "../detail/detail?msgid=" + msgid
                })
            }else {
                wx.redirectTo({
                    url: "../detail/detail?msgid=" + msgid
                })
            }
        }
    };
    //拨打电话
    that.clickPhone = function(e) {
        var phone = e.currentTarget.dataset['phone'];
        that.addUserDialRecord(phone);

    };
    //图片预览
    that.prevPublicImg = function(e) {
        var imgsrc = e.currentTarget.dataset['src'];
        var imglist = e.currentTarget.dataset['imglist'];
        var prevArray = [];
        for (var i = 0; i < imglist.length; i++) {
            prevArray.push(that.data.imgurls + imglist[i]['picurl']);
        }
        wx.previewImage({
            current: imgsrc, // 当前显示图片的http链接
            urls: prevArray // 需要预览l图片http链接列表
        })
    };
    /**
     * 拨打电话后台交互
     */
    that.addUserDialRecord = function(phone) {
        wx.request({
            url: Config.baseUrl + "Release/addUserDialRecord",
            data: {
                userid: that.data.userid,
                unionid: that.data.unionid,
                phone: phone,
                accesstoken: that.data.accesstoken
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                if (res.data.code == 100) {
                    app.wxLogin(function() {
                        var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
                        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
                        var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
                        that.setData({
                            accesstoken: accesstoken,
                            userid: userid,
                            unionid: unionid,
                        })
                        // 拨打电话后台交互
                        that.addUserDialRecord(phone);
                    })
                } else {
                    console.info(res);
                }
            }
        });
        wx.makePhoneCall({
            phoneNumber: phone,
        })
    }
    /*创建视频*/
    that.playVideo = function(e) {
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
        setTimeout(function() {
            currentVideo.requestFullScreen();
            currentVideo.play();
        }, 100)
    }
    /*退出全屏执行的操作*/
    that.exitfullscreenfunc = function(e) {
        var that = this;
        if (!e.detail.fullScreen) {
            that.data.currentVideo.pause();
            that.setData({
                currentVid: null,
                currentVideo: null
            })
        }
    }
    /**
     * 点击进入详情页
     */
    that.indetailurl = function(e) {
        var that = this;
        var msgid = e.currentTarget.dataset['msgid'];
        var skiptype = e.currentTarget.dataset['skiptype'];
        if (skiptype == 1){
            wx.navigateTo({
                url: "../detail/detail?msgid=" + msgid
            })
        }else {
            wx.redirectTo({
                url: "../detail/detail?msgid=" + msgid
            })
        }
    }
    /**
     * 点击进入内容列表
     */
    that.reurlFunc = function(e) {
        var userid = e.currentTarget.dataset['userid'];
        var companyid = e.currentTarget.dataset['companyid'];
        if (companyid > 0){
            wx.navigateTo({
                url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
            })
        }
    }
    /**
     * 点赞和取消点赞事件
     */
    that.editPraise = function(e) {
        var that = this,
            msgid = e.currentTarget.dataset['msgid'],
            index = e.currentTarget.dataset['index'],
            praised = e.currentTarget.dataset['praised'],
            userid = e.currentTarget.dataset['userid'],
            userinfo = wx.getStorageSync('userinfo');
        if (userinfo.userid > 0) {
            var url = praised == 0 ? Config.baseUrl + "Release/addPraise" : Config.baseUrl + "Release/deletePraise";
            that.editPraiseFunc(that, userid, msgid, index, url);
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }
    }
    /**
     * 点赞和取消点赞提交方法
     */
    that.editPraiseFunc = function(that, tuserid, msgid, index, url) {
        wx.showLoading({
            title: "正在加载中",
            mask: true
        })
        wx.request({
            url: url,
            data: {
                userid: that.data.userid,
                msgid: msgid,
                tuserid,
                tuserid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                wx.hideLoading();
                if (res.data.result) {
                    var list = that.data.list;
                    var myuserid = that.data.userid;
                    list[index].praised = (list[index].praised == 1) ? 0 : 1;
                    list[index].praisecount = (list[index].praised == 1) ? (parseInt(list[index].praisecount) + 1) : (parseInt(list[index].praisecount) - 1);
                    /*点赞列表添加或删除对应的点赞人*/
                    var containUserid = that.getArraycontains(list[index].praiser, 'userid', myuserid);
                    var containIndex = list[index].praiser.indexOf(containUserid);
                    if (containIndex > -1) {
                        list[index].praiser.splice(containIndex, 1);
                    } else {
                        list[index].praiser.push({
                            'username': that.data.username,
                            'userid': that.data.userid
                        });
                    }
                    that.setData({
                        list: list
                    })
                }
            }
        });
    }
    /**
     * 数组的每一项是否包含一个字串  param1：主串，param2：字串,返回包含该字符串的新数组
     * @author  sh
     */
    that.getArraycontains = function(dataArray, param, str) {
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
    /*点击评论按钮*/
    that.commentboxFunc = function(e) {
        var ctusername = config.getDataSet(e, "ctusername");
        var userinfo = wx.getStorageSync('userinfo');
        var tuserid = config.getDataSet(e, 'tuserid');
        var msgid = config.getDataSet(e, 'msgid');
        var index = config.getDataSet(e, 'index');
        if (userinfo.userid > 0) {
            that.setData({
                commentShow: true,
                com_tuserid: tuserid,
                com_fuserid: that.data.userid,
                com_tusername: ctusername,
                com_fusername: that.data.username,
                msgid: msgid,
                index: index,
                placeInput: "请输入评论内容"
            })
        } else {
            wx.navigateTo({
                url: '../login/login',
            })
        }

    }
    /*隐藏评论框*/
    that.hideCommentBox = function(e) {
            that.setData({
                commentShow: false
            })
        },
    /*添加评论*/
    that.sendComment = function(e) {
        var commit_param = e.detail.value;
        commit_param['userid'] = that.data.userid;
        if (config.Trim(commit_param.content) == '') {
            config.modaljy("请输入评论内容");
            return;
        }
        that.sendcontent(that, commit_param);
    }

    /*回复评论*/
    that.replyComment = function(e) {
        var msguserid = config.getDataSet(e, "msguserid");
        var tuserid = config.getDataSet(e, "tuserid");
        var fuserid = config.getDataSet(e, "fuserid");
        var fusername = config.getDataSet(e, "fusername");
        var myuserid = that.data.userid;
        var msgid = config.getDataSet(e, 'msgid');
        var index = config.getDataSet(e, 'index');
        if (myuserid != fuserid) {
            that.setData({
                commentShow: true,
                com_tuserid: fuserid,
                com_fuserid: myuserid,
                com_tusername: fusername,
                com_fusername: that.data.username,
                msgid: msgid,
                index: index,
                placeInput: "回复" + fusername + ":"
            })
        }
    }
    /*发送评论*/
    that.sendcontent = function(that, data) {
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
                wx.hideLoading();
                if (res.data.result) {
                    that.setData({
                        commentShow: false
                    })
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1000,
                        success: function() {
                            var index = that.data.index;
                            var list = that.data.list;
                            list[index].discuss.push({
                                "content": emoji.encodeEmoji(data.content),
                                "userid_receiver": data.tuserid,
                                "userid_sender": data.fuserid,
                                "touser": data.tusername,
                                "sender": data.fusername
                            });
                            /*更改评论次数*/
                            list[index].discusscount = parseInt(list[index].discusscount) + 1;
                            that.setData({
                                list: list
                            })
                        }
                    })
                } else {
                    config.modaljy(res.data.msg);
                    return;
                }
            }
        });
    }
    // 公司详情
    that.company = function(e){
        var companyid = config.getDataSet(e, 'companyid');
        wx.navigateTo({
            url: '../companydetails/companydetails?companyid='+companyid+'&typeid=2',
        })
    }
    // 转发
    that.shareFunc = function(e){
        console.log("转发",e);
        var that = this;
        var index = e.currentTarget.dataset.index;
        var msgid = e.currentTarget.dataset.msgid;
        var userInfo = wx.getStorageSync('userinfo');
        var data = {
            "msgid": msgid,
            "userid": userInfo.userid
        }
        wx.showLoading({
            title: "正在加载中",
            mask: true
        })
        wx.request({
            url: Config.baseUrl + "Release/editForwardCount",
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                console.log("转发回调", res);
                wx.hideLoading();
                if (res.data.result) {
                    that.shareUpLoadFunc(that, msgid, res.data.forwardcount)
                } else {
                    config.modaljy(res.data.msg);
                    return;
                }
            }
        });
    }
    // 转发更新
    that.shareUpLoadFunc = function(that, msgid, forwardcount){
        var list = that.data.list;
        console.log("list=", list, msgid);
        for(var i=0; i<list.length; i++){
            if(list[i].msgid == msgid){
                list[i].forwardcount = forwardcount
            }
        }
        that.setData({
            list: list
        })
    }
    // 关注
    that.attention = function(e){
        console.log("关注",e);
        var that = this;
        var index = e.currentTarget.dataset.index;
        var msgid = e.currentTarget.dataset.msgid;
        var userid = e.currentTarget.dataset.userid;
        var companyid = e.currentTarget.dataset.companyid;
        var focused = e.currentTarget.dataset.focused;
        var userInfo = wx.getStorageSync('userinfo');
        if(focused==1) focused = 0;
        else focused=1;
        var data = {
            "targetcompanyid": companyid,
            "targetuserid": userid,
            "userid": userInfo.userid,
            "focused": focused
        }
        wx.showLoading({
            title: "正在加载中",
            mask: true
        })
        wx.request({
            url: Config.baseUrl + "User/addAttention",
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                wx.hideLoading();
                if (res.data.result) {
                    var list = that.data.list;
                    list[index].focused = focused;
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
};
module.exports = {
    init: init
};
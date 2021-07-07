import { Config } from '../../utils/config.js';
import emoji from '../../utils/emoji';
var config = new Config();
const app = getApp()
/*获取消息列表*/
var getReplyMes = function (that) {
    wx.request({
        url: Config.baseUrl + "Release/getReplylistByUserid",
        data: {
            userid: that.data.userid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            wx.hideLoading();
            if(res.statusCode == 200){
                res.data.unread.map(
                    (value, index) => {
                        if(res.data.unread[index]['typesign'] == 2){
                            res.data.unread[index]['content'] = emoji.encodeEmoji(res.data.unread[index]['content']);
                        }
                    }
                );
                res.data.read.map(
                    (value, index) => {
                        if(res.data.read[index]['typesign'] == 2){
                            res.data.read[index]['content'] = emoji.encodeEmoji(res.data.read[index]['content']);
                        }
                    }
                );
                that.setData({
                    readarray:res.data.read,
                    unreadarray:res.data.unread
                })
            }else{
                that.setData({
                    readarray:[],
                    unreadarray:[]
                })
            }
        }
    })
}

Page({
    data: {
        imgurl: Config.imgUrl,
        pageshow: 1,
        loadingHidden: false,
        readarray:[],
        unreadarray:[],
        hideReadFlag:false
    },
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '消息列表'
        })
    },
    onShow: function () {
        var that = this;
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userinfo = wx.getStorageSync('userinfo');
            if (userinfo.code > 0) {
                that.setData({
                    pageshow: 0,
                    userinfo: userinfo,
                })
            } else {
                var accesstoken = userinfo.accesstoken ? userinfo.accesstoken : '';
                var userid = userinfo ? userinfo.userid : '';
                var unionid = userinfo.unionid ? userinfo.unionid : '';
                that.setData({
                    pageshow: 1,
                    accesstoken: accesstoken,
                    userid: userid,
                    unionid: unionid,
                    list: [],
                });
                getReplyMes(that);
            }
        })
    },
    /*点击查看更多信息*/
    showReadArray:function(e){
        this.setData({
            hideReadFlag:true
        })
    },
    /*货主推荐页判断跳转*/
    recommendurl: function (e) {
        var hostuserid = config.getDataSet(e, "hostuserid");
        var msgid = config.getDataSet(e, "msgid");
        wx.navigateTo({
            url: "../detail/detail?hostuserid=" + hostuserid + "&msgid=" + msgid
        })
    },
    
    /**
     * 点击进入详情页
     */
    indetailurl:function(e){
        var that = this;
        var url = e.currentTarget.dataset['url'];
        wx.navigateTo({
            url: url
        })
    }
})
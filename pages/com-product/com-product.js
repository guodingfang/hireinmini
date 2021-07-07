import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var typeid;//公司跳转标识，1是显示，2不显示。
var companyid;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        comp: false,//公司管理按钮
        info: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        imageurl: Config.imgUrl,
        oncern: 0,
        //图片滚动
        toView: 'red',
        scrollTop: 100,
        companyname: '',
        loadingHidden: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '公司详情'
        })
        typeid = options.typeid;
        companyid = options.companyid;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.setData({
            loadingHidden: false,
        })
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
            if (userid == 0) {
                that.setData({
                    comp: false,
                    companyid: companyid,
                    userid: userid,
                })
            } else {
                var comp = typeid == 1 ? true : false;
                that.setData({
                    comp: comp,
                    companyid: companyid,
                    userid: userid,
                })
            }
            //获取公司详情
            getCompanyInfo(that, companyid);
        })
    },

    /**
    * 跳转到其他标签页
    */
    // skip: function (e) {
    //     var url = config.getDataSet(e, 'url');
    //     config.permission(url, function () {
    //         wx.redirectTo({
    //             url: '../' + url + '?typeid=' + typeid + '&companyid=' + companyid,
    //         })
    //     })
    // },

    /**
  * 跳转到公司管理
  */
    manage: function (e) {
        config.permission('company-manage/company-manage', function () {
            wx.navigateTo({
                url: '../company-manage/company-manage',
            })
        })
    },
    /**
    * 跳转到产品详情
    */
    product_derails: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 分享公司
     */
    onShareAppMessage: function (e) {
        var companyname = this.data.companyname;
        return {
            title: companyname,
            path: '/pages/companydetails/companydetails?companyid=' + this.data.companyid + '&typeid=2'
        }
    },

    /**
     * 跳转到公司页
     */
    mycom: function (e) {
        config.permission('companydetails/companydetails', function () {
            wx.redirectTo({
                url: '../companydetails/companydetails?typeid=2&companyid=' +companyid,
            })
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
     * 跳转到更多图片
     */
    morepic: function (e) {
        var companyid = config.getDataSet(e, 'id');
        config.permission('morepic/morepic', function () {
            wx.navigateTo({
                url: '../morepic/morepic?companyid=' + companyid,
            })
        })
    },
    /**
     * 跳转到更多视频
     */
    morevideo: function (e) {
        var companyid = config.getDataSet(e, 'id');
        config.permission('morevideo/morevideo', function () {
            wx.navigateTo({
                url: '../morevideo/morevideo?companyid=' + companyid,
            })
        })
    },
    /**
     * 跳转到更多产品
     */
    moreproduct: function (e) {
        var companyid = this.data.companyid;
        config.permission('moreproduct/moreproduct', function () {
            wx.navigateTo({
                url: '../moreproduct/moreproduct?companyid=' + companyid,
            })
        })
    },

    /**
     * 关注点击
     */
    attention: function (e) {
        var that = this;
        var userid = that.data.userid;
        if (userid > 0) {
            var id = config.getDataSet(e, 'id');
            wx.request({
                url: Config.baseUrl + 'Company/addCompanyConcern',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: { id: id, userid: this.data.userid },
                method: 'POST',
                success: function (res) {
                    if (res.data.result == true) {
                        var info = that.data.info;
                        info.num = parseInt(info.num) + 1;
                        that.setData({
                            oncern: 1,
                            info: info,
                        })
                    }
                }
            })
        } else {
            config.modalqd('登录后才能关注,确定要登录吗 ?', function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../login/login',
                    })
                }
            })
        }
    },

    /**
     * 删除关注
     */
    delattention: function (e) {
        var id = config.getDataSet(e, 'id');
        var that = this;
        wx.request({
            url: Config.baseUrl + 'Company/delCompanyConcern',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: { id: id, userid: this.data.userid },
            method: 'POST',
            success: function (res) {
                if (res.data.result == true) {
                    that.setData({
                        oncern: 0,
                    })
                    var info = that.data.info;
                    info.num = parseInt(info.num) - 1;
                    that.setData({
                        oncern: 0,
                        info: info,
                    })
                }
            }
        })
    },

    /*图片预览*/
    Imageappear: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.info.pics.length; i++) {
            arr[i] = this.data.imageurl + this.data.info.pics[i].picture;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    },

    /*图片预览*/
    Imageappear1: function (e) {
        var are = [];
        for (var i = 0; i < this.data.info.compamypiclist.length; i++) {
            are[i] = this.data.imageurl + this.data.info.compamypiclist[i].picfilename;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: are // 需要预览的图片http链接列表  
        })
    },

    /**
     * 拨打电话
     */
    contact: function (e) {
        var phone = config.getDataSet(e, 'phone');
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },

    /**
     * 跳转到其他标签也
     */
    skip: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
            wx.redirectTo({
                url: '../' + url + '?typeid=' + typeid + '&companyid=' + companyid,
            })
        })
    },

})

/**
 * 获取公司详情
 */
function getCompanyInfo(that, companyid) {
    wx.request({
        url: Config.baseUrl + 'Company/getCompanyInfo',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { id: companyid, userid: that.data.userid },
        method: 'POST',
        success: function (res) {
            if (res.data != '') {
                that.setData({
                    info: res.data,
                    oncern: res.data.oncern,
                    companyname: res.data.companyname,
                    loadingHidden: true,
                })
            }
        }
    })
}
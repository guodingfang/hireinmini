//index.js
//获取应用实例
import { Config } from '../../utils/config.js';
import { getReleaseList } from '../../models/release'
var util = require('../../utils/util.js');
var publiclist = require('../../template/publiclist.js');
import emoji from '../../utils/emoji';
var login = require('../../template/login.js');
var config = new Config();
var app = getApp();
var userid = 0;
//分页获取最新发布列表company
var p = 0;
var s_pagecount = 1;
var formdata = [];
var url = Config.baseUrl + 'Release/newRelease';
var GetList = function (that) {
    formdata.pagenum = p;
    formdata.userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
    formdata.cityname = that.data.cityname;
    /*加载完毕*/
    if (p == s_pagecount) {
        that.setData({
            hidden: false,
            finish: true,
            noresult: false,
            loadingHidden: true,
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
                    switchover: false,
                    finish: false,
                    noresult: false,
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
                        list: l,
                        loadingHidden: true,
                    });
                    p = p + 1;

                    if (res.data.page.pagecount == 1) {
                        that.setData({
                            finish: true,
                            hidden: false,
                            noresult: false,
                            loadingHidden: true,
                        });
                    }
                }
            }
        });
    }
    /* pagecount > p 结尾 */
}

Page({
    data: {
        skiptype: 1,
        cityname: '',
        citycode: '',
        switchover: true, // 是否加载
        list: [],
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        videourl: Config.videoUrl,
        loadingHidden: false,
        indicatorDots: true, //轮播图配置
        autoplay: true, //轮播图配置
        interval: 5000, //轮播图配置
        duration: 1000, //轮播图配置
        imglist: [],
        verification: "获取验证码",
        phone: '',
        verificationCode: '',
        page: 'index',
				forwardcount: 0,   //转发
				
				newList: [],
    },

    async onLoad () {
        publiclist.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        //获取轮播图
        getSlideshow(this);
        const { data, page } = await getReleaseList({
          pagenum: 1,
          userid: 7548,
          cityname: '全国'
        });
        this.setData({
        	newList: data
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userinfo = wx.getStorageSync('userinfo');
            userid = userinfo.userid ? userinfo.userid : 0;
            if (userid > 0) {
                /* 查询用户信息缓存是否失效 */
                app.judgeLogoNBrace(function () {
                    that.setData({
                        userid: userid,
                        username: userinfo.nickname,
                        loadingHidden: true,
                    })
                });
            } else {
                that.setData({
                    userid: userid,
                    loadingHidden: true,
                })
            }
            //获取城市缓存
            var cityinfo = wx.getStorageSync('cityinfo');
            if (cityinfo != '') {
                that.setData({
                    cityname: cityinfo.cityname,
                    citycode: cityinfo.citycode,
                })
                if (that.data.switchover){
                    that.setData({
                        list: [],
                    })
                    p = 0;
                    //分页获取租圈列表
                    GetList(that);
                }
            } else {
                getCity(that);
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        console.log('转发来源:',res);
        if(res.from=='button'){
            let msgid = res.target.id;
            console.log('msgid=',msgid);
            return {
                title: '赁客+',
                path: '/pages/detail/detail?msgid=' + msgid
                // imageUrl: '/images/child.png'
                // imageUrl: 'https://wxapp.ilinking.com.cn/upload/wood/20210601/60b5927ed0301.jpg'
            }
        }
    },

    /* 轮播图跳转 */
    swipclick: function (event) {
        var url = config.getDataSet(event, 'url');
        if (url){
            wx.navigateTo({
                url: url,
            })
        }
    },
    /*推荐跳转到公司列表*/
    market: function (event) {
        config.permission('companylist/companylist', function () {
            wx.navigateTo({
                url: '../companylist/companylist',
            })
        })
    },

    /*点击关注我们使主页出现二维码*/
    appear: function (event) {
        wx.navigateTo({
            url: '../webview/webview',
        })
    },

    /**
     * 公共点击 (必须登录)
     */
    clickoper: function (event) {
        var that = this;
        getUserinfo(that, function () {
            var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
            if (companyid > 0) {
                var url = config.getDataSet(event, 'url');
                config.permission(url, function (res) {
                    wx.navigateTo({
                        url: '../' + url,
                    })
                });
            } else {
                config.modalqd('请先创建或绑定公司', function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../company_select/company_select',
                        })
                    }
                });
            }
        })
    },

    /* 搜索跳转 */
    searchgood: function () {
        config.permission('searchgood/searchgood', function () {
        wx.navigateTo({
            url: '../searchgood/searchgood',
        })
        })
    },

    /*跳转到公司 */
    entercompany: function (e) {
        var that = this;
        getUserinfo(that, function () {
            var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
            if (companyid > 0) {
                // 有公司跳转公司详情页
                config.permissionht('company-manage/company-manage', function (res) {
                    if (res.data.result){
                        wx.navigateTo({
                            url: '../companydetails/companydetails?typeid=1&companyid=' + companyid,
                        })
                    }else {
                        wx.navigateTo({
                            url: '../companydetails/companydetails?typeid=2&companyid=' + companyid,
                        })
                    }
                })
            } else { // 无公司跳转创建公司或绑定公司页
                wx.navigateTo({
                    url: '../company_select/company_select',
                })
            }
        })
    },

    /* 下拉刷新 */
    onPullDownRefresh: function () {
        p = 0;
        this.setData({
            list: [],
            loadingHidden: false,
        })
        //分页获取租圈列表
        GetList(this);
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
     * 跳转详情
     */
    clickInfo: function (e) {
        var typeid = config.getDataSet(e, 'typeid');
        var id = config.getDataSet(e, 'id');
        var index = config.getDataSet(e, 'index');
        var that = this;
        if (typeid == 1) {
            config.permission('bill_info/bill_info', function () {
                addBrowse(that, index, id, typeid, function () {
                    wx.navigateTo({
                        url: '../bill_info/bill_info?id=' + id + '&adtypeid=' + typeid,
                    })
                })
            })
        } else if (typeid == 2) {
            config.permission('job_info/job_info', function () {
                addBrowse(that, index, id, typeid, function () {
                    wx.navigateTo({
                        url: '../job_info/job_info?id=' + id + '&adtypeid=' + typeid,
                    })
                })
            })
        } else if (typeid == 3) {
            config.permission('sell_info/sell_info', function () {
                addBrowse(that, index, id, typeid, function () {
                    wx.navigateTo({
                        url: '../sell_info/sell_info?id=' + id + '&adtypeid=' + typeid,
                    })
                })
            })
        } else {
            config.permission('buy_info/buy_info', function () {
                addBrowse(that, index, id, typeid, function () {
                    wx.navigateTo({
                        url: '../buy_info/buy_info?id=' + id + '&adtypeid=' + typeid,
                    })
                })
            })
        }
    },
})

/**
 * 获取轮播图列表
 */
function getSlideshow(that) {
    wx.request({
        url: Config.baseUrl + 'Index/getSlideshow',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data != '') {
                that.setData({
                    imglist: res.data
                })
            }
        }
    })
}

/**
 * 获取城市
 */
function getCity(that) {
    //获取最新历史城市
    wx.request({
        url: Config.baseUrl + 'Index/getHitory',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { userid: userid },
        method: 'POST',
        success: function (res) {
            if (res.data != '') {
                p = 0;
                that.setData({
                    citycode: res.data.citycode,
                    cityname: res.data.cityname,
                    list: []
                })
                /*缓存城市信息*/
                wx.setStorageSync('cityinfo', res.data);
                //分页获取租圈列表
                GetList(that);
            } else {
                /* 定位 */
                userLocation(that);
            }
        }
    })
}

/**
 * 请求定位
 */
function userLocation(that) {
    wx.getLocation({
        type: 'wgs84',
        complete: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.request({
                url: Config.baseUrl + 'Index/userLocation',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    userid: userid,
                    latitude: latitude,
                    longitude: longitude,
                },
                success: function (data) {
                    p = 0;
                    that.setData({
                        citycode: data.data.citycode,
                        cityname: data.data.cityname,
                        list: [],
                    })
                    /*缓存城市信息*/
                    wx.setStorageSync('cityinfo', data.data);
                    //分页获取租圈列表
                    GetList(that);
                }
            })
        },
    })

}

/**
 * 增加浏览次数
 */
function addBrowse(that, index, id, typeid, callback) {
    wx.request({
        url: Config.baseUrl + 'Advert/addBrowse',
        data: { id: id, typeid: typeid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
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
 * 获取用户信息
 */
function getUserinfo(that, callback) {
    var code = wx.getStorageSync('userinfo').code;
    if (code == 0) {
        callback();
    } else if (code > 0) {
        wx.navigateTo({
            url: '../login/login',
        })
    }
}


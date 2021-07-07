import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var userid;
//对城市信息进行分组
var searchLetter;
var cityObj;
var searchLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
var cityLists = function () {
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
        var initial = searchLetter[i];
        var cityInfo = [];
        var tempArr = {};
        tempArr.initial = initial;
        for (var j = 0; j < cityObj.length; j++) {
            if (initial == cityObj[j].initial) {
                cityInfo.push(cityObj[j]);
            }
        }
        tempArr.cityInfo = cityInfo;
        tempObj.push(tempArr);
    }
    return tempObj;
}
/**
 * 2017-06-21 16:38
 * auth：sh
 * rurl:表示从哪个页面中进入的
 */
Page({
    data: {
        showLetter: "",
        winHeight: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0,//置顶高度
        scrollTopId: '',//置顶id
        city: '',
        hotcityList: [],
        rurl: "",
        history: [],
        loadingHidden: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '城市列表'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        // 获取城市列表
        cityList(this)
        //点击页面url
        this.setData({
            rurl: options.rurl
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //获取历史城市列表
        getHitoryList(this);
        //获取热门城市列表
        getHotList(this);
    },
    clickLetter: function (e) {
        var showLetter = e.currentTarget.dataset.letter;
        this.setData({
            showLetter: showLetter,
            isShowLetter: true,
            scrollTopId: showLetter,
        })
        var that = this;
        setTimeout(function () {
            that.setData({
                isShowLetter: false
            })
        }, 1000)
    },
    //点击热门城市回到顶部
    hotCity: function () {
        this.setData({
            scrollTop: 0,
        })
    },
    // 点击选择城市并返回首页
    retIndex: function (event) {
        var rurl = this.data.rurl;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (rurl == "index") {
            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            wx.setStorageSync('cityinfo', event.currentTarget.dataset);//城市详情缓存
            //新增用户城市
            addUserCity(function () {
                prevPage.setData({
                    cityname: event.currentTarget.dataset.cityname,
                    citycode: event.currentTarget.dataset.citycode,
                    switchover: true,
                })
                //返回首页
                wx.switchTab({
                    url: '../index/index'
                });
            })
        }  else {
            prevPage.setData({
                citycode: event.currentTarget.dataset.citycode,
                cityname: event.currentTarget.dataset.cityname,
                switchover: true,
            })
            wx.navigateBack();
        }
    }
})
/**
 * 获取城市列表(包括热门城市及历史城市)
 */
function cityList(that) {
    if (wx.getStorageSync("citylist")) {
        //获取缓存
        citycache(that);
    } else {
        //获取城市及热门城市列表
        getCityList(that);
    }
}

/**
 * 获取城市缓存
 */
function citycache(that) {
    cityObj = wx.getStorageSync("citylist");
    wx.setStorageSync("citylist", cityObj);
    var cityList = cityLists();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
        var temp = {};
        temp.name = searchLetter[i];
        temp.tHeight = i * itemH;
        temp.bHeight = (i + 1) * itemH;
        tempObj.push(temp)
    }
    that.setData({
        winHeight: winHeight,
        itemH: itemH,
        searchLetter: tempObj,
        cityList: cityList,
        city: wx.getStorageSync("cityinfo").cityname,
        loadingHidden: true
    })
}

/**
 * 获取城市列表
 */
function getCityList(that) {
    wx.request({
        url: Config.baseUrl + 'Index/getCityList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (data) {
            cityObj = data.data;
            wx.setStorageSync("citylist", cityObj);
            var cityList = cityLists();
            var sysInfo = wx.getSystemInfoSync();
            var winHeight = sysInfo.windowHeight;
            var itemH = winHeight / searchLetter.length;
            var tempObj = [];
            for (var i = 0; i < searchLetter.length; i++) {
                var temp = {};
                temp.name = searchLetter[i];
                temp.tHeight = i * itemH;
                temp.bHeight = (i + 1) * itemH;
                tempObj.push(temp)
            }
            that.setData({
                winHeight: winHeight,
                itemH: itemH,
                searchLetter: tempObj,
                cityList: cityList,
                city: wx.getStorageSync("cityinfo").cityname,
                loadingHidden: true
            })
        }
    })
}

/**
 * 获取历史城市列表
 */
function getHitoryList(that) {
    wx.request({
        url: Config.baseUrl + 'Index/getHitoryList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { userid: userid },
        method: 'POST',
        success: function (data) {
            var hisList = data.data;
            that.setData({
                history: hisList,
            })
        }
    })
}

/**
 * 新增用户城市
 */
function addUserCity(callback) {
    var citycode = wx.getStorageSync('cityinfo').citycode;
    var cityname = wx.getStorageSync('cityinfo').cityname;
    wx.request({
        url: Config.baseUrl + 'Index/addUserCity',
        data: { citycode: citycode, cityname: cityname, userid: userid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.result == true) {
                callback();
            }
        }
    })
}

/**
 * 热门城市列表
 */
function getHotList(that) {
    wx.request({
        url: Config.baseUrl + 'Index/getHotList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (data) {
            var hotlist = data.data;
            that.setData({
                hotcityList: hotlist,
            })
        }
    })
}
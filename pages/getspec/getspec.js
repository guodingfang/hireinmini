import { Config } from '../../utils/config.js';
var config = new Config();
// var Util = require('../../utils/util.js');
// pages/getspec/getspec.js
var goods = [];
/*获取规格列表*/
var getspeclist = function (that) {
    wx.request({
        url: Config.baseUrl + "Goods/getMainProducts",
        data: {
            companyid: that.data.companyid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                goods = res.data.data;
                that.setData({
                    checkboxItems: res.data.data,
                    loadingHidden: true
                })
            }

        }
    });
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkboxItems: [],
        userid: 0,
        loadingHidden: true
    },
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '选择规格'
        })
        var that = this;
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;

        that.setData({
            companyid: companyid,
            employeeid: employeeid,
            userid: userid
        })
        getspeclist(that);
    },
    onShow: function () {
    },
    /*多选规格事件*/
    checkboxChange: function (e) {
        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (i == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }
        this.setData({
            checkboxItems: checkboxItems
        });
    },
    /**
* 点击进入添加主营产品
*/
    add_mymain: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
        wx.navigateTo({
            url: '../' + url,
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
    /*搜索规格*/
    searchgoods: function (e) {
        var val = e.detail.value;
        var newData = this.arrayGetContains(goods, val);
        this.setData({
            checkboxItems: newData
        })
    },
    /*查找数组中是否包含搜索的字符串*/
    arrayGetContains: function (dataArray, str) {
        var newData = [];
        if (str != '') {
            for (var i = 0; i < dataArray.length; i++) {
                var flag = 0;
                for (var item in dataArray[i]) {
                    if (dataArray[i][item].indexOf(str) > -1) {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    newData.push(dataArray[i]);
                }
            }
            return newData;
        } else {
            return dataArray;
        }
    },
    /*选择规格后提交给发布页面*/
    getspecSubmit: function (e) {
        var specids = e.detail.value;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        for (var i = 0; i < specids['specid'].length; i++) {
            var spec_xia = specids['specid'][i];
            var spec_item = this.data.checkboxItems[spec_xia];
            prevPage.data.speclist.push(spec_item);
        }
        prevPage.setData({
            speclist: prevPage.data.speclist
        })
        wx.navigateBack({
            delta: 1
        });
    },
    getIndexNum: function (e) {
        var indexnum = config.getDataSet(e, "index");
        var value = e.detail.value;
        var checkboxItems = this.data.checkboxItems;
        checkboxItems[indexnum]['num'] = value;
        this.setData({
            checkboxItems: checkboxItems
        })
    },
    cancelfunc: function (e) {
        return;
    }
})
// pages/com-picture/com-picture.js
import { Config } from '../../utils/config.js';
var config = new Config();
var util = require('../../utils/util.js');
var app = getApp();
var userid = 0;
// 分页获取搜索内容
var p = 0;
var s_pagecount = 1;
var formlistdata = [];
var url = Config.baseUrl + 'Company/getCompanyAllPics';
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
/*图片上传*/
var uploadimage = function (that) {
    var files = that.data.files;
    var flag = true;
    for (var i = 0; i < files.length; i++) {
        wx.uploadFile({
            url: Config.baseUrl + 'Company/addCompanyPics', //仅为示例，非真实的接口地址
            filePath: files[i],
            name: 'file',
            formData: {
                'userid': that.data.companyid,
                'companyid': that.data.companyid
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                var res_data = JSON.parse(res.data);
                wx.hideLoading();
                if (res_data.result) {
                    flag = true;
                    p = 0;
                    that.setData({
                        list: [],
                    });
                    GetList(that)
                } else {
                    flag = false;
                }
            }
        })
    }//for循环结束
    if (flag) {
        wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success: function () {
            
            }
        })
    } else {
        wx.showModal({
            content: "图片上传失败",
            showCancel: false,
            confirmText: "确定"
        })
        return;
    }
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        loadingHidden: true,
        files: [],
        baseurl: Config.imgUrl,
    
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '精选图片'
        })

        var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        this.setData({
            companyid: companyid,
            userid: userid,
        })
        //分页获取图片
        p = 0;
        GetList(this);
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
    /**选择图片 */
    chooseImage: function () {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log(res);
                that.setData({
                    files: res.tempFilePaths,
                })
                uploadimage(that);
            }
        })
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
        var picid = config.getDataSet(e, 'picid');
        var url = Config.baseUrl + 'Company/deleteCompanyPicsById';
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定这样操作嘛 ?',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: url,
                        data: { picid: picid },
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
    /*图片预览*/
    Imageappear: function (e) {
        var arr = [];
        for (var i = 0; i < this.data.list.length; i++) {
            arr[i] = this.data.baseurl + this.data.list[i].picture;
        }
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接  
            urls: arr // 需要预览的图片http链接列表  
        })
    }

})
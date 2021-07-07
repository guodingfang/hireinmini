// pages/mytask_amend/mytask_amend.js
'use strict';
import { Config } from '../../utils/config.js';
var config = new Config();
/*执行反馈数据填充*/
var spotcompleted = function (orderid, stepid, that) {
    wx.request({
        url: Config.baseUrl + "Lease/spotcompleted",
        data: {
            orderid: orderid,
            stepid: stepid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            that.setData({
                orderinfo: res.data.orderinfo,
                detailinfo: res.data.specinfo,
                pics: res.data.thirdpics
            })
        }
    });
}
/*执行反馈未读标记*/
var updatereadbj = function (orderid, stepid, userid, that) {
    wx.request({
        url: Config.baseUrl + "Lease/thirdupdatereadbj",
        data: {
            orderid: orderid,
            stepid: stepid,
            userid: userid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {

        }
    });
}
/*执行反馈备注提交*/
var spotCompletedCommit = function (data, that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Lease/thirdspotcompleted_bgo",
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                if (that.data.files.length == 0) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "发布成功",
                        icon: 'success',
                        duration: 2000,
                        success: function (e) {
                            config.permission('mytask/mytask', function () {
                                wx.redirectTo({
                                    url: "../mytask/mytask"
                                })
                            })
                        }
                    })
                } else {
                    uploadFiles(that, that.data.orderid, that.data.stepid, res.data.id);
                }
            }
        }
    });
}
/*图片上传*/
var uploadFiles = function (that, orderid, stepid, id) {
    var files = that.data.files;
    var flag = true;
    var picbj = 0;

    function wxuploadpic() {
        wx.uploadFile({
            url: Config.baseUrl + 'Lease/thirdspotCompleteSavePic',
            filePath: files[picbj],
            name: 'file',
            formData: {
                'orderid': orderid,
                'stepid': stepid,
                'id': id
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                picbj = picbj + 1;
                var res_data = JSON.parse(res.data);
                if (res_data.result) {
                } else {
                    flag = false;
                }
                if (picbj < files.length) {
                    wxuploadpic();
                }
            }
        })
    }//for循环结束
    wxuploadpic();
    if (flag) {
        wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                config.permission('mytask/mytask', function () {
                    wx.redirectTo({
                        url: "../mytask/mytask"
                    })
                })
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
        files: [],
        picfiles: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '第三方执行反馈'
        })
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;
        
        this.setData({
            stepid: options.stepid,
            orderid: options.orderid,
            imgurl: Config.imgUrl,
            employeeid: employeeid,
            userid: userid
        })
        updatereadbj(this.data.orderid, this.data.stepid, this.data.userid, this);
        spotcompleted(options.orderid, options.stepid, this);
    },
    /*选择图片*/
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: 4, //最多选择几张图片
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var overall = res.tempFilePaths.length + that.data.files.length;
                if (overall > 4) {
                    res.tempFilePaths.splice(4 - that.data.files.length - 1, res.tempFilePaths.length - (4 - that.data.files.length))
                }
                var overalls = res.tempFilePaths.length + that.data.files.length;
                if (overalls >= 4) {
                    that.setData({
                        hide: true
                    })
                }
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });

            }
        })
    },
    /*图片预览填充*/
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览l图片http链接列表
        })
    },
    /*图片删除*/
    fechar: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var file = that.data.files;
        file.splice(key, 1)
        that.setData({
            files: file
        })

        if (that.data.files.length < 4) {
            that.setData({
                hide: false
            })
        }
    },
    /*反馈提交*/
    goodssubmit: function (e) {
        var data = {};
        data = e.detail.value;
        data['orderid'] = this.data.orderid;
        data['stepid'] = this.data.stepid;
        spotCompletedCommit(data, this);
    }
})
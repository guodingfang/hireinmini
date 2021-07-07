// pages/add_bill/add_bill.js
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var userid;
/**
 * 获取详
 */
var getInfo = function (that, options) {
    wx.request({
        url: Config.baseUrl + 'Advert/getBillInfo',
        data: options,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            if (data.data.piclist.length == 3){
                that.setData({
                    hide: true
                })
            }
            that.setData({
                id: data.data.id,
                topic: data.data.topic,
                startDate: data.data.startdate,
                endDate: data.data.enddate,
                cityname: data.data.cityname,
                citycode: data.data.citycode,
                address: data.data.address,
                cost: data.data.cost,
                linkman: data.data.contact,
                phone: data.data.contactphone,
                comments: data.data.comments,
                files: data.data.piclist,
            })
        }
    })
}

/*修改的图片删除接口*/
var deleteOrderMsgPicture = function (that, id, key) {
    wx.request({
        url: Config.baseUrl + "Advert/deleteAdvertPicture",
        data: {
            id: id
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                that.data.files.splice(key, 1);
                that.setData({
                    files: that.data.files
                })
                if (that.data.files.length < 3) {
                    that.setData({
                        hide: false
                    })
                }
            }
        }
    });
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        topic: '',
        startDate: '',
        endDate: '',
        cityname: '',
        citycode: '',
        address: '',
        cost: '',
        linkman: '',
        phone: '',
        comments: '',
        files: [],
        hide: false,
        imgurl: Config.imgUrl,
        loadingHidden: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '发单'
        })
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        //默认值
        this.setData({
            citycode: wx.getStorageSync('cityinfo').citycode,
            cityname: wx.getStorageSync('cityinfo').cityname,
            linkman: wx.getStorageSync('userinfo').nickname,
            phone: wx.getStorageSync('userinfo').phone,
            imgurl: Config.imgUrl,
        })
        //获取详情根据id
        if (options.id != '' && options.id != undefined) {
            getInfo(this, options);
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
 
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
   * 起始日期选择
   */
    startDateChange: function (e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    /**
     * 截止日期选择
     */
    endDateChange: function (e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    /**
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var recontactphone = /^[1][123457890][0-9]{9}$/;//手机号
        var content = e.detail.value;
        content.userid = userid;
        if (content.id == '') {
            var url = Config.baseUrl + 'Advert/addBill';
        } else {
            var url = Config.baseUrl + 'Advert/editBill';
        }
        var topic = content.topic;
        if (topic == '') {
            config.modaljy("请输入主题");
            return;
        }
        var startdate = content.startdate;
        if (startdate == '') {
            config.modaljy("请选择开始时间");
            return;
        }
        var enddate = content.enddate;
        if (enddate == '') {
            config.modaljy("请选择结束时间");
            return;
        }
        if (enddate < startdate) {
            config.modaljy("结束时间不能小于开始时间");
            return;
        }
        var cityname = content.cityname;
        if (cityname == '') {
            config.modaljy("请选择城市");
            return;
        }
        var citycode = content.citycode;
        if (citycode == '') {
            config.modaljy("城市选择错误");
            return;
        }
        var address = content.address;
        if (address == '') {
            config.modaljy("请输入地点");
            return;
        }
        var contact = content.contact;
        if (contact == '') {
            config.modaljy("请输入联系人");
            return;
        }
        var contactphone = content.contactphone;
        if (!recontactphone.test(contactphone)) {
            config.modaljy("请输入正确的联系电话");
            return;
        }
        var that = this;
        that.setData({
            loadingHidden: false,
        })
        // 提交
        SubmitData(that, url, content);
    },

    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var that = this;
        var imgnum = 3;
        var num = imgnum - that.data.files.length;
        wx.chooseImage({
            // sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: num, //最多选择几张图片
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var overall = res.tempFilePaths.length + that.data.files.length;
                if (overall > imgnum) {
                    res.tempFilePaths.splice(imgnum - that.data.files.length - 1, res.tempFilePaths.length - (imgnum - that.data.files.length))
                }
                var overalls = res.tempFilePaths.length + that.data.files.length;
                if (overalls >= imgnum) {
                    that.setData({
                        hide: true
                    })
                }
                /*重新组装图片格式*/
                var picfile_temp = that.data.files;
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    var tempic = {};
                    tempic['id'] = 0;
                    tempic['pictype'] = 1;
                    tempic['picfilename'] = res.tempFilePaths[i];
                    tempic['thumbsname'] = res.tempFilePaths[i];
                    picfile_temp.push(tempic);
                }
                that.setData({
                    files: picfile_temp
                });
            }
        })
    },

    /**
     * 浏览图片
     */
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览l图片http链接列表
        })
    },

    /**
     * 移除图片
     */
    fechar: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var picid = config.getDataSet(e, "picid");//修改时填充的图片id，如果新上传的为0；
        var pictype = config.getDataSet(e, "pictype");//值为1是新上传的，值为0是修改填充的
        var file = that.data.files;
        if (pictype == 1) {
            file.splice(key, 1)
            that.setData({
                files: file
            })
            if (that.data.files.length < 4) {
                that.setData({
                    hide: false
                })
            }
        } else {
            deleteOrderMsgPicture(that, picid, key);
        }
    },

    /**
     * 清空联系人及联系电话
     */
    delTextFunc: function (e) {
        config.delTextFunc(e, "type", this);
    }
})

/*图片上传*/
var uploadFiles = function (that, adid) {
    var files = that.data.files;
    var flag = true;
    /*只上传pictype=1的，等于0的是修改填充的图片*/
    var fullpicfile = [];
    for (var j = 0; j < files.length; j++) {
        if (files[j]['pictype'] == 1) {
            fullpicfile.push(files[j]['picfilename']);
        }
    }
    for (var i = 0; i < fullpicfile.length; i++) {
        wx.uploadFile({
            url: Config.baseUrl + 'Advert/saveAdvImg',
            filePath: fullpicfile[i],
            name: 'file',
            formData: {
                'adid': adid,
                'userid': userid,
                'adtypeid': 1,
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                var res_data = JSON.parse(res.data);
                wx.hideLoading();
                if (res_data.result) {
                } else {
                    flag = false;
                }
            }
        })
    }//for循环结束
    that.setData({
        loadingHidden: true,
    })
    if (flag) {
        wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                config.permission('mylease/mylease', function () {
                wx.redirectTo({
                    url: "../mylease/mylease"
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

/**
 * 提交
 */
function SubmitData (that, url, content) {
    wx.request({
        url: url,
        data: content,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.result == true) {
                if (that.data.files.length == 0) {
                    that.setData({
                        loadingHidden: true,
                    })
                    wx.showToast({
                        title: "发布成功",
                        icon: 'success',
                        duration: 2000,
                        success: function (e) {
                            config.permission('mylease/mylease', function () {
                            wx.redirectTo({
                                url: "../mylease/mylease"
                            })
                            })
                        }
                    })
                } else {
                    if (content.id == '') {
                        var adid = res.data.pk;
                    } else {
                        var adid = content.id;
                    }
                    uploadFiles(that, adid);
                }
            }
        }
    })
}
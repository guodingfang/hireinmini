// pages/add-product/add-product.js
var statusArrs = [false];
import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
/**
 * 获取详情
 */
var getInfo = function (that, options) {
    wx.request({
        url: Config.baseUrl + 'Company/getProductInfo',
        data: options,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (data) {
            that.setData({
                prodname: data.data.prodname,
                proddescription: data.data.proddescription,
                prodimage: data.data.prodimage,
                prodid: data.data.prodid,
				files:data.data.pics
            })
        }
    })
};
/*修改的图片删除接口*/
var deleteOrderMsgPicture = function (that, id, key) {
    wx.request({
        url: Config.baseUrl + "Company/delPictureById",
        data: {
           prodid: id
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
                if (that.data.files.length < 4) {
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
        prodname: '',
        proddescription: '',
        prodimage: '',
        loadingHidden: true,
        baseurl: Config.imgUrl,
	    files:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.prodid > 0) {
            wx.setNavigationBarTitle({
                title: '修改公司产品'
            })
            this.setData({
                prodid: options.prodid,
            })
        } else {
            wx.setNavigationBarTitle({
                title: '增加公司产品'
            })
            this.setData({
                prodid: 0,
            })
        }
        if (options.prodid > 0) {
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
    /*图片预览填充*/
    previewImage: function (e) {
        var prevfiles = this.data.files;
        var prevArray = [];
        for(var i=0;i<prevfiles.length;i++){
            prevArray.push(prevfiles[i]['picfilename']);
        }
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: prevArray // 需要预览l图片http链接列表
        })
    },
	  /*图片删除*/
    fechar: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var picid = config.getDataSet(e, "picid");//修改时填充的图片id，如果新上传的为0；
        var pictype = config.getDataSet(e, "pictype");//值为1是新上传的，值为0是修改填充的
        var file = that.data.files;
        if(pictype == 1){
            file.splice(key, 1)
            that.setData({
                files: file
            })
            if (that.data.files.length < 4) {
                that.setData({
                    hide: false
                })
            }
        }else{
            deleteOrderMsgPicture(that,picid,key);
        }    
    },
    /**
     * 数据验证及提交
     */
    formSubmit: function (e) {
        var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
        var employeeid = wx.getStorageSync('userinfo').employeeid ? wx.getStorageSync('userinfo').employeeid : 0;
        if (this.data.prodid == 0) {
            var url = Config.baseUrl + 'Company/addCompanyProduct';
        } else {
            var url = Config.baseUrl + 'Company/editCompanyProduct';
        }
        var prodname = e.detail.value.prodname;
        if (prodname == '') {
            config.modaljy("输入产品名称");
            return;
        }
        var proddescription = e.detail.value.proddescription;
        if (proddescription == '') {
            config.modaljy("请输入产品描述");
            return;
        }
        var that = this;
        that.setData({
            loadingHidden: false,
        })
        e.detail.value.prodid = that.data.prodid;
        e.detail.value.companyid = companyid;     
        wx.request({
            url: url,
            data: e.detail.value,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                if (res.data.result) {
                    /*图片为空*/
                    if(that.data.files.length == 0){
                        config.permission('product-manage/product-manage', function () {
                        wx.redirectTo({
                            url: "../product-manage/product-manage"
                        })
                        })
                    }else{
                        if (that.data.prodid == 0) {
                            uploadFiles(that, res.data.pk);
                        }else{
                            uploadFiles(that, that.data.prodid);
                        }
                    }
                }else{
                    wx.showToast({
                        title: "失败",
                        icon: 'false',
                        duration: 2000
                    })
                }
            }
        })
    },
    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1, //最多选择几张图片
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                /*重新组装图片格式*/
                var picfile_temp = that.data.files;
                for(var i=0;i<res.tempFilePaths.length;i++){
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
})

/*图片上传*/
var uploadFiles = function (that, prodid) {
    var files = that.data.files;
	/*只上传pictype=1的，等于0的是修改填充的图片*/
    var fullpicfile = [];
    for(var j = 0;j < files.length;j++){
        if(files[j]['pictype'] == 1){
            fullpicfile.push(files[j]['picfilename']);
        }
    }
    if (fullpicfile.length != 0) {
        wx.uploadFile({
            url: Config.baseUrl + 'Company/addCompanyProductPicture',
            filePath: fullpicfile[0],
            name: 'file',
            formData: {
                'prodid': prodid,
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                var res_data = JSON.parse(res.data);
                wx.hideLoading();
                if (res_data.result) {
                    that.setData({
                        loadingHidden: true,
                    })
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                            config.permission('product-manage/product-manage', function () {
                            wx.redirectTo({
                                url: "../product-manage/product-manage"
                            })
                            })
                        }
                    })
                } else {
                    wx.showModal({
                        content: "发布失败",
                        showCancel: false,
                        confirmText: "确定"
                    })
                    return;
                }
            }
        })
    } else {
        that.setData({
            loadingHidden: true,
        })
        wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                config.permission('product-manage/product-manage', function () {
                wx.redirectTo({
                    url: "../product-manage/product-manage"
                })
                })
            }
        })
    }
}
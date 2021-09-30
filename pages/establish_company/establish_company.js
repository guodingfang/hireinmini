// pages/establish_company/establish_company.js
import { Config } from '../../utils/config.js';
var util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var userid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cityname: '',
        citycode: '',
        info: [],
        address: '',
        linkman: '',
        phone: '',
        files: [],
        imgfiles: [],
        worklist: [], //主营业务列表
        workjson: [], //已选主营
        CustomWork: '', //自定义主营业务
        filesimg: false, //是否选择
        filesLogo: false, //是否选择
        compamypiclist: [], //修改时后台返回的公司图片列表
        picidstr: '', //修改时删除的原公司图片id
        loadingHidden: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '创建公司'
        })
        var addres = options.addres;
        this.setData({
            cityname: wx.getStorageSync('cityinfo').cityname,
            citycode: wx.getStorageSync('cityinfo').citycode,
            linkman: wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : wx.getStorageSync('userinfo').nickname,
            phone: wx.getStorageSync('userinfo').phone,
            loadingHidden: true,
            addres: addres,
        })
        //用户id
        userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : 0;
        //获取主营业务列表
        getWorkList(this);
        var companyid = options.companyid;
        if (companyid > 0) {
            wx.setNavigationBarTitle({
                title: '修改公司'
            })
            //获取公司详情
            getUserCompanyInfo(this, companyid);
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /*地图选择公司 */
    chooselocation: function () {
        var that = this;
        if (wx.getStorageSync("errlocation") != '' ) {
            config.permission('hint/hint', function () {
            wx.navigateTo({
                url: "../hint/hint",
            })
            })
        } else {
            /*地图获取位置  */
            getlocation(that);
        }
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
     * 提交数据
     */
    formSubmit: function (e) {
        var recontactphone = /^[1][123457890][0-9]{9}$/;//手机号
        var content = e.detail.value;
        content.userid = userid; //用户id
        var picstrlist = this.data.picidstr;
        picstrlist = (picstrlist.substring(picstrlist.length - 1) == ',') ? picstrlist.substring(0, picstrlist.length - 1) : picstrlist;
        content.picidstr = picstrlist;
        if (userid == 0) {
            config.modaljy("参数错误");
            return;
        }
        if (content.companyid == '') {
            var url = Config.baseUrl + 'Company/createCompany';
        } else {
            var url = Config.baseUrl + 'Company/editCompany';
        }
        var companyname = content.companyname;
        if (companyname == '') {
            config.modaljy("请输入公司名称");
            return;
        }
        var contact = content.contact;
        if (contact == '') {
            config.modaljy("请输入联系人");
            return;
        }
        var phone = content.phone;
        if (!recontactphone.test(phone)) {
            config.modaljy("请输入正确的联系电话");
            return;
        }
        var citycode = content.citycode;
        if (citycode == '') {
            config.modaljy("请选择城市");
            return;
        }
        var address = content.address;
        if (address == '') {
            config.modaljy("请输入详细地址");
            return;
        }
        //分隔自定义业务
        var customstr = this.data.CustomWork;
        var workjson = this.data.workjson ? this.data.workjson : [];
        if (customstr != undefined) {
            var customarr = customstr.split(' ');
            var arr = {};
            for (var j = 0; j < customarr.length; j++) {
                var arr1 = { 'labelname': customarr[j], 'labelid': 0 };
                workjson.push(arr1);
            }
            var workjsons = {};
            for (var i = 0; i < workjson.length; i++) {
                workjsons[i] = workjson[i];
            }
            var workjsonstr = JSON.stringify(workjsons);
            content.mainbusiness = workjsonstr;
        } else if (workjson != '' && workjson != undefined) {
            var workjsons = {};
            for (var i = 0; i < workjson.length; i++) {
                workjsons[i] = workjson[i];
            }
            var workjsonstr = JSON.stringify(workjsons);
            content.mainbusiness = workjsonstr;
        }
        var that = this;
        that.setData({
            loadingHidden: false,
        })
        //提交
        dataSubmit(that, url, content);
    },


    /**
     * 选择图片
     */
    chooseImage: function (e) {
        var types = config.getDataSet(e, 'type');
        var that = this;
        if (types == 'logo') {
            var num = 1;
            var imgtype = false;
        } else if (types == 'img') {
            var imgnum = 4;
            var num = imgnum - that.data.imgfiles.length;
            var imgtype = true;
        }
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: num, //最多选择几张图片
            success: function (res) {
                if (imgtype) {
                    var overall = res.tempFilePaths.length + that.data.imgfiles.length;
                    if (overall > imgnum) {
                        res.tempFilePaths.splice(imgnum - that.data.imgfiles.length - 1, res.tempFilePaths.length - (imgnum - that.data.imgfiles.length))
                    }
                    var overalls = res.tempFilePaths.length + that.data.imgfiles.length;
                    if (overalls >= imgnum) {
                        that.setData({
                            imghide: true
                        })
                    }
                    that.setData({
                        imgfiles: that.data.imgfiles.concat(res.tempFilePaths),
                        filesimg: true,
                    });
                } else {
                    that.setData({
                        logohide: true,
                        files: res.tempFilePaths,
                        filesLogo: true,
                    })
                }
            }
        })
    },

    /**
     * 浏览图片
     */
    previewImage: function (e) {
        var types = config.getDataSet(e, 'type');
        if (types == 'logo') {
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.data.files // 需要预览l图片http链接列表
            })
        } else if (types == 'img') {
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.data.imgfiles // 需要预览l图片http链接列表
            })
        }

    },

    /**
     * 移除图片
     */
    fechar: function (e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var types = config.getDataSet(e, 'type');
        if (types == 'logo') {
            var file = that.data.files;
            file.splice(key, 1)
            that.setData({
                files: file
            })
            if (that.data.files.length < 1) {
                that.setData({
                    logohide: false
                })
            }
        } else if (types == 'img') {
            var file = that.data.imgfiles;
            var imgurl = Config.imgUrl;
            var compamypiclist = that.data.compamypiclist;
            var picidstr = that.data.picidstr;
            if (compamypiclist) {
                var newimgurl = file[key].substring(0, 37);
                var newimg = file[key].substring(37);
                if (newimgurl == imgurl) {
                    for (var j = 0; j < compamypiclist.length; j++) {
                        console.info(compamypiclist[j]['picfilename']);
                        if (newimg == compamypiclist[j]['picfilename']) {
                            picidstr += compamypiclist[j]['picid'] + ',';
                        }
                    }
                }
            }
            file.splice(key, 1);
            console.info(picidstr);
            that.setData({
                imgfiles: file,
                picidstr: picidstr,
            })

            if (that.data.imgfiles.length < 4) {
                that.setData({
                    imghide: false
                })
            }
        }
    },

    /**
     * 选择主营业务
     */
    workclick: function (e) {
        var id = config.getDataSet(e, 'id');
        var index = config.getDataSet(e, 'index');
        var labelname = config.getDataSet(e, 'labelname');
        var datalist = this.data.worklist;
        var opt = datalist[index]['opt'];
        var jsonstr = [];
        var workjson = this.data.workjson;
        if (workjson) {
            for (var i = 0; i < workjson.length; i++) {
                jsonstr.push(workjson[i]);
            }
        }
        if (opt == 0) {
            datalist[index]['opt'] = 1;
            var arr = { 'labelname': datalist[index]['labelname'], 'labelid': datalist[index]['id'] }
            jsonstr.push(arr),
                this.setData({
                    workjson: jsonstr,
                })
        } else {
            datalist[index]['opt'] = 0;
            for (var i = 0; i < jsonstr.length; i++) {
                var labelid = jsonstr[i]['labelid'];
                if (labelid == id) {
                    jsonstr.splice(i, 1);
                    this.setData({
                        workjson: jsonstr,
                    })
                }
            }
        }
        this.setData({
            worklist: datalist,
        })
    },

    /**
     * 获取自定义主营业务
     */
    getCustom: function (e) {
        var customstr = e.detail.value;
        this.setData({
            CustomWork: customstr,
        })
    }
})

/**
 * 提交
 */
function dataSubmit(that, url, content) {
    wx.request({
        url: url,
        data: content,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            if (res.data.result == true) {
                wx.removeStorageSync('userinfo');
                if (content.companyid == '') {
                    var companyid = res.data.companyid;
                    var employeeid = res.data.employeeid;
                } else {
                    var companyid = content.companyid;
                    var employeeid = wx.getStorageSync('userinfo').employeeid;
                }
                if (that.data.filesLogo == false && that.data.filesimg == false) {
                    that.setData({
                        loadingHidden: true,
                    })
                    wx.showToast({
                        title: '提交成功',
                        duration: 2000,
                        success: function () {
                            if (content.companyid > 0) {
                                wx.navigateBack({
                                    delta: 1,
                                })
                            } else {
                                // config.permission('companydetails/companydetails', function () {
                                wx.redirectTo({
                                    url: "../companydetails/companydetails?typeid=1&companyid=" + companyid,
                                })
                                // })
                            }
                        }
                    })
                } else {
                    if (that.data.filesLogo == true && that.data.filesimg == true) {
                        uploadLogoFiles(that, companyid, function () {
                            uploadImgFiles(that, companyid, employeeid, function () {
                                that.setData({
                                    loadingHidden: true,
                                })
                                wx.showToast({
                                    title: '发布成功',
                                    icon: 'success',
                                    duration: 2000,
                                    success: function () {
                                        if (content.companyid == '') {
                                            config.permission('companydetails/companydetails', function () {
                                            wx.redirectTo({
                                                url: "../companydetails/companydetails?typeid=1&companyid=" + companyid,
                                            })
                                            })
                                        } else {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                })
                            });
                        });
                    } else if (that.data.files.length > 0 && that.data.filesLogo == true) {
                        uploadLogoFiles(that, companyid, function () {
                            that.setData({
                                loadingHidden: true,
                            })
                            wx.showToast({
                                title: '发布成功',
                                icon: 'success',
                                duration: 2000,
                                success: function () {
                                    if (content.companyid == '') {
                                        config.permission('companydetails/companydetails', function () {
                                        wx.redirectTo({
                                            url: "../companydetails/companydetails?typeid=1&companyid=" + companyid,
                                        })
                                        })
                                    } else {
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    }
                                }
                            })
                        });
                    } else if (that.data.filesimg == true) {
                        uploadImgFiles(that, companyid, employeeid, function () {
                            that.setData({
                                loadingHidden: true,
                            })
                            wx.showToast({
                                title: '发布成功',
                                icon: 'success',
                                duration: 2000,
                                success: function () {
                                    if (content.companyid == '') {
                                        config.permission('companydetails/companydetails', function () {
                                        wx.redirectTo({
                                            url: "../companydetails/companydetails?typeid=1&companyid=" + companyid,
                                        })
                                        })
                                    } else {
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                    }
                                }
                            })
                        });
                    }
                }
            }else {
                config.modaljy(res.data.msg);
                that.setData({
                    loadingHidden: true
                })
            }
        }
    })
}

/**
 * 获取公司基本信息
 */
function getUserCompanyInfo(that) {
    var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 1;
    wx.request({
        url: Config.baseUrl + 'Company/getCompanyInfo',
        data: { id: companyid, userid: userid },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            var imglist = res.data.compamypiclist;
            var imgs = [];
            for (var i = 0; i < imglist.length; i++) {
                imgs[i] = Config.imgUrl + imglist[i]['picfilename'];
            }
            if (imglist.length >= 4) {
                that.setData({
                    imghide: true,
                })
            }
            var logo = [];
            if (res.data.logopic != '') {
                logo[0] = Config.imgUrl + res.data.logopic;
                that.setData({
                    logohide: true,
                })
            }
            var worklist = that.data.worklist;
            var mainbusiness = res.data.mainbusiness;
            if (mainbusiness.syslabel != undefined || mainbusiness.userdefined != undefined) {
                var newwork = mainbusiness.syslabel;
                if (newwork != undefined) {
                    for (var i = 0; i < worklist.length; i++) {
                        for (var j = 0; j < newwork.length; j++) {
                            if (worklist[i]['id'] == newwork[j]['labelid']) {
                                worklist[i]['opt'] = 1;
                            }
                        }
                    }
                }
                var userde = mainbusiness.userdefined
                if (userde != undefined) {
                    var CustomWork = '';
                    for (var a = 0; a < userde.length; a++) {
                        CustomWork += userde[a]['labelname'] + ' ';
                    }
                }
            }
            that.setData({
                info: res.data,
                address: res.data.address,
                imgfiles: imgs,
                files: logo,
                linkman: res.data.contact,
                phone: res.data.phone,
                cityname: res.data.cityname,
                citycode: res.data.citycode,
                worklist: worklist,
                CustomWork: CustomWork,
                workjson: newwork,
                compamypiclist: imglist,
                loadingHidden: true,
            })
        }
    })
}

/*图片上传*/
var uploadLogoFiles = function (that, companyid, callback) {
    var files = that.data.files;
    var flag = true;
    for (var i = 0; i < files.length; i++) {
        wx.uploadFile({
            url: Config.baseUrl + 'Company/addCompanyLogoPicture',
            filePath: files[i],
            name: 'file',
            formData: {
                'companyid': companyid,
            },
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            success: function (res) {
                var res_data = JSON.parse(res.data);
                wx.hideLoading();
                if (res_data.result) {
                    callback();
                } else {
                    wx.showModal({
                        content: "图片上传失败",
                        showCancel: false,
                        confirmText: "确定"
                    })
                    return;
                }
            }
        })
    }
}

/*图片上传*/
var uploadImgFiles = function (that, companyid, employeeid, callback) {
    var files = that.data.imgfiles;
    var flag = true;
    for (var i = 0; i < files.length; i++) {
        wx.uploadFile({
            url: Config.baseUrl + 'Company/addCompanyPicture',
            filePath: files[i],
            name: 'file',
            formData: {
                'companyid': companyid,
                'employeeid': employeeid,
                'userid': userid,
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
    }
    if (flag) {
        callback();
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
 * 获取主营业务列表
 */
function getWorkList(taht) {
    wx.request({
        url: Config.baseUrl + 'Company/getMainBusinessLabel',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        success: function (res) {
            taht.setData({
                worklist: res.data,
            })
        }
    })
}

/*  地图获取位置 */
function getlocation(that) {
    //获取当前位置
    wx.getLocation({
        success: function (res) {
            wx.chooseLocation({
                success: function (res) {
                    that.setData({
                        address: res.address,
                    })

                },

            })
        },
        fail: function (res) {
            wx.setStorageSync('errlocation', res.errMsg)
        }
    })
}

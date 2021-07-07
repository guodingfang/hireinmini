import {
    Config
} from '../../utils/config.js';
import emoji from '../../utils/emoji';
var login = require('../../template/login.js');
var config = new Config();
var app = getApp();
Page({
    data: {
        pageshow: 1,
        files: [], //存放图片的数组
        videoFiles: [], //存放视频的数组
        hide: false, //上传图片按钮的显示和隐藏
        videohide: false, //上传视频按钮的显示和隐藏
        imgurl: Config.imgUrl,
        imgurls: Config.imgUrls,
        contacterFocus: false, // false是联系人无值
        phoneFocus: false, //false是手机号错误的情况
        portFocus: true, //true表示货源地有值,
        width: 0,
        height: 0,
        videotime: 0,
        verification: "获取验证码",
        userid: 0, //用户id
        contacter: '', //联系人
        contactphone: '', //手机号
        cityname: '', //城市
        citycode: '', //城市code
        logourl: '',  //logo图片地址
        canGetUserProfile: false,  //使用getUserProfile取用户信息
    },
    onLoad: function(options) {
        var that = this;
        login.init.apply(that, []);// this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块
        var msgid = options.msgid || '';
        wx.setNavigationBarTitle({
            title: '发布'
        })
        that.setData({
            msgid: msgid
        })
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userinfo = wx.getStorageSync('userinfo');
            if (userinfo.code > 0) {
                that.setData({
                    pageshow: 0,
                    userinfo: userinfo,
                })
                app.getWxCode();
            } else {
                app.judgeLogoNBrace(function () {
                    var userid = userinfo ? userinfo.userid : 0;
                    that.setData({
                        userid: userid,
                        contacter: userinfo.nickname,
                        contactphone: userinfo.phone,
                        msgid: that.data.msgid,
                        cityname: wx.getStorageSync('cityinfo').cityname,
                        citycode: wx.getStorageSync('cityinfo').citycode
                    })
                    if (that.data.msgid > 0) {
                        getMes(that);
                    }
                })
            }
        })
        if (wx.getUserProfile){
            this.setData({
                canGetUserProfile: true,
            });
        }
        that.getLogoUrl();
    },
    onShow: function(){
        var that = this;
        // 判断用户登录信息是否缓存
        config.userLogin(function () {
            var userinfo = wx.getStorageSync('userinfo');
            if (userinfo.code > 0) {
                that.setData({
                    pageshow: 0,
                    userinfo: userinfo,
                })
            } else if (that.data.switchover != true && !that.data.msgid > 0){
                app.judgeLogoNBrace(function () {
                    var userid = userinfo ? userinfo.userid : 0;
                    that.setData({
                        userid: userid,
                        contacter: userinfo.nickname,
                        contactphone: userinfo.phone,
                        cityname: wx.getStorageSync('cityinfo').cityname,
                        citycode: wx.getStorageSync('cityinfo').citycode
                    })
                })
            }
        })
    },
    /**
     * 选择图片
     */
    chooseImage: function(e) {
        var that = this;
        var imgnum = 6;
        var num = imgnum - that.data.files.length;
        wx.chooseImage({
            count: 6, //最多选择几张图片
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var overall = res.tempFilePaths.length + that.data.files.length;
                if (overall > 6) {
                    res.tempFilePaths.splice(6 - that.data.files.length - 1, res.tempFilePaths.length - (6 - that.data.files.length))
                }
                var overalls = res.tempFilePaths.length + that.data.files.length;
                if (overalls >= 6) {
                    that.setData({
                        hide: true
                    })
                }
                /*重新组装图片格式*/
                var picfile_temp = that.data.files;
                for (var i = 0; i < res.tempFilePaths.length; i++) {
                    var tempic = {};
                    tempic['picid'] = 0;
                    tempic['pictype'] = 1;
                    tempic['picfilename'] = res.tempFilePaths[i];
                    tempic['picurl_thumbnails'] = res.tempFilePaths[i];
                    picfile_temp.push(tempic);
                }
                that.setData({
                    files: picfile_temp
                });
                /*判断图片和视频按钮的显示和隐藏*/
                videoImgshow(that);
            }
        })
    },
    /*图片预览*/
    previewImage: function(e) {
        var that = this;
        var prevfiles = this.data.files;
        var pictype = config.getDataSet(e, "pictype");
        var prevArray = [];
        for (var i = 0; i < prevfiles.length; i++) {
            if (pictype == 0) {
                prevArray.push(that.data.imgurl + prevfiles[i]['picfilename']);
            } else {
                prevArray.push(prevfiles[i]['picfilename']);
            }

        }
        var currentImg = config.getDataSet(e, "id");
        wx.previewImage({
            current: currentImg, // 当前显示图片的http链接
            urls: prevArray // 需要预览l图片http链接列表
        })
    },
    /*图片删除*/
    delpic: function(e) {
        var that = this;
        var key = e.currentTarget.dataset.key;
        var picid = config.getDataSet(e, "picid"); //修改时填充的图片id，如果新上传的为0；
        var pictype = config.getDataSet(e, "pictype"); //值为1是新上传的，值为0是修改填充的
        var file = that.data.files;
        if (pictype == 1) {
            file.splice(key, 1)
            that.setData({
                files: file
            })
            /*判断图片和视频按钮的显示和隐藏*/
            videoImgshow(that);
        } else {
            deleteMsgPicture(that, picid, key);
        }
    },
    /*获取城市*/
    getPortid: function(e) {
        wx.navigateTo({
            url: '../citylist/citylist?rurl=release'
        })
    },
    /*选择视频*/
    chooseVideos: function(e) {
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function(res) {
                if ((res.size / (1024 * 1024)).toFixed(2) > 20) {
                    wx.showModal({
                        title: '提醒',
                        content: '很抱歉，视频最大允许20M，当前为' + ((res.size / (1024 * 1024)).toFixed(2)) + 'M'
                    })
                    return false;
                }
                var picfile_temp = that.data.videoFiles;
                var tempvideo = {};
                tempvideo['picid'] = 0;
                tempvideo['pictype'] = 1;
                tempvideo['videoname'] = res.tempFilePath;
                tempvideo['videopic'] = res.thumbTempFilePath;
                tempvideo['width'] = res.width;
                tempvideo['duration'] = res.duration;
                tempvideo['height'] = res.height;
                tempvideo['size'] = (res.size / (1024 * 1024)).toFixed(2);
                picfile_temp.push(tempvideo);
                that.setData({
                    videoFiles: picfile_temp
                })
                /*判断图片和视频按钮的显示和隐藏*/
                videoImgshow(that);
            }
        })
    },
    /*发布新增*/
    goodssubmit: function(e) {
        var commit_param = e.detail.value;
        var recontactphone = /^[1][3456789][0-9]{9}$/;
        var that = this;
        commit_param['userid'] = that.data.userid;
        commit_param['picsign'] = '';
        if (commit_param.content == '') {
            config.modaljy("请输入发布内容");
            return;
        }
        if (commit_param.contacter == '') {
            that.setData({
                contacterFocus: true
            })
            config.modaljy("请输入联系人");
            return;
        } else {
            that.setData({
                contacterFocus: false
            })
        }
        if (commit_param.contactphone == '') {
            that.setData({
                phoneFocus: true
            })
            config.modaljy("请输入手机号");
            return;
        } else if (commit_param.contactphone != '') {
            if (!recontactphone.test(commit_param.contactphone)) {
                that.setData({
                    phoneFocus: true
                })
                config.modaljy("请输入正确的手机号");
                return;
            }
        } else {
            that.setData({
                phoneFocus: false
            })
        }
        if (commit_param.citycode == '') {
            that.setData({
                portFocus: false
            })
            config.modaljy("请选择城市");
            return;
        } else {
            that.setData({
                portFocus: true
            })
        }

        addRelease(that, commit_param);
    },
    /**
     * 联系人input事件
     */
    getCorrectContacter: function(e) {
        var that = this;
        if (e.detail.value != '') {
            that.setData({
                contacterFocus: false
            })
        } else {
            that.setData({
                contacterFocus: true
            })
        }
    },
    /*口岸input事件*/
    getCorrectPort: function (e) {
        getMsgReleaseDetail
        var that = this;
        if (e.detail.value > 0) {
            that.setData({
                portFocus: false
            })
        } else {
            that.setData({
                portFocus: true
            })
        }
    },
    /*手机input事件*/
    getCorrectPhone: function(e) {
        var recontactphone = /^[1][3456789][0-9]{9}$/;
        var that = this;
        if (recontactphone.test(e.detail.value)) {
            that.setData({
                phoneFocus: false
            })
        } else {
            that.setData({
                phoneFocus: true
            })
        }
    },
    /*取系统logo*/
    getLogoUrl: function(e) {
        var that = this;
        wx.request({
            url: Config.baseUrl + "WXAppLogin/getWxMiniLogo",
            data: {
                userid: that.data.userid,
                accesstoken: that.data.accesstoken,
                unionid: that.data.unionid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "post",
            success: function(res) {
                console.log('logo url:',res);
                if (res.data.logo.length>0) {
                    that.setData({
                        logourl: Config.imgUrl + res.data.logo
                    })
                }
            }
        })
    },
})

/*新增发布内容提交*/
var addRelease = function(that, commitdata) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    commitdata.content = emoji.decodeEmoji(commitdata.content);
    if (that.data.files.length == 0 && that.data.videoFiles.length > 0) {
        commitdata.picsign = 2;
    } else if (that.data.files.length > 0 && that.data.videoFiles.length == 0) {
        commitdata.picsign = 1;
    }
    wx.request({
        url: Config.baseUrl + "Release/addMsgRelease",
        data: commitdata,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            if (res.data.result) {
                if (that.data.files.length == 0 && that.data.videoFiles.length == 0) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "提交成功",
                        icon: 'success',
                        duration: 2000,
                        success: function(e) {
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2]; //上一个页面
                            prevPage.setData({
                                switchover: true
                            })
                            wx.navigateBack();
                        }
                    })
                } else {
                    var msgid = (commitdata.msgid > 0) ? commitdata.msgid : res.data.pk;
                    if (that.data.files.length == 0 && that.data.videoFiles.length > 0) {
                        //有视频   只上传pictype=1的，等于0的是修改填充的
                        if (that.data.videoFiles[0].pictype == 1) {
                            if (msgid > 0) {
                                uploadVideoFiles(that, msgid);
                            } else {
                                wx.hideLoading();
                                config.modaljy("发布出错，请稍后再试或联系管理员");
                                return;
                            }

                        } else {
                            wx.hideLoading();
                            wx.showToast({
                                title: "提交成功",
                                icon: 'success',
                                duration: 2000,
                                success: function(e) {
                                    var pages = getCurrentPages();
                                    var prevPage = pages[pages.length - 2]; //上一个页面
                                    prevPage.setData({
                                        switchover: true
                                    })
                                    wx.navigateBack();
                                }
                            })
                        }

                    } else if (that.data.files.length > 0 && that.data.videoFiles.length == 0) {
                        //有图片
                        uploadFiles(that, msgid);
                    }

                }
            } else {
                wx.hideLoading();
                config.modaljy(res.data.msg);
                if (res.statusCode != 200) {
                    config.modaljy("发送失败，请稍后重试！或联系管理员");
                    return;
                }
            }
        },
        fail: function(res) {
            wx.hideLoading();
            config.modaljy("发布失败，请稍后重试！");
        }
    });
}

/*图片上传*/
var uploadFiles = function(that, msgid) {
    var files = that.data.files;
    var flag = true;
    /*只上传pictype=1的，等于0的是修改填充的图片*/
    var fullpicfile = [];
    for (var j = 0; j < files.length; j++) {
        if (files[j]['pictype'] == 1) {
            fullpicfile.push(files[j]['picfilename']);
        }
    }
    let arr = fullpicfile.map(
        (value, index) => {
            return new Promise(
                (resolve, reject) => {
                    wx.uploadFile({
                        url: Config.baseUrl + 'Release/addMsgPicture',
                        filePath: fullpicfile[index],
                        name: 'file',
                        formData: {
                            'msgid': msgid,
                            'width': 0,
                            'height': 0,
                            'videotime': 0,
                            'imgsign': 0
                        },
                        header: {
                            'content-type': 'multipart/form-data'
                        }, // 设置请求的 header
                        success: function(res) {
                            if (res.statusCode == 200) {
                                resolve(res);
                            } else {
                                reject('图片下载失败！');
                            }
                        },
                        fail: function(res) {
                            wx.hideLoading();
                            config.modaljy("图片上传失败，请稍后重试！");
                        }
                    })
                }
            )
        }
    )
    Promise.all(arr).then(res => {
        let failFlag = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].statusCode == 200) {} else {
                failFlag = true;
            }
        }
        if (!failFlag) {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 3000,
                success: function() {
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2]; //上一个页面
                    prevPage.setData({
                        switchover: true
                    })
                    wx.navigateBack();
                }
            })
        } else {
            wx.hideLoading();
            wx.showModal({
                content: "图片上传失败",
                showCancel: false,
                confirmText: "确定"
            })
            return;
        }
    }).catch(err => {
        wx.hideLoading();
        config.modaljy("图片上传失败，请稍后重试！");
    })
}
/*视频上传*/
var uploadVideoFiles = function(that, msgid) {
    var files = that.data.videoFiles;
    var flag = true;
    if (files[0]['size'] > 20) {
        wx.showModal({
            title: '提醒',
            content: '很抱歉，视频最大允许20M，当前为' + (files[0].size) + 'M'
        })
        wx.hideLoading();
        return false;
    }

    wx.uploadFile({
        url: Config.baseUrl + 'Release/addMsgPicture',
        filePath: files[0]['videoname'],
        name: 'file',
        formData: {
            'msgid': msgid,
            'width': files[0].width,
            'height': files[0].height,
            'videotime': files[0].duration,
            'imgsign': 1,
            'userid': that.data.userid,
            'accesstoken': that.data.accesstoken,
            'unionid': that.data.unionid
        },
        header: {
            'content-type': 'multipart/form-data'
        }, // 设置请求的 header
        success: function(res) {
            if (res.statusCode == 200) {
                var result = JSON.parse(res.data);
                /*暂放 start*/
                if (!result['result']) {
                    wx.hideLoading();
                    config.modaljy(result['msg']);
                    return;
                } else {
                    wx.showToast({
                        title: '提交成功',
                        icon: 'success',
                        duration: 3000,
                        success: function() {
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2]; //上一个页面
                            prevPage.setData({
                                switchover: true
                            })
                            wx.navigateBack();
                        }
                    })
                }
                /*暂放 end*/
            } else {
                wx.hideLoading();
                config.modaljy("视频上传失败，请稍后重试！");
            }
        },
        fail: function(res) {
            wx.hideLoading();
            config.modaljy("视频上传失败，请稍后重试！");
        }
    })
}
/*修改的图片删除接口*/
var deleteMsgPicture = function(that, picid, key) {
    wx.request({
        url: Config.baseUrl + "Release/deleteMsgPicture",
        data: {
            userid: that.data.userid,
            accesstoken: that.data.accesstoken,
            unionid: that.data.unionid,
            picid: picid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            if (res.data.result) {
                that.data.files.splice(key, 1);
                that.setData({
                    files: that.data.files
                })
                /*判断图片和视频按钮的显示和隐藏*/
                videoImgshow(that);
            }
        },
        fail: function(res) {
            wx.hideLoading();
            config.modaljy("删除失败，请稍后重试！");
        }
    });
}
/*判断是否显示video按钮和上传图片按钮*/
var videoImgshow = function(that) {
    /*video*/
    if (that.data.videoFiles.length > 0 && that.data.files.length == 0) { //都隐藏
        that.setData({
            videohide: true,
            hide: true
        })
    } else if (that.data.videoFiles.length == 0 && that.data.files.length > 0) {
        if (that.data.files.length < 6) {
            that.setData({
                hide: false,
                videohide: true
            })
        } else {
            that.setData({
                hide: true,
                videohide: true
            })
        }
    } else if (that.data.videoFiles.length == 0 && that.data.files.length == 0) {
        that.setData({
            hide: false,
            videohide: false
        })
    }
}
/*修改获取信息*/
var getMes = function(that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Release/getMsgReleaseDetail",
        data: {
            userid: that.data.userid,
            msgid: that.data.msgid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function(res) {
            wx.hideLoading();
            let hide = false;
            var files = [],
                videoFiles = [];
            if (res.data.info.pics.length == 6) {
                hide = true;
            }
            if (res.data.info.picsign == 1) {
                files = res.data.info.pics;
            } else if (res.data.info.picsign == 2) {
                videoFiles = res.data.info.pics;
            }
            that.setData({
                content: emoji.encodeEmoji(res.data.info.content),
                msgid: res.data.info.msgid,
                contacter: res.data.info.contacter,
                contactphone: res.data.info.contactphone,
                cityname: res.data.info.cityname,
                citycode: res.data.info.citycode,
                files: files,
                videoFiles: videoFiles,
                hide: hide,
                portFocus: true
            })
            /*判断图片和视频按钮的显示和隐藏*/
            videoImgshow(that);
        },
        fail: function(res) {
            wx.hideLoading();
            config.modaljy("请求失败，请稍后重试！");
        }
    });
}
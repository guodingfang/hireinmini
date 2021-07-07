import { Config } from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var app = getApp();

var customerlist = [];//客户名称
var acttype = [];//活动类型
var address = [];//地址
var contactlist = [];//联系人
/*获取客户名称，活动类型，活动地点列表*/
var getspeclist = function (that) {
    wx.request({
        url: Config.baseUrl + "Order/getOrderBaseInfo",
        data: {
            companyid: that.data.companyid,
            userid: that.data.userid,
            employeeid: that.data.employeeid,
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                customerlist = res.data.customer;
                acttype = res.data.acttype;
                address = res.data.address;
                that.setData({
                    customerlist: res.data.customer,
                    acttype: res.data.acttype,
                    address: res.data.address
                })
            }
        }
    });
}
/*根据客户名称获取联系人和联系电话*/
var getcontactlist = function (that, customername) {
    wx.request({
        url: Config.baseUrl + "Customer/getCustomerContacts",
        data: {
            companyid: that.data.companyid,
            userid: that.data.userid,
            employeeid: that.data.employeeid,
            customername: customername
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                that.setData({
                    contname: "",
                    phone: ""
                })
                if (res.data.data.length == 1) {
                    that.setData({
                        contname: res.data.data[0]['contname'],
                        phone: res.data.data[0]['phone']
                    })
                } else {
                    contactlist = res.data.data;
                    that.setData({
                        contactlist: res.data.data
                    })
                }
            }
        }
    });
}
/*修改的图片删除接口*/
var deleteOrderMsgPicture = function (that, orderid, userid, id, key) {
    wx.request({
        url: Config.baseUrl + "Order/deleteOrderMsgPicture",
        data: {
            orderid: orderid,
            userid: userid,
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
                if (that.data.files.length < 4) {
                    that.setData({
                        hide: false
                    })
                }
            }
        }
    });
}
/*下订单最终提交*/
var submitFunc = function (params, that) {
    wx.showLoading({
        title: "正在加载中",
        mask: true
    })
    wx.request({
        url: Config.baseUrl + "Order/addOrder",
        data: params,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                if (that.data.files.length == 0) {
                    wx.hideLoading();
                    wx.showToast({
                        title: "提交成功",
                        icon: 'success',
                        duration: 2000,
                        success: function (e) {
                            var param_orderid = params.orderid;
                            if (param_orderid != "") {
                                config.permission('myorder/myorder', function () {
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                })
                            } else {
                                config.permission('order-under/order-under', function () {
                                    wx.redirectTo({
                                        url: "../order-under/order-under"
                                    })
                                })
                            }
                        }
                    })
                } else {
                    uploadFiles(that, res.data.orderid, params.orderid);
                }
            }
        }
    });
}
/*图片上传*/
var uploadFiles = function (that, orderid, param_orderid) {
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
            url: Config.baseUrl + 'Order/addOrderMsgPicture', //仅为示例，非真实的接口地址
            filePath: fullpicfile[i],
            name: 'file',
            formData: {
                'orderid': orderid,
                'userid': that.data.userid,
                'employeeid': that.data.employeeid,
                'companyid': that.data.companyid
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
    if (flag) {
        wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                if (param_orderid != "") {
                    config.permission('myorder/myorder', function () {
                        wx.navigateBack({
                            delta: 1
                        })
                    })
                }else{
                    config.permission('myorder/myorder', function () {
                        wx.redirectTo({
                            url: "../order-under/order-under"
                        })
                    })
                }
                
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
/*订单修改填充*/
var orderedit = function (that, orderid) {
    wx.request({
        url: Config.baseUrl + "Order/getOrderMsgByid",
        data: {
            orderid: orderid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            if (res.data.result) {
                that.setData({
                    customername: res.data.orderinfo.customername,
                    contname: res.data.orderinfo.contact,
                    phone: res.data.orderinfo.phone,
                    start: res.data.orderinfo.date_start,
                    end: res.data.orderinfo.date_end,
                    addressname: res.data.orderinfo.address,
                    cost: res.data.orderinfo.actcost,
                    acttypename: res.data.orderinfo.typename,
                    invoiced: res.data.orderinfo.invoiced,
                    comments: res.data.orderinfo.comments,
                    userid: res.data.orderinfo.userid,
                    employeeid: res.data.orderinfo.employeeid,
                    speclist: res.data.mainProd,
                    files: res.data.pics
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
        customer_show: false,
        customername: "",
        speclist: [],
        files: [],
        orderid: "",
        picfiles: [],
        invoiced: 0,
        start: '',
        end: '',
        pagehide: false,
        notLogin: true,
        notRegister: true,
        loadingHidden: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;

        this.setData({
            companyid: companyid,
            employeeid: employeeid,
            userid: userid,
            start: Util.getNowFormatDate(),
            end: Util.getNowFormatDate(),
            nowDate: Util.getNowFormatDate(),
            edittitle: "下订单",
        })

        /*获取客户名称，活动类型，活动地点列表*/
        getspeclist(this);
        /*获取参数orderid*/
        var orderid = options.orderid;
        if (orderid > 0) {
            wx.setNavigationBarTitle({
                title: '修改订单'
            })
            this.setData({
                orderid: orderid,
                edittitle: "修改订单"
            })
            /*修改填充*/
            orderedit(this, orderid);
        } else {
            wx.setNavigationBarTitle({
                title: '下订单'
            })
        }
    },

    onShow() {
        // 获取信息
        getInfo(this);
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
    * 点击选择主营产品、
    */
    skip: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
     * 日期选择-起始日期
     */
    startChange: function (e) {
        this.setData({
            start: e.detail.value,
            end: e.detail.value
        })
    },
    endChange: function (e) {
        this.setData({
            end: e.detail.value
        })
    },
    /*客户名称输入框获取焦点,下拉显示*/
    customerSelect: function (e) {
        var showname = config.getDataSet(e, "showname");
        config.full_input(true, showname, this);
    },
    /*客户名称输入事件，过滤下拉列表*/
    customerInput: function (e) {
        var inputdata = e.detail.value;
        var rtn = config.getArraycontains(customerlist, "customername", inputdata);
        this.setData({
            customerlist: rtn
        })
    },
    /*联系人输入事件，过滤下拉列表*/
    contactInput: function (e) {
        var inputdata = e.detail.value;
        var rtn = config.getArraycontains(contactlist, "contname", inputdata);
        this.setData({
            contactlist: rtn
        })
    },
    /*地址输入事件，过滤下拉列表*/
    addressInput: function (e) {
        var inputdata = e.detail.value;
        var rtn = config.getArraycontains(address, "address", inputdata);
        this.setData({
            address: rtn
        })
    },
    /*类型输入事件，过滤下拉列表*/
    acttypeInput: function (e) {
        var inputdata = e.detail.value;
        var rtn = config.getArraycontains(acttype, "typename", inputdata);
        this.setData({
            acttype: rtn
        })
    },
    /**
     * 可输可选过滤方法
     * @param  dataArray 可输可选下拉列表
     * @param  filterName 下拉列表过滤的字段
     * @param  str 输入框输入的字段，即筛选出含有输入框输入的内容
     * @param  setDataList setdata时的字段名
     */
    filterList: function (dataArray, filterName, str, setDataList) {
        var rtn = config.getArraycontains(dataArray, filterName, str);
        config.full_input(rtn, setDataList, this);
    },
    /*隐藏所有下拉框*/
    listhide: function (e) {
        this.setData({
            //customer_show: false,
            contact_show: false,
            //address_show: false,
            acttype_show: false
        })
    },
    /*填充客户名称*/
    full_customer: function (e) {
        var cusname = config.getDataSet(e, "name");
        config.full_input(cusname, "customername", this);
        getcontactlist(this, cusname);
        this.setData({
            customer_show:!this.data.customer_show
        });
    },
    /*填充联系人，并将手机号填充下拉列表*/
    full_contact: function (e) {
        var cusname = config.getDataSet(e, "name");
        var index = config.getDataSet(e, "index");
        this.setData({
            contname: cusname,
            phone: contactlist[index]['phone']
        })
    },
    /*选择下拉列表某一项填充地址*/
    full_inputval: function (e) {
        var cusname = config.getDataSet(e, "name");
        var paramname = config.getDataSet(e, "paramname");//填充的name对应的data的字段
        config.full_input(cusname, paramname, this);
        this.setData({
            address_show:!this.data.address_show
        })
    },
    /*删除选中规格*/
    del_spec: function (e) {
        var id = config.getDataSet(e, "id");
        this.data.speclist.splice(id, 1);
        this.setData({
            speclist: this.data.speclist
        })
    },
    /**
     * 是否开发票选择器
     */
    switch1Change: function (e) {
        var invoiced = (e.detail.value) ? 1 : 0;
        this.setData({
            invoiced: invoiced
        })
    },
    /*选择图片*/
    chooseImage: function (e) {
        var that = this;
        var imgnum = 4;
        var num = imgnum - that.data.files.length;
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: num, //最多选择几张图片
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
    /*图片预览填充*/
    previewImage: function (e) {
        var prevfiles = this.data.files;
        var prevArray = [];
        for (var i = 0; i < prevfiles.length; i++) {
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
            deleteOrderMsgPicture(that, that.data.orderid, that.data.userid, picid, key);
        }


    },
    /*数量同步填充到speclist中*/
    getIndexNum: function (e) {
        var indexnum = config.getDataSet(e, "index");
        var value = e.detail.value;
        var speclist = this.data.speclist;
        speclist[indexnum]['num'] = value;
        this.setData({
            speclist: speclist
        })
    },
    goodssubmit: function (e) {
        var commit_param = e.detail.value;
        var speclist = this.data.speclist;
        var new_spec = [];
        var numflag = false;
        var rebig = /^[1-9]\d*$/,//大于0
            recontactphone = /^[1][123457890][0-9]{9}$/;//手机号
        if (commit_param.customername == "") {
            config.modaljy("请选择客户");
            return;
        }
        if (commit_param.contactname == "") {
            config.modaljy("请选择联系人");
            return;
        }
        if (!recontactphone.test(commit_param.contactphone)) {
            config.modaljy("请输入正确的联系方式");
            return;
        }
        if (commit_param.contactname == "") {
            config.modaljy("请选择联系人");
            return;
        }
        if (commit_param.startdate == "") {
            config.modaljy("请选择起始日期");
            return;
        }
        if (commit_param.enddate == "") {
            config.modaljy("请选择截止日期");
            return;
        }
        if (commit_param.startdate > commit_param.enddate) {
            config.modaljy("请选择有效的起止日期");
            return;
        }
        if (commit_param.address == "") {
            config.modaljy("请输入活动地点");
            return;
        }
        if (this.data.speclist.length == 0) {
            config.modaljy("请选择一组主营产品");
            return;
        }
        for (var i = 0; i < speclist.length; i++) {
            if (speclist[i]['num'] == '' || speclist[i]['num'] == 0 || speclist[i]['num'] == undefined) {
                numflag = true;
            } else {
                new_spec[i] = { prodid: speclist[i]['prodid'], goodsnum: speclist[i]['num'] };
            }
        }
        if (numflag) {
            config.modaljy("请输入主营产品数量");
            return;
        }
        commit_param['goods'] = JSON.stringify(new_spec);
        commit_param['orderid'] = this.data.orderid;
        commit_param['invoiced'] = this.data.invoiced;
        commit_param['companyid'] = this.data.companyid;
        commit_param['employeeid'] = this.data.employeeid;
        commit_param['userid'] = this.data.userid;
        submitFunc(commit_param, this);
    },

    /**
     * 页面跳转
     */
    navigator: function (e) {
        var url = config.getDataSet(e, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    }

})

/**
 * 获取信息
 */
function getInfo(that) {
    if (wx.getStorageSync('userinfo').userid > 0) {
        /* 查询用户信息缓存是否失效 */
        app.judgeLogoNBrace(function () {
            that.setData({
                pagehide: false,
                notLogin: true,
                notRegister: true,
                loadingHidden: true,
            })
        })

    }
}
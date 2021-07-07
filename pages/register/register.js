import { Config } from '../../utils/config.js';
var config = new Config();
/*获取验证码*/
var getcode = function (that) {
    wx.request({
        url: Config.baseUrl + "WXAppLogin/wxappSMSSend",
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
            phone: that.data.phone,
            reguserid: that.data.reguserid
        },
        success: function (data) {
            if (data.data.code != '0') {
                config.modaljy(data.data.message)
            } else {
                wx.showToast({
                    title: '发送成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        that.setData({
                            nums: data.data.smscode,
                            hisabled: true,
                            auth_code: 60
                        })
                        countdown(that);
                        countdowns(that)
                    }
                })
            }
        },
        fail: function () {
            wx.showToast({
                title: '获取失败',
                icon: 'loading',
                duration: 2000
            })
        }
    })
}
/*注册方法*/
var registerFunc = function (commit_mes, that) {
    wx.request({
        url: Config.baseUrl + "WXAppLogin/userReg",
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: commit_mes,
        success: function (data) {
            if (data.data.code == 0) {
                wx.removeStorageSync('userinfo');
                wx.navigateBack({
                    delta: 2
                })
            } else {
                config.modaljy(data.data.message);
            }
        }
    })
}
/**
 * 倒计时
 */
function countdown(that) {
    var second = that.data.auth_code
    var time = setTimeout(function () {
        if (second == 1) {
            that.setData({
                hisabled: false,
                auth_code: '获取验证码'
            });
            return;
        }
        that.setData({
            auth_code: second - 1
        });
        countdown(that);
    }, 1000)
}
/**
 * 倒计时 验证码失效
 */
function countdowns(that) {
    var count_down = that.data.count_down
    var time = setTimeout(function () {
        if (count_down == 0) {
            return
        }
        that.setData({
            count_down: count_down - 1
        });
        countdowns(that);
    }, 1000)
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        verify: true,
        verifys: true,
        gains: true,
        forbidden: false,
        hisabled: false,
        num: '',
        nums: '',
        auth_code: "获取验证码",
        count_down: 600,
        reguserid: '',
        phone: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '注册'
        })
        this.setData({
            reguserid: wx.getStorageSync('userinfo').reguserid,
        })
    },
    /*获取手机号*/
    getPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    /**
     * 获取验证码
     */
    getSmscode: function () {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        var phone = this.data.phone;
        if (phone == '') {
            config.modaljy("请输入手机号");
            return;
        } else if (!myreg.test(phone)) {
            config.modaljy("手机号不正确");
            return;
        }
        var auth_code = this.data.auth_code;
        if (auth_code == '获取验证码'){
            getcode(this);
        }
    },
    /**
     * 输入验证码
     */
    getNum: function (e) {
        if (e.detail.value) {
            this.setData({
                gains: true,
                verifys: false,
                num: e.detail.value
            })
        } else {
            this.setData({
                gains: false,
                verifys: true,
            })
        }
    },
    /**
     * 验证验证码并提交注册信息
     */
    submit: function (e) {
        var value = e.detail.value;
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        var phone = value.phone;
        if (phone == '') {
            config.modaljy("请输入手机号");
            return;
        } else if (!myreg.test(phone)) {
            config.modaljy("手机号不正确");
            return;
        }
        var smscode = value.smscode;
        if (smscode == '') {
            config.modaljy("请输入短信验证码");
            return;
        }
        // var password = value.password;
        // if (password == '') {
        //     config.modaljy("请输入密码");
        //     return;
        // }
        var that = this;
        var commit_mes = e.detail.value;
        commit_mes['reguserid'] = that.data.reguserid;
        /*获取的验证码和后台返回来的验证码*/
        if (that.data.num == that.data.nums) {
            if (that.data.count_down <= 0) {
                wx.showToast({
                    title: '验证码失效',
                    icon: 'loading',
                    duration: 1500
                })
            } else {
                /* 提交注册信息 */
                registerFunc(commit_mes, that);
            }
        } else {
            config.modaljy('验证码错误');
        }
    },
})
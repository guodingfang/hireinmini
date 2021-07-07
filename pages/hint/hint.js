// hint.js
import { Config } from '../../utils/config.js';
var config = new Config();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadingHidden: true,
    },

    onLoad: function (options) {
        this.setData({
            page: options.page,
        })
    },

    cancel: function () {
        wx.switchTab({
            url: "../index/index"
        })
    },
    confirm: function () {
        relogin(this);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //config = new Config();

    },
})

function relogin(that) {
    wx.openSetting({
        success: function (data) {
            that.setData({
                loadingHidden: false,
            })
            if (data.authSetting['scope.userInfo']) {
                wx.removeStorageSync('accredit_info');
                wx.removeStorageSync('errlocation');
                config.userLogin(function () {
                    if (wx.getStorageSync("userinfo").userid == 0) {
                        config.userLogin(
                            function () {
                                if (wx.getStorageSync('skipurl') == undefined || wx.getStorageSync('skipurl') == '') {
                                    wx.navigateBack({
                                        delta: 1,
                                    })
                                } else {
                                    var url = wx.getStorageSync('skipurl');
                                    wx.removeStorageSync('skipurl');
                                    wx.redirectTo({
                                        url: url,
                                    })
                                }
                            }
                        )
                    } else {
                        if (wx.getStorageSync('skipurl') == undefined || wx.getStorageSync('skipurl') == '') {
                            wx.navigateBack({
                                delta: 1,
                            })
                        } else {
                            var url = wx.getStorageSync('skipurl');
                            wx.removeStorageSync('skipurl');
                            wx.redirectTo({
                                url: url,
                            })
                        }
                    }
                });
            } else {
                if (wx.getStorageSync('skipurl') == undefined || wx.getStorageSync('skipurl') == '') {
                    wx.navigateBack({
                        delta: 1,
                    })
                } else {
                    var url = wx.getStorageSync('skipurl');
                    wx.removeStorageSync('skipurl');
                    wx.redirectTo({
                        url: url,
                    })
                }
            }
        },
    })
}
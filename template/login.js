import register from '../utils/register';
import webchat from '../utils/webchat';
import fetch from '../utils/fetch';
import {
	Config
} from '../utils/config';
var config = new Config();
const app = getApp();

function init() {
	var that = this;
	console.log("@")
	//header中相应的数据
	that.setData({});
	/**
	 * 获取微信用户信息
	 */
	that.getWxUserinfo = function (e) {
		
		// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
		// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
		wx.showLoading({
			title: '加载中...',
		})
		if (wx.getUserProfile) {
			wx.getUserProfile({
				desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (e) => {
					console.log("getUserProfile获取微信信息", e);
					var data = {
						encryptedData: e.encryptedData,
						iv: e.iv
					}
					app.wxRegister(data, function () {
						wx.hideLoading();
						let userinfo = wx.getStorageSync('userinfo');
						if (userinfo.code == 0) {
							that.onShow();
						} else {
							that.setData({
								userinfo: wx.getStorageSync('userinfo'),
							})
						}
					});
				}
			})
		} else {
			wx.getUserInfo({
				success: function (res) {
					console.log("getUserInfo获取微信信息", res);
					var data = {
						encryptedData: res.encryptedData,
						iv: res.iv
					}
					app.wxRegister(data, function () {
						wx.hideLoading();
						let userinfo = wx.getStorageSync('userinfo');
						if (userinfo.code == 0) {
							that.onShow();
						} else {
							that.setData({
								userinfo: wx.getStorageSync('userinfo'),
							})
						}
					});
				},
				fail: function (res) {
					console.log('failed:', res);
				}
			})
		}
		wx.hideLoading();
	};
	/**
	 * 获取code
	 */
	that.getCode = function (e) {
		console.log('x')
		wx.login({
			success: function (res) {
				wx.setStorageSync('code', res.code);
			}
		})
	};
	/**
	 * 获取用户手机号
	 */
	that.getWxUserphone = function (e) {
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				var data = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				}
				app.wxGetPhone(data, function () {
					if (data.code == 1) {
						that.setData({
							pageshow: 1,
						})
					}
					that.onShow();
				});
			}
		},
		that.getPhone = e => {
			that.setData({
				phone: e.detail.value
			});
		},
		/**
		 *获取验证码
		 */
		that.getVerification = () => {
			let url = Config.baseUrl + "WXAppLogin/wxappSMSSend";
			register.getVerification(that, url);
		},
		/**
		 *用户手机号注册
		 */
		that.formSubmit = e => {
			let url = Config.baseUrl + "WXAppLogin/userReg";
			register.submit(that, e,
				value => {
					let {
						phone,
						verification
					} = value;
					let reguserid = wx.getStorageSync('userinfo').reguserid;
					fetch(url, 'POST', {
						phone,
						reguserid
					}).then(
						value => {
							if (value.data.code == 0) {
								wx.setStorageSync('userinfo', value.data);
								that.onShow();
							} else {
								config.modaljy(value.data.message);
							}
						}
					);
				}
			);
		}
}
module.exports = {
	init: init
};
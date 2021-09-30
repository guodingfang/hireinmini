import { Config } from 'utils/config.js';
var config = new Config();



App({
	onLaunch: function () {},
	globalData: {
		userInfo: null,
		// 运行环境
		workInfo: null,
		// 获取顶部状态栏的高度：rpx
		statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] * (750 / wx.getSystemInfoSync()['windowWidth']),
		// 设置全局header-top高度：rpx
		headerTopHeader: 88,
		// 设置全局header搜索框高度：rpx
		headerSearchHeader: 100,
	},
	/**
	 * 获取微信code
	 */
	getWxCode: function () {
		wx.login({
			success: function (res) {
				var date = new Date;
				wx.setStorageSync('wxcode', res);
			}
		})
	},

	onShow(options) {
    // 判断运行环境
		this.judgeWork(options);
  },

	judgeWork(options) {
		const workInfo = wx.getSystemInfoSync();
		console.log('环境', workInfo);
		this.globalData.workInfo = workInfo;
	},
	
	/**
	 * 用户登录
	 */
	wxLogin: function (callback) {
		wx.login({
			success: function (res) {
				if (res.code) {
					wx.request({
						url: Config.baseUrl + 'WXAppLogin/WXAppLogins',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						method: "POST",
						data: {
							code: res.code
						},
						success: function (res) {
							if (res.data.code > 2) {
								wx.showModal({
									content: res.data.message,
									showCancel: false,
									confirmText: "确定",
									success: function (e) {
										wx.switchTab({
											url: '../index/index',
										})
									}
								})
							} else {
								if (res.data.code == 0) {
									wx.removeStorageSync('userinfo');
									wx.setStorageSync('userinfo', res.data.userinfo);
								}
								wx.removeStorageSync('userinfo');
								wx.setStorageSync('userinfo', res.data.userinfo);
								var date = new Date;
								var twoHourDate = Date.parse(getApp().getTwoHourDate(date));
								wx.setStorageSync('twoHourLogoDate', twoHourDate);
								callback();
							}
						}
					})
				}
			}
		})
	},
	/**
	 * 用户注册
	 */
	wxRegister: function (data, callback) {
		var code = wx.getStorageSync('wxcode').code;
		wx.request({
			url: Config.baseUrl + 'WXAppLogin/userRegByUserinfo',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST",
			data: {
				code: code,
				encryptedData: data.encryptedData,
				iv: data.iv
			},
			success: function (res) {
				console.log("缓存信息", res)
				let userdetail = res.data;
				if (userdetail.code > 2) {
					wx.showModal({
						content: userdetail.message,
						showCancel: false,
						confirmText: "确定",
						success: function (e) {
							wx.switchTab({
								url: '../index/index',
							})
						}
					})
				} else {
					getApp().getWxCode();
					wx.removeStorageSync('userinfo');
					wx.setStorageSync('userinfo', userdetail);
					var date = new Date;
					var twoHourDate = Date.parse(getApp().getTwoHourDate(date));
					wx.setStorageSync('twoHourLogoDate', twoHourDate);
					callback();
				}
			}
		})
	},
	/**
	 * 获取微信手机号
	 */
	wxGetPhone: function (data, callback) {
		var reguserid = wx.getStorageSync('userinfo').reguserid;
		var code = wx.getStorageSync('wxcode').code;
		wx.request({
			url: Config.baseUrl + 'WXAppLogin/getWxUserPhoneNumber',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST",
			data: {
				code: code,
				encryptedData: data.encryptedData,
				iv: data.iv,
				reguserid: reguserid
			},
			success: function (res) {
				if (res.data.code > 2) {
					// getApp().wxGetPhone(data, callback);
					wx.showModal({
						content: res.data.message,
						showCancel: false,
						confirmText: "确定",
						success: function (e) {
							wx.switchTab({
								url: '../index/index',
							})
						}
					})
				} else {
					wx.removeStorageSync('userinfo');
					wx.setStorageSync('userinfo', res.data);
					var date = new Date;
					var twoHourDate = Date.parse(getApp().getTwoHourDate(date));
					wx.setStorageSync('twoHourLogoDate', twoHourDate);
					callback();
				}
			}
		})
	},

	/**
	 * 操作时间 俩小时后
	 */
	getTwoHourDate: function (date) {
		date.setHours(date.getHours() + 2);
		return date
	},

	/**
	 * 判断logininfo缓存是否失效
	 */
	judgeLogoNBrace(callback) {
		var date = Date.parse(new Date()); //当前时间
		var LogoDate = wx.getStorageSync('twoHourLogoDate'); //两小时后的时间
		if (date > LogoDate) {
			wx.removeStorageSync('userinfo');
			getApp().wxLogin(function () {
				callback();
			})
		} else {
			callback();
		}
	}
})
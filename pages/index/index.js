//index.js
//获取应用实例
import {
	Config
} from '../../utils/config.js';

import {
	getReleaseList
} from '../../models/release';
import {
	getCarousel
} from '../../models/util';

var util = require('../../utils/util.js');
var publiclist = require('../../template/publiclist.js');
import emoji from '../../utils/emoji';

var login = require('../../template/login.js');
var config = new Config();
var app = getApp();

Page({
	data: {
		loadingHidden: false,
		releaseList: [],
		cityname: '',
		pagenum: 0,
	},

	async onLoad() {
		login.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块

		this.getCarousel();
	},

	// 获取租赁列表
	async getReleaseList({ reset = false }) {
		const { pagenum, cityname, releaseList } = this.data
		const {
			data,
			page
		} = await getReleaseList({
			pagenum,
			cityname
		});
		this.setData({
			releaseList: reset ? data : [ ...releaseList, ...data ],
			loadingHidden: true,
			pagenum: page + 1
		})
	},

	// 获取首页轮播
	async getCarousel() {
		const list = await getCarousel({})
		this.setData({
			carouselList: list
		})
	},

	// 入驻
	skipCompany(e) {
		const { companyid } = wx.getStorageSync('userinfo')
		if (companyid > 0) {
			// 有公司跳转公司详情页
			wx.navigateTo({
				url: '/pages/companydetails/companydetails?typeid=1&companyid=' + companyid,
			})
		} else { // 无公司跳转创建公司或绑定公司页
			wx.navigateTo({
				url: '/pages/company_select/company_select',
			})
		}
	},

	getCityInfo() {
		const { cityname = '' } = wx.getStorageSync('cityinfo')
		return cityname
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		const cityname = this.getCityInfo()
		if(cityname === this.data.cityname) return
		this.setData({
			loadingHidden: false,
			pagenum: 0,
			cityname,
		})
		this.getReleaseList({ reset: true })

		// var that = this;
		// 判断用户登录信息是否缓存
		// config.userLogin(function () {
		// 	var userinfo = wx.getStorageSync('userinfo');
		// 	userid = userinfo.userid ? userinfo.userid : 0;
		// 	if (userid > 0) {
		// 		/* 查询用户信息缓存是否失效 */
		// 		app.judgeLogoNBrace(function () {
		// 			that.setData({
		// 				userid: userid,
		// 				username: userinfo.nickname,
		// 				loadingHidden: true,
		// 			})
		// 		});
		// 	} else {
		// 		that.setData({
		// 			userid: userid,
		// 			loadingHidden: true,
		// 		})
		// 	}
		// 	//获取城市缓存
		// 	var cityinfo = wx.getStorageSync('cityinfo');
		// 	if (cityinfo != '') {
		// 		that.setData({
		// 			cityname: cityinfo.cityname,
		// 			citycode: cityinfo.citycode,
		// 		})
		// 		if (that.data.switchover) {
		// 			that.setData({
		// 				list: [],
		// 			})
		// 			p = 0;
		// 			//分页获取租圈列表
		// 			GetList(that);
		// 		}
		// 	} else {
		// 		getCity(that);
		// 	}
		// })
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(e) {
		console.log('转发来源:', e);
		if (e.from === 'button') {
			let {
				msgid,
				url
			} = e.target.dataset;
			return {
				title: '赁客+',
				path: '/pages/detail/detail?msgid=' + msgid,
				imageUrl: url
				// imageUrl: 'https://wxapp.ilinking.com.cn/upload/wood/20210601/60b5927ed0301.jpg'
			}
		}
	},

	/*推荐跳转到公司列表*/
	market: function (event) {
		config.permission('companylist/companylist', function () {
			wx.navigateTo({
				url: '../companylist/companylist',
			})
		})
	},

	/*点击关注我们使主页出现二维码*/
	appear: function (event) {
		wx.navigateTo({
			url: '../webview/webview',
		})
	},

	/**
	 * 公共点击 (必须登录)
	 */
	clickoper: function (event) {
		var that = this;
		getUserinfo(that, function () {
			var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
			if (companyid > 0) {
				var url = config.getDataSet(event, 'url');
				config.permission(url, function (res) {
					wx.navigateTo({
						url: '../' + url,
					})
				});
			} else {
				config.modalqd('请先创建或绑定公司', function (res) {
					if (res.confirm) {
						wx.navigateTo({
							url: '../company_select/company_select',
						})
					}
				});
			}
		})
	},

	/* 搜索跳转 */
	// searchgood: function () {
	// 	config.permission('searchgood/searchgood', function () {
	// 		wx.navigateTo({
	// 			url: '../searchgood/searchgood',
	// 		})
	// 	})
	// },

	/*跳转到公司 */
	// entercompany: function (e) {
	// 	var that = this;
	// 	getUserinfo(that, function () {
	// 		var companyid = wx.getStorageSync('userinfo').companyid ? wx.getStorageSync('userinfo').companyid : 0;
	// 		if (companyid > 0) {
	// 			// 有公司跳转公司详情页
	// 			config.permissionht('company-manage/company-manage', function (res) {
	// 				if (res.data.result) {
	// 					wx.navigateTo({
	// 						url: '../companydetails/companydetails?typeid=1&companyid=' + companyid,
	// 					})
	// 				} else {
	// 					wx.navigateTo({
	// 						url: '../companydetails/companydetails?typeid=2&companyid=' + companyid,
	// 					})
	// 				}
	// 			})
	// 		} else { // 无公司跳转创建公司或绑定公司页
	// 			wx.navigateTo({
	// 				url: '../company_select/company_select',
	// 			})
	// 		}
	// 	})
	// },

	/* 下拉刷新 */
	async onPullDownRefresh () {
		this.setData({
			loadingHidden: false,
			pagenum: 0,
		})
		await this.getReleaseList({ reset: true });
		//停止刷新
		wx.stopPullDownRefresh();
	},
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {
		//上拉
		await this.getReleaseList({})
	},

	/**
	 * 跳转详情
	 */
	// clickInfo: function (e) {
	// 	var typeid = config.getDataSet(e, 'typeid');
	// 	var id = config.getDataSet(e, 'id');
	// 	var index = config.getDataSet(e, 'index');
	// 	var that = this;
	// 	if (typeid == 1) {
	// 		config.permission('bill_info/bill_info', function () {
	// 			addBrowse(that, index, id, typeid, function () {
	// 				wx.navigateTo({
	// 					url: '../bill_info/bill_info?id=' + id + '&adtypeid=' + typeid,
	// 				})
	// 			})
	// 		})
	// 	} else if (typeid == 2) {
	// 		config.permission('job_info/job_info', function () {
	// 			addBrowse(that, index, id, typeid, function () {
	// 				wx.navigateTo({
	// 					url: '../job_info/job_info?id=' + id + '&adtypeid=' + typeid,
	// 				})
	// 			})
	// 		})
	// 	} else if (typeid == 3) {
	// 		config.permission('sell_info/sell_info', function () {
	// 			addBrowse(that, index, id, typeid, function () {
	// 				wx.navigateTo({
	// 					url: '../sell_info/sell_info?id=' + id + '&adtypeid=' + typeid,
	// 				})
	// 			})
	// 		})
	// 	} else {
	// 		config.permission('buy_info/buy_info', function () {
	// 			addBrowse(that, index, id, typeid, function () {
	// 				wx.navigateTo({
	// 					url: '../buy_info/buy_info?id=' + id + '&adtypeid=' + typeid,
	// 				})
	// 			})
	// 		})
	// 	}
	// },
})

/**
 * 获取城市
 */
function getCity(that) {
	//获取最新历史城市
	wx.request({
		url: Config.baseUrl + 'Index/getHitory',
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		data: {
			userid: userid
		},
		method: 'POST',
		success: function (res) {
			if (res.data != '') {
				p = 0;
				that.setData({
					citycode: res.data.citycode,
					cityname: res.data.cityname,
					list: []
				})
				/*缓存城市信息*/
				wx.setStorageSync('cityinfo', res.data);
				//分页获取租圈列表
				GetList(that);
			} else {
				/* 定位 */
				userLocation(that);
			}
		}
	})
}

/**
 * 请求定位
 */
function userLocation(that) {
	wx.getLocation({
		type: 'wgs84',
		complete: function (res) {
			var latitude = res.latitude
			var longitude = res.longitude
			wx.request({
				url: Config.baseUrl + 'Index/userLocation',
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				method: 'POST',
				data: {
					userid: userid,
					latitude: latitude,
					longitude: longitude,
				},
				success: function (data) {
					p = 0;
					that.setData({
						citycode: data.data.citycode,
						cityname: data.data.cityname,
						list: [],
					})
					/*缓存城市信息*/
					wx.setStorageSync('cityinfo', data.data);
					//分页获取租圈列表
					GetList(that);
				}
			})
		},
	})

}

/**
 * 增加浏览次数
 */
function addBrowse(that, index, id, typeid, callback) {
	wx.request({
		url: Config.baseUrl + 'Advert/addBrowse',
		data: {
			id: id,
			typeid: typeid
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: 'post',
		success: function (res) {
			if (res.data.result == true) {
				var datalist = that.data.list;
				for (var i = 0; i < datalist.length; i++) {
					if (i == index) {
						datalist[i]['viewcounts'] = parseInt(datalist[i]['viewcounts']) + 1;
					}
					that.setData({
						list: datalist,
					})
				}
				callback();
			}
		}
	})
}

/**
 * 获取用户信息
 */
function getUserinfo(that, callback) {
	var code = wx.getStorageSync('userinfo').code;
	if (code == 0) {
		callback();
	} else if (code > 0) {
		wx.navigateTo({
			url: '../login/login',
		})
	}
}
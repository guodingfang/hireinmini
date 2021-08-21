import { getCarousel } from '../../models/util'
import { getLocation } from '../../models/user'
import { judgeTabBarHeight } from '../../utils/util'
import {
	getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
} from '../../models/service'

const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		headerBlock: 0,
		cityname: '全国', // 筛选城市
		keyword: '',
		carouselList: [],
		hotProductList: [],
		schemeList: [],
		topSellList: [],
		tabList: [
			{
				type: 'design-centre',
				name: '设计中心'
			},
			{
				type: 'banquet',
				name: '场地服务'
			},
			{
				type: 'service-center',
				name: '服务中心'
			},
			{
				type: 'maintain-center',
				name: '维修中心'
			},
			{
				type: 'used-center',
				name: '二手直卖'
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad (options) {
		this.getHeaderBlock()
		this.getCarousel()
		this.getInfo()
		this.getLocation()
	},

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader, headerSearchHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader + headerSearchHeader,
			tabHeight,
		})
	},

	getLocation() {
		getLocation()
	},

	getInfo() {
		this.getHighRentRateProduct();
		this.getRecommendSchemeList();
		this.getTopSell();
	},

	async getHighRentRateProduct() {
		const list = await getHighRentRateProduct({})
		if(list instanceof Array) {
			this.setData({
				hotProductList: list
			})
		}
	},
  async getRecommendSchemeList() {
		const list = await getRecommendSchemeList({})
		if(list instanceof Array) {
			this.setData({
				schemeList: list
			})
		}
	},
  async getTopSell() {
		const list = await getTopSell({})
		if(list instanceof Array) {
		this.setData({
			topSellList: [1,2,3]
		})
		}
	},

	onSelect(e) {
		const { type } = e.detail
		wx.navigateTo({
			url: `/pages/${type}/${type}`,
		})
	},

	onMore(e) {
		console.log('更多', e)
	},

		// 获取首页轮播
	async getCarousel() {
		const list = await getCarousel({
			tabname: 'service'
		})
		this.setData({
			carouselList: list
		})
	},

	getCityInfo() {
		const { cityname = '' } = wx.getStorageSync('cityinfo')
		return cityname
	},

	onShow () {
		const cityname = this.getCityInfo()
		if(cityname === this.data.cityname && this.data.releaseList.length !== 0) return
		this.setData({
			loadingHidden: false,
			pagenum: 0,
			cityname: cityname || this.data.cityname,
		})
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
	/*跳转到消息列表*/
	jumpreplylist: function (e) {
		wx.navigateTo({
			url: "../replylist/replylist"
		})
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {

	},

	/**
	 * 用户点击右上角分享
	 */

	// onShareAppMessage(e) {
	// 	if (e.from === 'button') {
	// 		let { msgid, url } = e.target.dataset;
	// 		return {
	// 			title: '服务',
	// 			path: `/pages/detail/detail?msgid=${msgid}`,
	// 			imageUrl: url
	// 		}
	// 	}
	// },

	/**
	 * 跳转发布
	 */
	// issue: function () {
	// 	wx.navigateTo({
	// 		url: '../release/release',
	// 	})
	// 	// config.permission('release/release', function() {
	// 	// })
	// },

	/**
	 * 点击进入城市列表、
	 */
	citylist: function (event) {
		var url = config.getDataSet(event, 'url');
		wx.navigateTo({
			url: '../citylist/citylist?rurl=' + url,
		})
		// config.permission(url, function() {
		// })
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
	}
})

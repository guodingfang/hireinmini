import { getKeyWordReleaseList } from '../../models/release'
import { getCarousel } from '../../models/util'
import {
	getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
} from '../../models/service'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cityname: '全国', // 筛选城市
		keyword: '',
		releaseList: [],
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
				name: '预定场地'
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
		this.getCarousel()
		this.getInfo()
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
			topSellList: list
		})
		}
	},

	onSelect(e) {
		console.log('e', e)
		const { type } = e.detail
		wx.navigateTo({
			url: `/pages/${type}/${type}`,
		})
	},

	onSearch(e) {
		const { value } = e.detail
		this.setData({
			keyword: value,
			pagenum: 0,
		})
		this.getKeyWordReleaseList({ reset: true })
	},
	onInputClear() {
		this.setData({
			keyword: '',
		})
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

	// 根据关键词获取租赁列表
	async getKeyWordReleaseList({ reset = false }) {
		const { pagenum, cityname, releaseList, keyword = '' } = this.data
		const { data, page } = await getKeyWordReleaseList({
			pagenum,
			cityname,
			keyword
		});
		this.setData({
			releaseList: reset ? data : [ ...releaseList, ...data ],
			loadingHidden: true,
			pagenum: page + 1,
			moreHidden: false
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
		this.getKeyWordReleaseList({})
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
		this.setData({
			loadingHidden: false,
			pagenum: 0,
		})
		await this.getKeyWordReleaseList({ reset: true })
		//停止刷新
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {
		this.setData({
			moreHidden: true,
		})
		//上拉
		await this.getKeyWordReleaseList({})
	},

	/**
	 * 用户点击右上角分享
	 */

	onShareAppMessage(e) {
		if (e.from === 'button') {
			let { msgid, url } = e.target.dataset;
			return {
				title: '服务',
				path: `/pages/detail/detail?msgid=${msgid}`,
				imageUrl: url
			}
		}
	},

	/**
	 * 跳转发布
	 */
	issue: function () {
		wx.navigateTo({
			url: '../release/release',
		})
		// config.permission('release/release', function() {
		// })
	},

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

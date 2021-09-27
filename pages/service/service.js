import { getCarousel } from '../../models/util'
import { judgeTabBarHeight } from '../../utils/util'
import config from '../../config'
import {
	getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
} from '../../models/service'

import { getRecommendCompanyList } from '../../models/release'

const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgUrl: config.imgUrl,
		headerBlock: 0,
		cityname: '',
		keyword: '',
		carouselList: [],
		hotProductList: [],
		schemeList: [],
		topSellList: [],
		showRecommendCompanyList: true,
		tabList: [
			{ type: 'design-centre', name: '设计中心' },
			{ type: 'banquet', name: '场地服务' },
			{ type: 'service-center', name: '服务中心' },
			{ type: 'maintain-center', name: '维修中心' },
			{ type: 'used-center', name: '二手直卖' }
		],
		// 本地推荐 && 全国推荐
		thisLocalityCompanyList: [],
		nationwideCompanyList: [],
		pagesize: 10,
		currentPage: 2,
		notMoreData: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad (options) {
		const { cityname = '' } = wx.getStorageSync('cityinfo')
		this.setData({ cityname })
		this.getHeaderBlock()
		this.getCarousel()
		// this.getInfo()
	},

	async getNationwideCompanyList() {
		const { pagesize, currentPage, cityname } = this.data
		this.setData({
			thisLocalityCompanyList: [],
			pagesize: 10,
			currentPage: 2,
			notMoreData: false,
		})
		const { data } = await getRecommendCompanyList({
			page: currentPage,
			pagesize,
			city: cityname
		})
		this.setData({
			nationwideCompanyList: data.map(item => ({
				...item,
				label: item.label.slice(0, 3)
			})),

		})
		this.getRecommendCompanyList()
	},

		// 获取租赁商列表
		async getRecommendCompanyList() {
			const { pagesize, currentPage, cityname } = this.data
			const { data, page } = await getRecommendCompanyList({
				page: currentPage,
				pagesize,
				city: cityname
			})
			const thisLocalityCompanyList = data.map(item => ({
				...item,
				label: item.label.slice(0, 3)
			}));
			this.setData({
				thisLocalityCompanyList: [...this.data.thisLocalityCompanyList, ...thisLocalityCompanyList],
				currentPage: page.pagecount,
				notMoreData: page.pagecount === page.page,
			})
		},

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader, headerSearchHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader + headerSearchHeader,
			tabHeight,
		})
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

	onGetLocation(e) {
		this.setData({
			cityname: e.detail.city
		})
		this.getNationwideCompanyList()
	},

	updateCity(e) {
		const { cityname } = e
		this.setData({ cityname })
	},

	onShow () {

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
		if(this.data.notMoreData) return
		await this.getRecommendCompanyList()
	},
})

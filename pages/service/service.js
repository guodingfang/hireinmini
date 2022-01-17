import { getCarousel, getPageHeaderImage } from '../../models/util'
import { judgeTabBarHeight } from '../../utils/util'
import config, { remoteImagesUrl } from '../../config'
import {
	getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
} from '../../models/service'

import { getRecommendCompanyList } from '../../models/release'
import { getLocationInfo } from '../../models/map'

const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bgImagesUrl: '',
		imgUrl: config.imgUrl,
		headerBlock: 0,
		city: '',
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
		pagesize: 18,
		currentPage: 1,
		notMoreData: false,
		triggered: false,
		moreHidden: false,
		loading: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad (options) {
		this.getHeaderBlock()
		this.getPageHeaderImage()
		this.getCarousel()
		// this.getInfo()
		this.getLocationInfo()
	},

	async getPageHeaderImage () {
		const { data, errcode } = await getPageHeaderImage({
			pagename: 'service'
		})
		if(errcode === 0 && data && data.picurl) {
			this.setData({
				bgImagesUrl: `${config.imgUrl}${data.picurl}`
			})
		} else {
			this.setData({
				bgImagesUrl: ''
			})
		}
	},

	async getLocationInfo() {
		try {
			const info = await getLocationInfo()
			this.setData({
				city: info.city,
			})
			await this.getNationwideCompanyList()
		} catch (err) {
			console.log('err', err)
		}
	},

	async onAgainLocationComplete({city}) {
		this.setData({
			city,
			nationwideCompanyList: [],
			thisLocalityCompanyList: [],
			currentPage: 1,
		})
		await this.getNationwideCompanyList()
	},

	async getNationwideCompanyList() {
		const { pagesize, currentPage, city } = this.data
		this.setData({
			thisLocalityCompanyList: [],
			notMoreData: false,
		})
		const { data } = await getRecommendCompanyList({
			page: currentPage,
			pagesize,
			city: city
		})
		this.setData({
			nationwideCompanyList: data.map(item => ({
				...item,
				label: item.label.slice(0, 3)
			})),
			currentPage: 2,
		})
		this.getRecommendCompanyList()
	},

	// 获取租赁商列表
	async getRecommendCompanyList() {
		const { loading = false, pagesize, currentPage, city } = this.data
		if(loading) return
		this.setData({
			loading: true
		})
		const { data, page } = await getRecommendCompanyList({
			page: currentPage,
			pagesize,
			city: city
		})
		const thisLocalityCompanyList = data.map(item => ({
			...item,
			label: item.label.slice(0, 3)
		}));
		if(thisLocalityCompanyList.length) {
			this.setData({
				thisLocalityCompanyList: [...this.data.thisLocalityCompanyList, ...thisLocalityCompanyList],
				currentPage: page.page + 1,
				notMoreData: page.pagecount === page.page,
				moreHidden: false,
				loading: false
			})
		}
		setTimeout(() => {
			this.setData({
				triggered: false,
			}, 1000)
		})
	},

	onSkipService(e) {
		const { companyid } = e.currentTarget.dataset
		wx.navigateTo({
			url: `/pages/service-account/service-account?companyid=${companyid}`,
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

	onShow () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	async onPullDownRefresh () {

	},

	async onScrollEnd(e) {
		if(this.data.notMoreData) return
		this.setData({
			moreHidden: true,
		})
		await this.getRecommendCompanyList()
	},

	async onScrollRefresh(e) {
		this.setData({
			triggered: true,
			nationwideCompanyList: [],
			thisLocalityCompanyList: [],
			currentPage: 1,
		})
		await this.getNationwideCompanyList()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {

	},
})

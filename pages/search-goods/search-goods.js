import {
	getSearchHistoryList,
	getSearchHotList,
	getSearchList,
	clearHisSearch
} from '../../models/search'

import { getDiscoverMsgList } from '../../models/release'
import { login } from '../../models/user'
import { remoteImagesUrl } from '../../config'

import { promisic } from '../../utils/util'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		keyword: '',
		list: [],
		hotlist: [],
		hislist: [],
		search: false,
		pagenum: 0,
		type: 'all',
		moreHidden: false,
		tabList: [{
			name: '全部',
			type: 'all',
			select: true
		}, {
			name: '内容',
			type: 'content'
		}, {
			name: '服务',
			type: 'service'
		}],
		releaseList: [],
		serviceList: [],
		miniServiceList: [],
		notContentImagesUrl: `${remoteImagesUrl}/not-content.png`
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getSearchHistoryList();
		this.getSearchHotList();
	},

	// 获取历史搜索
	async getSearchHistoryList() {
		const hislist = await getSearchHistoryList({})
		this.setData({
			hislist
		})
	},

	// 获取热门搜索
	async getSearchHotList() {
		const hotlist = await getSearchHotList({})
		this.setData({
			hotlist
		})
	},

	// 搜索内容监控
	onInput(e) {
		const { value } = e.detail
		if(value === '') {
			this.setData({
				search: false
			})
		}
		this.setData({
			keyword: value
		})
	},

	// 清空搜索内容
	onInputClear() {
		this.setData({
			keyword: '',
			search: false
		})
	},

	// 选择tab
	onSelectTab(e) {
		const { type = '' } = e.detail
		this._selectTab(type)
		wx.pageScrollTo({
			scrollTop: 0
		})
	},

	_selectTab(type) {
		if (type === 'all') {
			this.getSearchList()
		} else if (type === 'content') {
			this.getSearchContent({reset: true})
		} else if (type === 'service') {
			this.getSearchService()
		}
		this.setData({
			type,
			tabList: this.data.tabList.map(tab => tab.type === type ? { ...tab, select: true }: { ...tab, select: false })
		})
	},

	// 搜索全部
	async getSearchList() {
		const { keyword } = this.data
		const { 
			content,
			serviceprovider
		 } = await getSearchList({
			keyword,
		})
		const hislist = this.data.hislist.filter(his => his.searchtext !== keyword)
		const serviceList = serviceprovider.map(item => ({...item, label: item.label.slice(0, 3)}))
		this.setData({
			releaseList: content,
			serviceList,
			miniServiceList: serviceList.slice(0, 3),
			hislist: [
				{ searchtext: keyword },
				...hislist,	
			]
		})
	},

	async getSearchContent({ reset = false }) {
		const { cityname = '全国', keyword, pagenum = 0, releaseList = [] } = this.data
		const { data, page } = await getDiscoverMsgList({
			pagenum: reset ? 0 : pagenum,
			cityname,
			keyword,
			tabname: 'search'
		})
		this.setData({
			moreHidden: false
		})
		if(data.length) {
			this.setData({
				releaseList: reset ? data : [ ...releaseList, ...data ],
				pagenum: page.page + 1,
			})
		}
	},

	getSearchService() {

	},
	
	onSearch() {
		this.setData({
			search: true
		})
		this.getSearchList()
	},

	// 清空历史搜索
	async clearHisSearch() {
		const { result } = await clearHisSearch();
		if (result == true) {
			that.setData({
				hislist: [],
			})
		}
	},

	async clear() {
		const { confirm } = await promisic(wx.showModal)({
			title: '提示',
			content: '确定这样操作嘛 ? ',
		})
		if(!confirm) return
		await this.clearHisSearch()
	},

	onSelect(e) {
		const { value } = e.target.dataset
		if(!value) return
		this.setData({
			keyword: value,
			search: true
		})
		this.getSearchList()
	},

	onSkipMore(e) {
		const { type } = e.currentTarget.dataset;
		this._selectTab(type)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {
		const { type } = this.data
		if( type === 'content') {
			this.setData({
				moreHidden: true,
			})
			await this.getSearchContent({})
		}
	}
})
import { getDiscoverMsgList } from '../../models/release'
import { getCarousel, getRecommendAccountList, getNLoginList } from '../../models/util'
import { initUserInfo, getAttentionedList } from '../../models/user'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { getLocationInfo } from '../../models/map'
import { promisic } from '../../utils/util'
import { storageSet, storageGet } from '../../utils/storage'

const app = getApp();
Page({
	data: {
		scrollTop: 0,
		lastUserId: 0,
		initEnter: true,
		locationLoading: true,
		locationErrLoading: false,
		headerBlock: 0,
		loadingHidden: false,
		releaseList: [],
		city: '',
		pagenum: 0,
		moreHidden: false,
		tabname: 'recommend',
		notAgainLoading: false,
		interest: {
			title: '',
			list: [],
		},
		tabList: [
      { id: '1', name: '关注', type: 'focus' },
      { id: '2', name: '推荐', type: 'recommend', select: true },
      { id: '3', name: '全国', type: 'country' },
			{ id: '4', name: '本地', type: 'native' }
		],
		triggered: false,
	},

	async onLoad() {
		const { userid = 0 } = getUserInfo(['userid'])
		this.setData({
			lastUserId: userid
		})
		this.getHeaderBlock()
		await this.getLocationInfo()
	},

	async getNLoginList() {
		const { data = [] } = await getNLoginList()
		storageSet('notLoginList', data)
	},

	async getLocationInfo() {
		try {
			await getLocationInfo()
			this.getCityInfo()
			this.setData({
				locationLoading: false,
			})
		} catch (err) {
			this.setData({
				locationErrLoading: true,
			})
		}
	},

	// 重新定位
	async onAgainLocation() {
    const res = await promisic(wx.openSetting)()
    if (res.authSetting["scope.userLocation"]) {
      this.getLocationInfo();
    }
	},

	getCityInfo() {
		const { city: oldCity, tabname, tabList } = this.data
		const cityinfo = storageGet('cityinfo')
		if(cityinfo && cityinfo.city) {
			const city = cityinfo.city
			this.setData({
				city,
				tabList: tabList.map(tab => tab.type === 'native' ? {...tab, name: city} : tab)
			})
			if(tabname === 'native' && oldCity !== city) {
				this.getDiscoverMsgList({ reset: true })
			}
		}
	},

	// 手动选择位置
	onManualLocation() {
    wx.navigateTo({
      url: `/pages/city-list/city-list`,
    });
	},

	// 重新选择地址完成触发
	onAgainLocationComplete() {
		this.getLocationInfo();
	},

	// 详情页点赞
	onDetailsLike({ info }) {
		this.setData({
			releaseList: this.data.releaseList.map(item => item.msgid === info.msgid
				? {...item, praised: info.praised, praisecount: info.praisecount} 
				: item)
		})
	},

	getHeaderBlock() {
		const { statusBarHeight, headerTopHeader, headerSearchHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight();
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader + headerSearchHeader,
			tabHeight,
		})
	},

	// 关注账号列表
	async getAttentionedList() {
		const list = await getAttentionedList({})
		if(list.length === 0) {
			this.getRecommendAccountList()
		} else {
			this.setData({
				interest: {
					title: '我的关注',
					isHaveInterest: true,
					list,
				}
			})
		}
	},

	// 推荐账号列表
	async getRecommendAccountList() {
		const list = await getRecommendAccountList({})
		this.setData({
			interest: {
				title: '值得关注',
				isHaveInterest: false,
				list,
			}
		})
	},

	onSkipFocus() {
		wx.navigateTo({
			url: '/pages/focus-list/focus-list',
		})
	},

	async onSelectTab(e) {
		const { tabname, tabList } = this.data
		const { type } = e.detail
		if(tabname === type) return
		this.setData({
			pagenum: 0,
			scrollTop: 0,
			tabList: tabList.map(tab => tab.type === type ? { ...tab, select: true } : { ...tab, select: false }),
			tabname: type
		})
		await this.getCarousel()
		await this.getDiscoverMsgList({ reset: true })
	},

	async onRegainGetUserInfo() {
		this.onAgainGetUserInfo()
	},

	async onAgainGetUserInfo() {
		this.setData({
			pagenum: 0,
			notAgainLoading: true
		})
		await this.getCarousel()
		await this.getDiscoverMsgList({ reset: true })
	},

	async getDiscoverMsgList({ reset = false }) {
		const { pagenum, city, releaseList, tabname = '' } = this.data
		if (tabname === 'focus') {
			await this.getAttentionedList()
		}
		const { data = [], page = 0 } = await getDiscoverMsgList({
			pagenum,
			cityname: city,
			keyword: '',
			tabname
		})
		if(data instanceof Array) {
			this.setData({
				releaseList: reset ? data : [ ...releaseList, ...data ],
				pagenum: page.page + 1,
				moreHidden: false,
			})
		}
		this.setData({
			loadingHidden: true,
		})
		
		setTimeout(() => {
			this.setData({
				triggered: false
			})
		}, 1000)
	},

	// 获取首页轮播
	async getCarousel() {
		const { tabname } = this.data
		let params = {
			tabname
		}
		if (tabname === 'native') {
			const { cityCode = '' } = storageGet('cityinfo')
			params = {
				...params,
				citycode: cityCode 
			}
		}
		const list = await getCarousel({
			...params
		})
		this.setData({
			carouselList: list
		})
	},

	async getInitInfo() {
		this.setData({
			pagenum: 0,
		})
		if (this.data.initEnter) {
			await this.initUserInfo()
			await this.getCarousel()
			await this.getDiscoverMsgList({ reset: true })
			return
		}
		await this.getCarousel()
		await this.getDiscoverMsgList({ reset: true })
	},

	async initUserInfo(options) {
		const { code, userinfo } = await initUserInfo()
		console.log('初始化获取userinfo数据', userinfo)
	},

	// 上拉触发
	async onScrollRefresh() {
		if(this.data.loadingHidden) {
			this.setData({
				triggered: true,
				loadingHidden: false,
				pagenum: 0,
			})
			await this.getDiscoverMsgList({ reset: true });
		}
	},

	// 下拉触发
	async onScrollEnd() {
		this.setData({
			moreHidden: true,
		})
		//上拉
		await this.getDiscoverMsgList({})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow () {
		this.getCityInfo()
		const { lastUserId, notAgainLoading, initEnter } = this.data
		const { userid = 0 } = getUserInfo(['userid'])
		if(lastUserId !== userid && !notAgainLoading) {
			await this.getInitInfo()
		}
		this.setData({
			lastUserId: userid
		})

		if (!initEnter) return
		await this.getInitInfo(initEnter)
		this.setData({
			initEnter: false
		})
	},

	/* 下拉刷新 */
	async onPullDownRefresh () {

	},
	
	/**
	 * 页面上拉触底事件的处理函数
	 */
	async onReachBottom () {

	},
})
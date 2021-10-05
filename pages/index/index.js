
import { login } from '../../models/user'
import { getDiscoverMsgList } from '../../models/release'
import { getCarousel, getRecommendAccountList } from '../../models/util'
import { getAttentionedList } from '../../models/user'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { getLocationInfo } from '../../models/map'
import { promisic } from '../../utils/util'

const app = getApp();
Page({
	data: {
		locationLoading: true,
		locationErrLoading: false,
		headerBlock: 0,
		loadingHidden: false,
		releaseList: [],
		city: '',
		pagenum: 0,
		moreHidden: false,
		tabname: 'recommend',
		interest: {
			title: '',
			list: [],
		},
		tabList: [
      { id: '1', name: '关注', type: 'focus' },
      { id: '2', name: '推荐', type: 'recommend', select: true },
      { id: '3', name: '全部', type: 'country' },
			{ id: '4', name: '本地', type: 'native' }
    ]
	},

	async onLoad() {
		this.getHeaderBlock()
		await this.getLocationInfo()
	},

	async getLocationInfo() {
		try {
			const info = await getLocationInfo()
			this.setData({
				city: info.city,
				locationLoading: false,
			})
		} catch (err) {
			this.setData({
				locationErrLoading: true,
			})
			console.log('err', err)
		}
	},

	// 重新定位
	async onAgainLocation() {
    const res = await promisic(wx.openSetting)()
    if (res.authSetting["scope.userLocation"]) {
      this.getLocationInfo();
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

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader, headerSearchHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
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
		const { tabList } = this.data
		const { type } = e.detail
		this.setData({
			pagenum: 0,
			tabList: tabList.map(tab => tab.type === type ? { ...tab, select: true } : { ...tab, select: false }),
			tabname: type
		})
		await this.getCarousel()
		await this.getDiscoverMsgList({ reset: true })
	},

	// 用户登录
	async login() {
		const { code, userinfo } = await login()
		if(code === 0) {
			this.setData({ userinfo })
		}
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
		if(data instanceof Array && data.length > 0) {
			this.setData({
				releaseList: reset ? data : [ ...releaseList, ...data ],
				pagenum: page.page + 1,
				moreHidden: false
			})
		}
		this.setData({
			loadingHidden: true,
		})
	},

	// 获取首页轮播
	async getCarousel() {
		const { tabname } = this.data
		const list = await getCarousel({
			tabname
		})
		this.setData({
			carouselList: list
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow () {
		const { userid = '' } = getUserInfo(['userid'])
		if(!userid) {
			await this.login();
		}
		this.setData({
			pagenum: 0,
		})
		this.getCarousel()
		this.getDiscoverMsgList({ reset: true })
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(e) {

	},

	/* 下拉刷新 */
	async onPullDownRefresh () {
		this.setData({
			loadingHidden: false,
			pagenum: 0,
		})
		await this.getDiscoverMsgList({ reset: true });
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
		await this.getDiscoverMsgList({})
	},
})
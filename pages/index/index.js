
import { login } from '../../models/user'
import { getDiscoverMsgList } from '../../models/release'
import { getCarousel, getRecommendAccountList } from '../../models/util'
import { getAttentionedList } from '../../models/user'

// login Template
import loginPage from '../../template/login'

Page({
	data: {
		loadingHidden: false,
		releaseList: [],
		cityname: '全国',
		pagenum: 0,
		moreHidden: false,
		tabname: 'recommend',
		interest: {
			title: '',
			list: [],
		},
		tabList: [
      {
        id: '1',
				name: '关注',
				type: 'focus',
      },
      {
        id: '2',
				name: '推荐',
				type: 'recommend',
				select: true
      },
      {
        id: '3',
				name: '全国',
				type: 'country',
      },
      {
        id: '4',
				name: '本地',
				type: 'native'
      }
    ]
	},

	async onLoad() {
		loginPage.init.apply(this, [])
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
				title: '为你推荐',
				list,
			}
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
		const { pagenum, cityname, releaseList, tabname = '' } = this.data
		if (tabname === 'focus') {
			await this.getAttentionedList()
		}
		const { data, page } = await getDiscoverMsgList({
			pagenum,
			cityname,
			keyword: '',
			tabname
		})
		this.setData({
			releaseList: reset ? data : [ ...releaseList, ...data ],
			loadingHidden: true,
			pagenum: page.page + 1,
			moreHidden: false
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

	// 客服消息
	handleContact(e) {
		console.log('e', e)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow () {
		await this.login();
		const cityname = this.getCityInfo()
		if(cityname === this.data.cityname && this.data.releaseList.length !== 0) return
		this.setData({
			pagenum: 0,
			cityname: cityname || this.data.cityname,
		})
		this.getCarousel()
		this.getDiscoverMsgList({ reset: true })
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage(e) {
		if (e.from === 'button') {
			let { msgid, url } = e.target.dataset;
			return {
				title: '赁客+',
				path: `/pages/detail/detail?msgid=${msgid}`,
				imageUrl: url
			}
		}
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
import { checkFrontPower } from '../../models/util'
import {
	login,
	unRegisterUser,
	getMyCompanyInfo,
	getUserBaseInfo,
	getMyOrderForAuditNum,
	getUnReadMsgCount
} from '../../models/user'
import { getUnPayCount } from '../../models/demand'

import { isLogin, getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { remoteImagesUrl } from '../../config'
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openServiceImg: `${remoteImagesUrl}/advert/open-service-account.png`,
		enterServiceImg: `${remoteImagesUrl}/advert/enter-service-account.png`,
		advertImg: `${remoteImagesUrl}/advert/company-enter.png`,
		companyinfo: null,
		userinfo: null,
		isVip: false,
		expires: false,
		userVipInfo: null,
		ordernumber: '',
		loadingHidden: false,
		orderaudit: true,
		verification: "获取验证码",
		phone: '',
		verificationCode: '',
		logourl: '',
		canGetUserProfile: false, //使用getUserProfile取用户信息
		bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
		skipCompanyUrl: '',
		showModel: false,
		msgCount: 0,
		notPayAmount: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad (options) {
		this.getHeaderBlock();
		// await this.getUserBaseInfo();
		await this.getCheckOrder()
		// await this.getMyCompanyInfo()
		// await this.getMyOrderForAuditNum()
		this.setData({
			loadingHidden: true
		})
	},

	async onAgainRequestCompany() {
		// await this.getUserBaseInfo()
	},

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader,
			statusBarHeight,
			tabHeight,
		})
	},

	async getUserBaseInfo() {
		const { user, dynamic, praise, fans, focus, company } = await getUserBaseInfo({})
		const companyInfo =  company instanceof Array ? null : company;
		const vip = user.vip
    this.setData({
			company: companyInfo,
			skipCompanyUrl: companyInfo && companyInfo.companyid
				? `/pages/service-account/service-account?companyid=${companyInfo.companyid}`
				: '',
      userinfo: {
        ...user,
        dynamic,
        fans,
				focus,
				praise
			},
			isVip: vip && vip.vipsign > 0,
			expires: vip && vip.vipexpired === 1,
		})

		if (vip.evip) {
      this.setData({
        userVipInfo: {
          ...vip.evip,
          endDate: vip.evip.enddate.split(' ')[0],
          title: '企服联合'
        }
      })
    } else if (vip.vip) {
      this.setData({
        userVipInfo: {
          ...vip.vip,
          endDate: vip.vip.enddate.split(' ')[0],
          title: '嗨应'
        }
      })
		}
		await this.getUnPayCount()
		await this.getUnReadMsgCount()
	},

	async getUnPayCount() {
		const { unpay = 0 } = await getUnPayCount({})
		this.setData({
			notPayAmount: unpay
		})
	},

	async getUnReadMsgCount () {
		const { errcode = -1, msgcount = 0 } = await getUnReadMsgCount({})
		if (errcode === 0) {
			this.setData({
				msgCount: msgcount
			})
		}
		this.timer = setTimeout(() => {
			this.getUnReadMsgCount()
		}, 10000)
	},

	async onRegainGetUserInfo() {
		this.onAgainGetUserInfo()
	},

	async onAgainGetUserInfo() {
		await this.getUserBaseInfo()
	},
	
	async onSetUserInfo() {
		await login()
		await this.getUserBaseInfo()
	},

	// 跳转到我的订单审核
	async getCheckOrder() {
		const { result } = await checkFrontPower({
			url: 'ordexamine'
		})
		this.setData({
			orderaudit: !result
		})
	},

	// 获取我的企业信息
	async getMyCompanyInfo() {
		const { phone = '', companyid = '' } = getUserInfo(['phone', 'companyid'])
		if (!companyid) return
		const { data } = await getMyCompanyInfo({
			companyid,
			phone
		})
		this.setData({
			companyinfo: data,
			loadingHidden: true
		})
	},

	// 获取待审核订单数量
	async getMyOrderForAuditNum() {
		const { companyid, employeeid } = getUserInfo(['companyid', 'employeeid'])
		const { ordernum = 0 } = await getMyOrderForAuditNum({
			companyid,
			employeeid
		})
		this.setData({
			ordernum
		})
	},

	onSVip() {

		// wx.showToast({
		// 	title: '试用版本，敬请期待',
		// 	icon: 'none',
		// 	duration: 2000
		// })
		const login = isLogin()
    if(!login) return
		wx.navigateTo({
			url: '/pages/vip/vip',
		})
	},

	// 注销账户
	async onUnRegisterUser() {
		await unRegisterUser({})
		wx.clearStorageSync({})
		wx.showToast({
			title: '注销完毕',
			icon: 'none'
		})
		await this.getUserBaseInfo()
	},

	onPassword () {
		wx.navigateTo({
			url: '/pages/wallet-password/wallet-password',
		})
	},

	onSelectCompany(e) {
		const { skipCompanyUrl } = this.data
		if(skipCompanyUrl) return
		const { type = 'service' } = e.currentTarget.dataset
		this.setData({
			showModel: true,
			selectType: type
		})
	},

	onOpenCompany() {
		wx.navigateTo({
			url: '/pages/company-setup/company-setup',
		})
		this.setData({
			showModel: false
		})
	},

	onAddCompany() {
		wx.navigateTo({
			url: '/pages/search-company/search-company',
		})
		this.setData({
			showModel: false
		})
	},

	onCloseModel() {
		this.setData({
			showModel: false
		})
	},

	async openProfile () {
		wx.openChannelsUserProfile({
			finderUserName: 'sphmPpfHEhfWB4d',
			success(res) {
				
			},
			fail(err) {
				console.log('err', err)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow () {
		await this.getUserBaseInfo()
	},

	onHide () {
		clearInterval(this.timer);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},
})

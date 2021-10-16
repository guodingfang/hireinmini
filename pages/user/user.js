import { checkFrontPower } from '../../models/util'
import {
	login,
	unRegisterUser,
	getMyCompanyInfo,
	getUserBaseInfo,
	getMyOrderForAuditNum
} from '../../models/user'

import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { remoteImagesUrl } from '../../config'
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openServiceImg: `${remoteImagesUrl}/advert/open-service-account.png`,
    enterServiceImg: `${remoteImagesUrl}/advert/enter-service-account.png`,
		companyinfo: null,
		userinfo: null,
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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad (options) {
		this.getHeaderBlock();
		// await this.getUserBaseInfo();
		await this.getCheckOrder()
		await this.getMyCompanyInfo()
		await this.getMyOrderForAuditNum()
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
			tabHeight,
		})
	},

	async getUserBaseInfo() {
		const { user, dynamic, fans, focus, company } = await getUserBaseInfo({})
		const companyInfo =  company instanceof Array ? null : company;
    this.setData({
			company: companyInfo,
			skipCompanyUrl: companyInfo && companyInfo.companyid
				? `/pages/service-account/service-account?companyid=${companyInfo.companyid}`
				: '',
      userinfo: {
        ...user,
        dynamic,
        fans,
        focus
      }
    })
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
		const { phone, companyid } = getUserInfo(['phone', 'companyid'])
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
		wx.showToast({
			title: '试用版本，该功能敬请期待',
			icon: 'none',
			duration: 2000
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

	onSelectCompany() {
		const { skipCompanyUrl } = this.data
		if(skipCompanyUrl) return
		this.setData({
			showModel: true
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

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow () {
		await this.getUserBaseInfo()
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

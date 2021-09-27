import {
	Config
} from '../../utils/config.js';

import loginPage from '../../template/login'

var config = new Config();

import { checkFrontPower } from '../../models/util'
import { getMyCompanyInfo, getUserBaseInfo, getMyOrderForAuditNum } from '../../models/user'

import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { remoteImagesUrl } from '../../config'
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		companyinfo: null,
		userinfo: null,
		pageshow: 1,
		ordernumber: '',
		loadingHidden: false,
		orderaudit: true,
		verification: "获取验证码",
		phone: '',
		verificationCode: '',
		logourl: '',
		canGetUserProfile: false, //使用getUserProfile取用户信息
		bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
		skipCompanyUrl: '/pages/company_select/company_select',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad (options) {

		const { userid = '' } = getUserInfo(['userid'])
		console.log('userid', userid)
		if(!userid) {
			loginPage.init.apply(this, [])
		}
		this.setData({
			pageshow: true
		})
		this.getHeaderBlock();
		await this.getUserBaseInfo();
		await this.getCheckOrder()
		await this.getMyCompanyInfo()
		await this.getMyOrderForAuditNum()
		this.setData({
			loadingHidden: true
		})
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
    this.setData({
      company: company instanceof Array ? null : company,
      userinfo: {
        ...user,
        dynamic,
        fans,
        focus
      }
    })
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
			title: '敬请期待',
			icon: 'none',
			duration: 2000
		})
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
	onReachBottom: function () {

	},
	toServerPage() {
		wx.navigateTo({
			url: '/pages/serverPage/serverPage',
		})
	},
	toAttestation() {
		wx.navigateTo({
			url: '/pages/attestation/attestation',
		})
	},
	toDiscern() {
		wx.navigateTo({
			url: '/pages/discern/discern',
		})
	},

	toCreateOrganize() {
		wx.navigateTo({
			url: '/pages/createOrganize/createOrganize',
		})
	},
	// 跳转修改个人信息页面
	modifyInfo() {
		wx.navigateTo({
			url: '/pages/userInfoDetail/userInfoDetail',
		})
	},

	/* 注销 */
	setup: function (event) {
		wx.showModal({
			title: '提示',
			content: '您确定注销吗 ?',
			success: function (res) {
				if (res.confirm) {
					wx.removeStorage({
						key: 'logininfo',
						success: function (res) {
							wx.switchTab({
								url: '../index/index',
							})
						}
					})
				}
			}
		})
	},

	/**
	 * 跳转到我的任务
	 */
	mytask: function (event) {
		config.permission('mytask/mytask', function () {
			wx.navigateTo({
				url: '../mytask/mytask?',
			})
		})
	},
	/**
	 * 跳转到我的发布
	 */
	mylease: function (event) {
		config.permission('mylease/mylease', function () {
			wx.navigateTo({
				url: '../mylease/mylease',
			})
		})
	},

	/**
	 * 跳转到主营产品管理
	 */
	mymain: function (e) {
		const { companyid } = getUserInfo(['companyid'])
		if (companyid > 0) {
			config.permission('mymain/mymain', function () {
				wx.navigateTo({
					url: '../mymain/mymain',
				})
			})
		} else {
			config.modalqd('请先创建或绑定公司', function (res) {
				if (res.confirm) {
					config.permission('company_select/company_select', function () {
						wx.navigateTo({
							url: '../company_select/company_select',
						})
					})
				}
			});
		}
	},

	/*取系统logo*/
	getLogoUrl: function (e) {
		var that = this;
		wx.request({
			url: Config.baseUrl + "WXAppLogin/getWxMiniLogo",
			data: {
				userid: that.data.userid,
				accesstoken: that.data.accesstoken,
				unionid: that.data.unionid
			},
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "post",
			success: function (res) {
				console.log('logo url:', res);
				if (res.data.logo.length > 0) {
					that.setData({
						logourl: Config.imgUrl + res.data.logo
					})
				}
			}
		})
	},
})

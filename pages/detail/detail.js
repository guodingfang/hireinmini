import {
	getReleaseDetail,
	getOtherHosList,
	addLikeRelease,
	deleteLikeRelease,
	addComment,
	addShareRelease,
	addUserDialRecord
} from '../../models/release'
import { addAttention, isAFocusB } from '../../models/user'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { getPageAdvertsment } from '../../models/util'
import { remoteImagesUrl } from '../../config'
import config from '../../config'
import { isLogin } from '../../utils/util'

Page({
	data: {
		tabHeight: 100,
		content: '',
		remoteImagesUrl,
		imgUrl2: config.imgUrl,
		imgUrl: config.imgUrls,
		type: '',
		videoUrl: config.videoUrl,
		otherList: [],
		messageList: [],
		loading: true,
	},
	async onLoad (options) {
		const { tabHeight } = judgeTabBarHeight();
		this.setData({
			msgid: options.msgid,
			tabHeight
		})
		this.getPageAdvertsment()
	},

	changeBrowse () {
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2]; //上一个页面
		prevPage.onDetailsLike && prevPage.onChangeBrowse({
			info: {
				...this.data.info,
				viewcount: +this.data.info.viewcount + 1
			}
		})
	},

	async getPageAdvertsment() {
		const { adcontent = '' } = await getPageAdvertsment({
			page: 'msgdetail'
		})
		this.setData({
			advertUrl: adcontent
		})
	},

	// 获取详情
	async getReleaseDetail() {
		const { msgid } = this.data;
		let { companyinfo = null, info = null } = await getReleaseDetail({ msgid })
		const contentAccont = {
			logo: info.userpic,
			name: info.contacter,
			userid: info.userid,
			des: companyinfo ? companyinfo.companyname || '' : '',
		}
		let type = info.picsign === '1' ? 'img' : info.picsign === '2' ? 'video' : 'html'
		this.setData({
			info,
			imgs: info.pics,
			contentAccont,
			content: info.content,
			messageList: info.discuss || [],
			type,
			loading: false,
		})
		this.getVideoUrl()
		this.changeBrowse()
	},

	// 获取大图及视频图片
	getVideoUrl() {
		const { videoUrl, imgs, type } = this.data
		let url = ''
		if(imgs.length === 0) return
		if (type === 'video') {
			url = `${videoUrl}${imgs[0].videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${imgs[0].width},h_${imgs[0].height},m_fast`
			this.setData({
				videoUrlStatic: url,
				videoUrlDynamic: `${videoUrl}${imgs[0].videourl}`,
			})
		}
	},

	async onAttention() {
		
	},

	async getOtherHosList() {
		const { msgid, info } = this.data;
		const { data = [] } = await getOtherHosList({
			msgid,
			userids: info.userid,
		})
		this.setData({
			otherList: data.splice(0, 5)
		})
	},

	onInput() {
		const login = isLogin()
		if(!login) return
		this.setData({
			commentShow: true,
		})
	},

	// 点赞
	async onLike() {
		const login = isLogin()
		if(!login) return
		const { msgid, praised = 0, userid: tuserid, praisecount = 0 } = this.data.info
		if(praised === 0) {
			await addLikeRelease({
				msgid,
				tuserid
			})
			this.setData({
				info: {
					...this.data.info,
					praised: 1,
					praisecount: +praisecount + 1
				}
			})
		} else if(praised === 1) {
			await deleteLikeRelease({
				msgid,
				tuserid
			})
			this.setData({
				info: {
					...this.data.info,
					praised: 0,
					praisecount: +praisecount - 1
				}
			})
		}
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2]; //上一个页面
		prevPage.onDetailsLike && prevPage.onDetailsLike({
			info: this.data.info
		})
	},

	onShowImage (e) {
		const { index } = e.target.dataset
		const { imgUrl, imgs } = this.data
		const urls = imgs.map(item => `${imgUrl}${item.picurl}`)
		wx.previewImage({
			urls,
			current: urls[index]
		})
	},

	// 拨打电话
	async onDial(e) {
		const login = isLogin()
		if(!login) return
		const { contactphone: phone, userid } = this.data.info	
		if(!phone) {
			wx.navigateTo({
				url: `/pages/message-detail/message-detail?rid=${userid}`,
			})
			return
		}

		await addUserDialRecord({
			phone,
		})
		
		wx.makePhoneCall({
			phoneNumber: phone,
		})
	},

	async onSendComment(e) {
		const { msgid, userid: tuserid, contacter } = this.data.info
		const userinfo = getUserInfo(['nickname', 'userid'])
		await addComment({
			content: e.detail.value,
			tuserid,
			fuserid: userinfo.userid,
			tusername: contacter,
			fusername: userinfo.nickname,
			msgid,
		})
		this.setData({
			info: {
				...this.data.info,
				discusscount: this.data.info.discusscount + 1
			}
		})
		this.getReleaseDetail()
	},

	async onShow () {
		await this.getReleaseDetail()
		await this.getOtherHosList()
	},
	/**
	 * 用户点击右上角分享
	 */
	async onShareAppMessage (e) {
		const { msgid } = this.data
		const { forwardcount = '' } = await addShareRelease({
			msgid
		})
		this.setData({
			info: {
				...this.data.info,
				forwardcount,
			}
		})
		return {
			title: '携手开启数字租赁服务新生态',
			path: `/pages/index/index?path=detail&needLogin=need&msgid=${this.data.msgid}`,
		}
	}
})
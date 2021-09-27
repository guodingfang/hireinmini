import { getReleaseDetail, getOtherHosList, addLikeRelease, deleteLikeRelease, addComment } from '../../models/release'
import { getUserInfo } from '../../utils/util'
import config from '../../config'

Page({
	data: {
		content: '',
		imgUrl: config.imgUrls,
		type: '',
		videoUrl: config.videoUrl,
		otherList: [],
		messageList: [],
	},
	async onLoad (options) {
		this.setData({
			msgid: options.msgid
		})
		await this.getReleaseDetail()
		await this.getOtherHosList()
	},

	// 获取详情
	async getReleaseDetail() {
		const { msgid } = this.data;
		let { info } = await getReleaseDetail({ msgid })
		
		const contentAccont = {
			logo: info.userpic,
			name: info.contacter,
			userid: info.userid,
			des: info.msgtitle || '',
		}
		let type = info.picsign === '1' ? 'img' : info.picsign === '2' ? 'video' : 'html'
		console.log('info', info)
		this.setData({
			info,
			imgs: info.pics,
			contentAccont,
			content: info.content,
			messageList: info.discuss || [],
			type,
		})
		this.getVideoUrl()
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

	async getOtherHosList() {
		const { msgid, info } = this.data;
		const { data = [] } = await getOtherHosList({
			msgid,
			userids: info.userid,
		})
		this.setData({
			otherList: data
		})
	},

	onInput() {
		this.setData({
			commentShow: true,
		})
	},

	// 点赞
	async onLike() {
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
					praisecount: praisecount + 1
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
					praisecount: praisecount - 1
				}
			})
		}
	},

	async onSendComment(e) {
		const { msgid, userid: tuserid, contacter } = this.data.info
		console.log('info', this.data.info)
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
	},


	onShow: function () {

	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (e) {
		if (e.from === 'button') {
			let { msgid, url } = e.target.dataset;
			return {
				title: '赁客+',
				path: `/pages/detail/detail?msgid=${msgid}`,
				imageUrl: url
			}
		}
	},
})
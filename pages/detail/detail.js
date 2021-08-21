import {
	Config
} from '../../utils/config.js';
import emoji from '../../utils/emoji';
var publiclist = require('../../template/publiclist.js');
var WxParse = require('../../wxParse/wxParse.js');
var config = new Config();
const app = getApp()

import { getReleaseDetail, getOtherHosList } from '../../models/release'
import { getUserInfo } from '../../utils/util'

Page({
	data: {
		imgurl: Config.imgUrl,
		imgurls: Config.imgUrls,
		videourl: Config.videoUrl,
		pageshow: 1,
		otherMsgDetail: [],
		pagetype: "detail", //为了在template中区分是不是详情的
		failFlag: true,
		hidden: true,
		item: [],
		videoList: [], //视频列表
		companyinfo: [], //公司信息
		operationFlag: false,
		commentShow: false,
		com_tuserid: 0,
		com_fuserid: 0,
		placeInput: "请输入评论内容",
		currentVid: null,
		currentVideo: null,
		verification: "获取验证码",
		phone: '',
		verificationCode: '',
		logourl: '',
		canGetUserProfile: false, //使用getUserProfile取用户信息
	},
	async onLoad (options) {
		publiclist.init.apply(this, []); // this关键字必须传进去 这样才能使header.js中的数据和函数注入到这个模块

		this.setData({
			msgid: options.msgid
		})
		if (wx.getUserProfile) {
			this.setData({
				canGetUserProfile: true,
			});
		}
		// that.getLogoUrl();
		await this.getReleaseDetail()
		await this.getOtherHosList()
	},

	// 获取详情
	async getReleaseDetail() {
		const { msgid } = this.data;
		let { info, companyinfo } = await getReleaseDetail({
			msgid
		})

		if (info.content != null) {
			info.content = emoji.encodeEmoji(info.content);
		}
		const { userid = '' } = getUserInfo(['userid'])
		this.setData({
			userid
		})
		let operationFlag = false;
		if (info.userid == userid && userid > 0) {
			operationFlag = true;
		}
		info.discuss.map(
			(value, index) => {
				info.discuss[index]['content'] = emoji.encodeEmoji(value['content']);
			}
		);
		
		if (companyinfo) {
			companyinfo.logopic = companyinfo.logopic == '' ? '' : this.data.imgurl + companyinfo.logopic
			companyinfo = companyinfo;
		}
		console.log('info', info)
		this.setData({
			// videoList: videoList,
			userids: info.userid,
			item: info,
			companyinfo: companyinfo,
			operationFlag: operationFlag
		})
		WxParse.wxParse('msgarticle', 'html', info.content, this, 5);
	},

	// 获取其他信息
	async getOtherHosList() {
		const { msgid } = this.data;
		let { data = [] } = await getOtherHosList({ msgid })
		data.map(
			(value, index) => {
				data[index]['content'] = emoji.encodeEmoji(value['content']);
				data[index].discuss.map(
					(dv, di) => {
						data[index].discuss[di]['content'] = emoji.encodeEmoji(dv['content']);
					}
				);
			}
		);
		this.setData({
			list: data
		})
	},

	onShow: function () {
		var that = this;
		// 判断用户登录信息是否缓存
		config.userLogin(function () {
			var userinfo = wx.getStorageSync('userinfo');
			var userid = userinfo.userid ? userinfo.userid : 0;
			that.setData({
				userid: userid,
				username: userinfo.nickname
			})
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		var that = this;
		if (res.from === 'button') {
			// 来自页面内转发按钮
			//console.log(res.target)
		}
		return {
			title: "",
			path: 'pages/detail/detail?msgid=' + that.data.msgid + '&hostuserid=' + that.data.hostuserid,
			success: function (res) {
				config.addShareRecord(that, "pages/detail/detail", "详情页", "msgid", that.data.msgid, "", 1);
			}
		}
	},
	/*关闭遮罩*/
	closemask: function () {
		this.setData({
			hidden: true
		})
	},
	/*删除*/
	delmsg: function (e) {
		var that = this;
		var msgid = config.getDataSet(e, "msgid");
		delmsg(that, msgid);
	},
	/*修改*/
	editmsg: function (e) {
		var url = config.getDataSet(e, "url");
		wx.navigateTo({
			url: url
		})
	},
	/*点赞或取消点赞*/
	editPraiseDetail: function (e) {
		var that = this,
			msgid = config.getDataSet(e, "msgid"),
			praised = e.currentTarget.dataset['praised'],
			userid = config.getDataSet(e, "userid");
		var userinfo = wx.getStorageSync('userinfo');
		if (userinfo.userid > 0) {
			var url = praised == 0 ? Config.baseUrl + "Release/addPraise" : Config.baseUrl + "Release/deletePraise";
			editPraiseDetail1(that, userid, msgid, url);
		} else {
			that.setData({
				pageshow: 0,
				userinfo: userinfo,
			})
		}
	},
	/* 跳转公司详情 */
	company: function (e) {
		var companyid = config.getDataSet(e, 'companyid');
		wx.navigateTo({
			url: '../companydetails/companydetails?companyid=' + companyid + '&typeid=2',
		})
	},
	/**
	 * 点击进入内容列表
	 */
	reurlFunc: function (e) {
		var userid = config.getDataSet(e, 'userid');
		var companyid = config.getDataSet(e, 'userid');
		if (companyid > 0) {
			wx.navigateTo({
				url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
			})
		}
	},
	/*点击评论按钮*/
	commentboxFunc: function (e) {
		var that = this;
		var ctusername = config.getDataSet(e, "ctusername");
		var userinfo = wx.getStorageSync('userinfo');
		if (userinfo.userid > 0) {
			that.setData({
				commentShow: true,
				com_tuserid: that.data.item.userid,
				com_fuserid: that.data.userid,
				com_tusername: ctusername,
				com_fusername: that.data.username,
				placeInput: "请输入评论内容"
			})
		} else {
			that.setData({
				pageshow: 0,
				userinfo: userinfo,
			})
		}

	},
	/*隐藏评论框*/
	hideCommentBox: function (e) {
		var that = this;
		that.setData({
			commentShow: false
		})
	},
	/*添加评论*/
	sendComment: function (e) {
		var commit_param = e.detail.value;
		var that = this;
		commit_param['userid'] = that.data.userid;
		if (config.Trim(commit_param.content) == '') {
			config.modaljy("请输入评论内容");
			return;
		}
		sendcontent(that, commit_param);
	},

	/*回复评论*/
	replyComment: function (e) {
		var that = this;
		var msguserid = config.getDataSet(e, "msguserid");
		var tuserid = config.getDataSet(e, "tuserid");
		var fuserid = config.getDataSet(e, "fuserid");
		var fusername = config.getDataSet(e, "fusername");
		var myuserid = that.data.userid;
		if (myuserid != fuserid) {
			that.setData({
				commentShow: true,
				com_tuserid: fuserid,
				com_fuserid: myuserid,
				com_tusername: fusername,
				com_fusername: that.data.username,
				placeInput: "回复" + fusername + ":"
			})
		}
	},
	/**
	 * 跳转到主页
	 */
	returnindex: function (e) {
		config.permission('index/index', function () {
			wx.switchTab({
				url: '../index/index'
			})
		})
	},
})

/*删除信息*/
var delmsg = function (that, msgid) {
	wx.showModal({
		title: '删除信息',
		content: '确定要删除该信息吗？',
		confirmText: "删除",
		cancelText: "取消",
		success: function (res) {
			if (res.confirm) {
				wx.showLoading({
					title: "正在加载中",
					mask: true
				})
				/*删除请求后台*/
				wx.request({
					url: Config.baseUrl + "Release/deleteMsgRelease",
					data: {
						userid: that.data.userid,
						msgid: msgid,
						accesstoken: that.data.accesstoken,
						unionid: that.data.unionid
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "post",
					success: function (res) {
						if (res.data.code == 100) {
							app.wxLogin(function () {
								var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
								var username = wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : (wx.getStorageSync('userinfo').nickname ? wx.getStorageSync('userinfo').nickname : "匿名");
								var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
								var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
								that.setData({
									accesstoken: accesstoken,
									username: username,
									userid: userid,
									unionid: unionid,
								})
								// 删除信息
								delmsg(that, msgid);
							})
						} else {
							if (res.data.result) {
								wx.hideLoading();
								wx.showToast({
									title: "提交成功",
									icon: 'success',
									duration: 2000,
									success: function (e) {
										wx.reLaunch({
											url: '../index/index',
										})
									}
								})
							}
						}
					}
				})
				/*删除请求后台*/
			} else {
				return;
			}
		}
	});
}

/**
 * 点赞和取消点赞
 */
function editPraiseDetail1(that, tuserid, msgid, url) {
	wx.showLoading({
		title: "正在加载中",
		mask: true
	})
	wx.request({
		url: url,
		data: {
			userid: that.data.userid,
			msgid: msgid,
			tuserid,
			tuserid
		},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "post",
		success: function (res) {
			wx.hideLoading();
			if (res.data.result) {
				var list = that.data.item;
				var myuserid = that.data.userid;
				list.praised = (list.praised == 1) ? 0 : 1;
				list.praisecount = (list.praised == 1) ? (parseInt(list.praisecount) + 1) : (parseInt(list.praisecount) - 1);
				/*点赞列表添加或删除对应的点赞人*/
				var containUserid = getArraycontains(list.praiser, 'userid', myuserid);
				var containIndex = list.praiser.indexOf(containUserid);
				if (containIndex > -1) {
					list.praiser.splice(containIndex, 1);
				} else {
					list.praiser.push({
						'username': that.data.username,
						'userid': that.data.userid
					});
				}
				that.setData({
					item: list
				})
			} else {
				config.modaljy(res.data.msg);
				return;
			}
		}
	});
}


/**
 * 数组的每一项是否包含一个字串  param1：主串，param2：字串,返回包含该字符串的新数组
 * @author  sh
 */
function getArraycontains(dataArray, param, str) {
	var newData = {};
	if (str != '') {
		for (var i = 0; i < dataArray.length; i++) {
			if (dataArray[i][param].indexOf(str) > -1) {
				newData = dataArray[i];
			}
		}
		return newData;
	} else {
		return {};
	}
}

/*发送评论*/
var sendcontent = function (that, data) {
	data.content = emoji.decodeEmoji(data.content);
	wx.showLoading({
		title: "正在加载中",
		mask: true
	})
	wx.request({
		url: Config.baseUrl + "Release/addComment",
		data: data,
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: "post",
		success: function (res) {
			if (res.data.code == 100) {
				// 判断用户登录信息是否缓存
				config.userLogin(function () {
					app.wxLogin(function () {
						var accesstoken = wx.getStorageSync('userinfo').accesstoken ? wx.getStorageSync('userinfo').accesstoken : '';
						var username = wx.getStorageSync('userinfo').username ? wx.getStorageSync('userinfo').username : (wx.getStorageSync('userinfo').nickname ? wx.getStorageSync('userinfo').nickname : "匿名");
						var userid = wx.getStorageSync('userinfo').userid ? wx.getStorageSync('userinfo').userid : '';
						var unionid = wx.getStorageSync('userinfo').unionid ? wx.getStorageSync('userinfo').unionid : '';
						that.setData({
							accesstoken: accesstoken,
							userid: userid,
							username: username,
							unionid: unionid,
						})
						sendcontent(that);
					})
				})
			} else {
				wx.hideLoading();
				if (res.statusCode != 200) {
					config.modaljy("提交失败，请联系管理员");
					return;
				}
				if (res.data.result) {
					that.setData({
						commentShow: false
					})
					wx.showToast({
						title: '提交成功',
						icon: 'success',
						duration: 1000,
						success: function () {
							var item = that.data.item;
							item.commentlist.push({
								"content": emoji.encodeEmoji(data.content),
								"userid_receiver": data.tuserid,
								"userid_sender": data.fuserid,
								"touser": data.tusername,
								"sender": data.fusername
							});
							/*更改评论次数*/
							item.commentcount = parseInt(item.commentcount) + 1;
							that.setData({
								item: item
							})
						}
					})
				} else {
					config.modaljy(res.data.msg);
					return;
				}
			}
		}
	});
}
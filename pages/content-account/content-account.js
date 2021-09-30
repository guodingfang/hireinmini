import { getDiscoverMsgList } from '../../models/release'
import { remoteImagesUrl } from '../../config'
import { getUserBaseInfo, getMsgDynamics } from '../../models/user'
import { getUserInfo } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    isCurrentUser: false,
    userinfo: null,
    company: null,
    headerBlock: 0,
    ratio: 2,
    type: 'all',
    tabList: [
      { name: '动态', type: 'all' },
      { name: '文章',type: 'article' },
      {	name: '视频', type: 'video' },
      { name: '小视频', type: 'smallvideo' },
      // { name: '我的店', type: 'stroe' }
    ],
    allList: [],
    articleList: [],
    videoList: [],
    smallvideoList: [],
    stroeList: [],

    current: 0,
    isScroll: false,
    openAnimation: true,
    scrollTop: 0,
    opacity: 0,
    bgImagesUrl: `${remoteImagesUrl}/user-bg-big.png`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { userid = '' } = options
    const { userid: myUserId } = getUserInfo(['userid'])
    console.log('myUserId', myUserId, 'userid', userid)
    if ({})

    this.setData({
      userid,
      isCurrentUser: userid === myUserId
    })
    this.getHeaderBlock()
    // this.getInfo()
    this.getUserBaseInfo()
    this.getMsgDynamics()
    this.getDiscoverMsgList();
  },

  async getUserBaseInfo() {
    const { user, dynamic, fans, focus, company } = await getUserBaseInfo({
      userid: this.data.userid
    })
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

  getHeaderBlock() {
    const { statusBarHeight, headerTopHeader } = app.globalData;
    const headerBlock = statusBarHeight + headerTopHeader;
		this.setData({
      headerBlock,
		})
  },

  async getMsgDynamics() {
    const { type, current, userid } = this.data
    const {
      data = [],
    } = await getMsgDynamics({
      account_userid: userid,
      page: current,
      msgtype: type
    })
    this.setData({
      [`${type}List`]: data
    })
  },

  async getDiscoverMsgList() {
		const { data = [], page = 0 } = await getDiscoverMsgList({
			pagenum: 0,
			cityname: '全国',
			keyword: '',
			tabname: 'recommend'
		})
		if(data instanceof Array && data.length > 0) {
			this.setData({
				releaseList: data,
			})
		}
  },
  
  onSelectTabs(e) {
    this.setData({
      type: e.detail.type
    })
    this.getMsgDynamics()
  },

  onScroll(e) {
    const { scrollTop } = e.detail
    this.setData({
      opacity: scrollTop ? scrollTop / 350 : 0,
    })
    if(scrollTop >= 325 && !this.data.isScroll) {
      this.setData({
        openAnimation: false,
        scrollTop: 400,
        opacity: 1,
      })
      setTimeout(() => {
        this.setData({
          isScroll: true,
        })
      }, 0)
    }
  },

  onTop() {
    this.setData({
      isScroll: false,
      openAnimation: true,
    })
    setTimeout(() => {
      this.setData({
        scrollTop: 0,
        opacity: 0,
      })
    }, 0)
  },

  onBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
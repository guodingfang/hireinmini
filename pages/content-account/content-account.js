import { remoteImagesUrl } from '../../config'
import { getUserBaseInfo, getMsgDynamics, isAFocusB } from '../../models/user'
import { getUserInfo } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    isCurrentUser: false,
    isAttention: false,
    userinfo: null,
    company: null,
    headerBlock: 0,
    type: 'all',
    tabList: [
      { name: '动态', type: 'all' },
      { name: '文章',type: 'article' },
      { name: '图片',type: 'picture' },
      {	name: '视频', type: 'video' },
      { name: '小视频', type: 'smallvideo' },
      { name: '我的店', type: 'stroe' }
    ],
    allList: [],
    articleList: [],
    pictureList: [],
    videoList: [],
    smallvideoList: [],
    stroeList: [],

    current: null,
    isScroll: false,
    openAnimation: true,
    scrollTop: 0,
    opacity: 0,
    bgImagesUrl: `${remoteImagesUrl}/user-bg-big.png`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { userid = '' } = options
    const { userid: myUserId } = getUserInfo(['userid'])

    this.setData({
      userid,
      isCurrentUser: userid === myUserId
    })
    this.isAFocusB()
    this.getHeaderBlock()
    this.getUserBaseInfo()
    // this.getMsgDynamics()
  },

  async onAgainRequestCompany() {
    this.getUserBaseInfo()
  },

  async isAFocusB() {
    const { isCurrentUser, userid: targetuserid } = this.data
    if(isCurrentUser) return
    const { focused } = await isAFocusB({
      targetuserid
    })
    this.setData({
      isAttention: focused === 1
    })
  },

  async getUserBaseInfo() {
    const { user, dynamic, fans, focus, company, praise } = await getUserBaseInfo({
      userid: this.data.userid
    })
    this.setData({
      company: company instanceof Array ? null : company,
      userinfo: {
        ...user,
        dynamic,
        fans,
        focus,
        praise
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
    const currentPage = current ? current[type] || 0 : 0
    const {
      data = [],
      page,
    } = await getMsgDynamics({
      account_userid: userid,
      page: currentPage,
      msgtype: type
    })
    const currentList = this.data[`${type}List`] || []
    this.setData({
      [`${type}List`]: [ ...currentList, ...data ],
      [`current.${type}`]: currentPage + 1,
    })
  },

  onScrollBottom() {
    this.getMsgDynamics()
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
      opacity: scrollTop ? scrollTop / 200 : 0,
    })
    if(scrollTop >= 200 && !this.data.isScroll) {
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
    return {
      title: '携手开启数字租赁服务新生态',
      path: `/pages/index/index?path=content-account&needLogin=need&userid=${this.data.userid}`,
    }
  }
})
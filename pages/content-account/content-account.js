import { getDiscoverMsgList } from '../../models/release'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    headerBlock: 0,
    ratio: 2,
    tabList: [
      {
        id: '1',
				name: '动态',
				type: 'focus',
      },
      {
        id: '2',
				name: '文章',
				type: 'recommend',
      },
      {
        id: '3',
				name: '视频',
        type: 'country',
        select: true
      },
      {
        id: '3',
				name: '小视频',
				type: 'country',
      },
      {
        id: '3',
				name: '我的店',
				type: 'country',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderBlock()
    this.getInfo()
    this.getDiscoverMsgList();
  },

  getHeaderBlock() {
    const { statusBarHeight, headerTopHeader } = app.globalData;
    const headerBlock = statusBarHeight + headerTopHeader;
    const ratio =  750 / wx.getSystemInfoSync()['windowWidth'];
    console.log('headerBlock', headerBlock, 'ratio', ratio);
		this.setData({
      headerBlock,
      ratio,
		})
  },
  
  getInfo() {
		const info = wx.getStorageSync('logininfo')
		this.setData({
			userinfo: info
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
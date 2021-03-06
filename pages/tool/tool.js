import { uploadAccessLog } from '../../models/user'

import { remoteImagesUrl } from '../../config'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'power',
    bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    tabList: [
      {
        name: '功耗',
        type: 'power',
      },
      {
        name: 'LED屏',
        type: 'led',
      },
      {
        name: 'LED屏小间距',
        type: 'led',
      },
      {
        name: 'Truss承重',
        type: 'truss',
      },
      {
        name: '雷亚计算',
        type: 'ly',
      },
      {
        name: '投影公式',
        type: 'projection'
      },
      {
        name: '舞台配件',
        type: 'stage'
      },
      {
        name: '音响Delay值',
        type: 'delay'
      },
      {
        name: '开窗比例',
        type: 'scal'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.uploadAccessLog()
    this.getHeaderBlock()
  },

  async uploadAccessLog() {
    await uploadAccessLog({
      page: 'tool'
    })
  },

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		this.setData({
      headerTop: statusBarHeight,
			headerBlock: headerTopHeader,
		})
  },
  
  onBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  onSelectTab(e) {

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
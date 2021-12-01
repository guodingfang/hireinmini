import { publishArtic } from '../../models/article'
import { verifyData } from '../../utils/tool'
import { getUserInfo } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectWay: 'wechat',
    haveWay: ['wechat', 'wallet'],
    isComplete: false,
    price: 0,
  },

  onSelect(e) {
    this.setData({
      selectWay: e.detail.type
    })
  },

  onInputChange(e) {
    const { value } = e.detail
    const { type } = e.target.dataset
    this.setData({
      [type]: value
    })
  },

  async onPublishArtic() {
    const { title = '', content = '', price = 0, selectWay = 'wechat' } = this.data
    const { verify } = verifyData(this.data, [
      { type: 'title', label: '问答的标题' },
      { type: 'content', label: '问答的内容' },
    ])
    if (!verify) return
    const { userid = '', wxappid = '' } = getUserInfo(['userid'])
    await publishArtic({
      title,
      content,
      price,
      userid,
      qatype: 'q',
      paytype: selectWay === 'wechat' ? 'wxpay' : 'wallet',
      openid: wxappid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})
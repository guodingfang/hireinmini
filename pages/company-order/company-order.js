import { getRequirementList, payRequirement } from '../../models/demand'
import { payment } from '../../models/util'
import { formatDate, getUserInfo } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 1000,
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type = '' } = options
    wx.setNavigationBarTitle({
      title: type !== 'complete' ? '需求列表' : '成交列表'
    })
    this.setData({
      type
    })
    this.getRequirementList()
  },

  async getRequirementList () {
    const { errcode, data = [] } = await getRequirementList({
      page: this.data.page,
      pagesize: this.data.pagesize,
      paystatus: this.data.type === 'complete' ? 'success' : 'unpay'
    })
    if (errcode === 0) {
      const { userid = '' } = getUserInfo(['userid', 'wxappid'])
      const _orderList = data.map(item => ({
        ...item,
        date: `${item.startdate} ~ ${item.enddate}`,
        isService: userid === item.serviceuserid,
        isUser: userid === item.userid,
      }))
      this.setData({
        orderList: [...this.data.orderList, ..._orderList]
      })
    }
  },

  onSkipDetails (e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({
      url: `/pages/demand-order/demand-order?type=details&reqid=${id}`,
    })
  },

  async onAcceptOrder (e) {
    const { id } = e.currentTarget.dataset
    const order = this.data.orderList.find(item => item.id === id)
    const { userid = '', wxappid = '' } = getUserInfo(['userid', 'wxappid'])
    const { code, jsApiParameters, errmsg = '' } = await payRequirement({
      price: order.brokerage,
      reqid: id,
      userid,
      openid: wxappid,
    })
    if (code !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }
    const res = await payment({
      payParams: jsApiParameters,
      ordertype: 'demand',
      orderid: id,
    })
    if(res.code === 0) {
      this.getRequirementList()
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
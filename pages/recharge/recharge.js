import { payOrder } from '../../models/account'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRechargeComplete: false,
    isSelect: true,
    price: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSelect (e) {
    this.setData({
      isSelect: true
    })
  },

  onChangeInput(e) {
    this.setData({
      price: e.detail.value
    })
  },

  onClose() {
    this.setData({
      price: ''
    })
  },

  async onRecharge() {
    if(this.data.isRechargeComplete) {
      wx.navigateBack({
        delta: 1,
      })
      return
    }
    const { code = -1, msg = '' } = await payOrder({
      ordertype: 'recharge',
      totalfee: this.data.price * 100,
      goodsdescription: '用户充值'
    })
    if(code !== 0) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    } else {
      this.setData({
        isRechargeComplete: !this.data.isRechargeComplete
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

  }
})
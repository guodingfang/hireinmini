import { payOrder, walletRecharge } from '../../models/account'
import { payment } from '../../models/util'
import { verifyData } from '../../utils/tool'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRechargeComplete: false,
    selectWay: 'wechat',
    price: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onSelect (e) {
    
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

    const { verify } = verifyData(this.data, [
      { type: 'price', label: '充值金额' },
    ])

    if(!verify) return

    if(this.data.price == 0) {
      wx.showToast({
        title: '充值金额需大于0',
        icon: 'none'
      })
      return
    }

    const { errcode = -1, errmsg = '', orderid = '', jsApiParameters = null } = await walletRecharge({
      totalfee: this.data.price,
    })

    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
    }

    const { code, msg } = await payment({
      payParams: jsApiParameters,
      ordertype: 'recharge',
      orderid: orderid,
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
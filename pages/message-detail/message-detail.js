import { getMessageDetail, sendMessage, markMsgRead } from '../../models/user'
import { upload } from '../../models/util'
import { getUserInfo } from '../../utils/util'
import config from '../../config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    page: 1,
    pagesize: 20,
    srollTop: 0,
    messageList: [],
    isScroll: true,
    messageVal: '',
    sendLoading: false,
    keyboardHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const { rid } = options
    this.setData({ rid })
    await this.getMessageDetail({})
    await this.markMsgRead()
    setTimeout(() => {
      this.setData({
        srollTop: 100000
      })
    }, 250)
    wx.onKeyboardHeightChange(res => {
      this.setData({
        keyboardHeight: res.height,
      });
      if (res.height > 0) {
        this.setData({
          srollTop: 100000,
        })
      } 
    })
  },

  async markMsgRead () {
    const { rid } = this.data
    const { userid } = getUserInfo(['userid'])
    await markMsgRead({
      userid: userid,
      userid_send: rid,
    })
  },

  async getMessageDetail ({type = 'all'}) {
    const { rid, page, pagesize } = this.data
    const { userid } = getUserInfo(['userid'])
    const { code, data = [] } = await getMessageDetail({
      userid_me: userid,
      userid_he: rid,
      page,
      pagesize,
      unread: type
    })
    if(code === 0) {
      this.setData({
        messageList: [...data.reverse(), ...this.data.messageList]
      })
    }
    this.timer = setTimeout(() => {
			this.getMessageDetail({ type: 'new' })
		}, 10000)
  },

  onLoadData () {
    this.setData({
      triggered: true
    })
    setTimeout(() => {
      this.setData({
        page: this.data.page + 1,
        triggered: false,
      })
      this.getMessageDetail({})
    }, 1500)
  },

  async uplodaImg () {
    const { tempFilePaths = [] } = await wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
    });
    const { rid } = this.data
    const { userid } = getUserInfo(['userid'])
    wx.showLoading({
      title: '图片发送中...',
    })
    const result = await upload({
      url: '/User/addChatMessage',
      files: tempFilePaths
    }, {
      name: 'rawpic',
      formData: {
        filetype: 'pic',
        userid_send: userid,
        userid_receive: rid
      }
    })
    const { code, data, msg } = JSON.parse(result[0])
    wx.hideLoading()
    this.renderMessage({ code, data, msg })
  },

  async onSendMessage (e) {
    const { value } = e.detail
    if(!value) return
    if (this.data.sendLoading) return
    this.setData({
      sendLoading: true
    })
    const { rid } = this.data
    const { userid } = getUserInfo(['userid'])
    const { code, data, msg } = await sendMessage({
      content: value,
      userid_send: userid,
      userid_receive: rid
    })
    this.renderMessage({code, data, msg})
  },

  renderMessage ({ code, data, msg }) {
    if (code !== 0) {
      wx.showToast({
        title: msg,
        icon: 'none',
      })
      this.setData({
        sendLoading: false
      })
    } else {
      this.setData({
        messageList: [...this.data.messageList, { ...data }],
      })
      setTimeout(() => {
        this.setData({
          srollTop: 100000,
          messageVal: '',
          sendLoading: false
        }, 500)
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
    clearInterval(this.timer);
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
import { publishArtic } from '../../models/article'
import { payOrder } from '../../models/account'
import { verifyData } from '../../utils/tool'
import { getUserInfo } from '../../utils/util'
import { upload } from '../../models/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectWay: 'wechat',
    haveWay: ['wechat', 'wallet'],
    isComplete: false,
    price: 0,
    exitUpload: false,
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

  onUploadComplete(e) {
    const { type = '',  uploadImages = [], uploadVideo = '', formDataParams = null } = e.detail
    this.setData({
      selectUploadType: type,
      uploadImages,
      uploadVideo,
      formDataParams,
      exitUpload: true,
    })
  },


  async onPublishArtic() {
    const { title = '', content = '', price = 0, selectWay = 'wechat' } = this.data
    const { verify } = verifyData(this.data, [
      { type: 'title', label: '问答的标题' },
      { type: 'content', label: '问答的内容' },
    ])

    if (!verify) return

    if (price && selectWay === 'wechat') {
      const { code = -1, msg = '' } = await payOrder({
        ordertype: 'qa',
        totalfee: price * 100,
        goodsdescription: '发布问题'
      })
      if(code !== 0) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }
    }

    const { userid = '', wxappid = '' } = getUserInfo(['userid', 'wxappid'])
    const { errcode = -1, qaid = '' } = await publishArtic({
      title,
      content,
      price,
      userid,
      qatype: 'q',
      paytype: selectWay === 'wechat' ? 'wxpay' : 'wallet',
      openid: wxappid,
    })
    if (errcode !== 0) return
    const { selectUploadType = '' } = this.data
    if (selectUploadType === 'img') {
      const { uploadImages = [] } = this.data
      await upload({
        url: '/QuestionAnswer/uploadQAPicture',
        files: uploadImages
      }, {
        formData: {
          qaid: qaid
        }
      })
    } else if (selectUploadType === 'video') {
      const { formDataParams, uploadVideo } = this.data
      await upload({
        url: '/QuestionAnswer/uploadQAVideo',
        files: [uploadVideo]
      }, {
        formData: {
          qaid: qaid,
          ...formDataParams,
        }
      })
    }
    this.setData({
      isComplete: true
    })
  },

  // 发布完成
  onComplete () {
    wx.navigateBack({
      delta: 1,
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
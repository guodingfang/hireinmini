import { getArticleDetails, publishArtic } from '../../models/article'
import { verifyData } from '../../utils/tool'
import { getUserInfo } from '../../utils/util'
import { upload } from '../../models/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    details: null,
    isComplete: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id = '' } = options
    this.setData({ id })
    this.getArticleDetails()
  },
  
  async getArticleDetails() {
    const { q = {} } = await getArticleDetails({
      questionid: this.data.id
    })
    this.setData({
      details: q,
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

  async onPublishAnswer() {
    const { content = '' } = this.data
    const { verify } = verifyData(this.data, [
      { type: 'content', label: '回答的内容' },
    ])

    if (!verify) return
    const { userid = '', wxappid = '' } = getUserInfo(['userid'])
    const { errcode = -1, qaid = '' } = await publishArtic({
      topid: this.data.id,
      qatype: 'a',
      userid,
      content,
      openid: wxappid
    })
    if (errcode !== 0) return
    const { selectUploadType } = this.data
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

  // 回答完成
  onComplete () {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
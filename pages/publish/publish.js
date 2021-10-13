import { addMsgRelease } from '../../models/release'
import { getUserInfo } from '../../utils/util'
import { upload } from '../../models/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    tel: '',
    city: '',
    citycode: '',
    content: '',
    uploadImages: [],

    selectUploadType: '',
    exitUpload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderBlock()
    const { city, cityCode: citycode } = wx.getStorageSync('cityinfo')
    const { nickname: userName, phone: tel } = getUserInfo(['nickname', 'phone'])
    this.setData({
      city,
      citycode,
      userName,
      tel
    })
  },

  getHeaderBlock() {
		const { statusBarHeight, headerTopHeader } = app.globalData;
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader - 2,
		})
  },


  onInputChange(e) {
    const { type = '' } = e.target.dataset
    this.setData({
      [type]: e.detail.value
    })
  },
  
  // 发布内容
  async onPublish() {
    const { userName, tel, city, content = '', citycode } = this.data
    
    if (!content) {
      wx.showToast({
        title: '请填写内容',
        icon: 'none',
      })
    }

    if (!userName) {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none',
      })
    }

    const telRegex =  /^[1][3456789][0-9]{9}$/;
    if (!telRegex.test(tel)) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'none',
      })
    }
    
    const { selectUploadType = '', exitUpload = false } = this.data
    const picsign = exitUpload ? selectUploadType === 'img' ? 1 : 2 : 0
    const { msg = '', pk = '', result = false } = await addMsgRelease({
      contacter: userName,
      contactphone: tel,
      cityname: city,
      citycode,
      msgid: '',
      content,
      picsign,
    })
    wx.showToast({
      title: msg,
      icon: 'none',
    })
    if (result) {
      const { selectUploadType } = this.data
      if (selectUploadType === 'img') {
        const { uploadImages = [] } = this.data
        await upload({
          url: '/Release/addMsgPicture',
          files: uploadImages
        }, {
          formData: {
            msgid: pk
          }
        })
      } else {
        const { formDataParams, uploadVideo } = this.data
        await upload({
          url: '/Release/addMsgPicture',
          files: [uploadVideo]
        }, {
          formData: {
            msgid: pk,
            ...formDataParams,
          }
        })
      }
      wx.navigateBack();
    }
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

  onLocation() {
    wx.navigateTo({
      url: '/pages/city-list/city-list',
    })
  },

  onAgainLocationComplete(e) {
    this.setData({
      city: e.city,
      citycode: e.code,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
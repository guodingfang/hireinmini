import { getLocation } from '../../models/user'
import { getMap } from '../../models/map'

import { addMsgRelease } from '../../models/release'
import { fa } from '../../utils/pinYin';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    tel: '',
    city: '',
    cityCode: '',
    content: '',
    triggerUpload: false,
    exitUpload: false,
    selectUploadType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userinfo');
    console.log('userinfo', userinfo)
    this.setData({
      userName: userinfo.nickname,
      tel: userinfo.phone
    })
    this.getLocation()
  },

  	// 根据经纬度获取位置信息
	getLocation() {
    const that = this
		getLocation(({latitude, longitude}) => {
			getMap().reverseGeocoder({
				location: `${latitude},${longitude}`,
				success({ result }) {
          console.log('result', result)
          const { city = '', city_code } = result.ad_info
					that.setData({
            city,
            cityCode: city_code
          })
				}
			})
		}, () => {})
  },

  onInputChange(e) {
    const { type = '' } = e.target.dataset
    this.setData({
      [type]: e.detail.value
    })
  },
  
  // 发布内容
  async onPublish() {
    const { userName, tel, city, content = '', cityCode } = this.data
    
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
      citycode: cityCode,
      msgid: '',
      content,
      picsign,
    })
    wx.showToast({
      title: msg,
      icon: 'none',
    })
    if (result) {
      this.setData({
        triggerUpload: true,
        uploadId: pk,
      })
      wx.navigateBack();
    }
  },
  
  isUpload(e) {
    console.log('e', e.detail)
    const { type = '', upload = false } = e.detail
    this.setData({
      selectUploadType: type,
      exitUpload: upload,
    })
  },

  onUpdateComplete() {
    this.setData({
      onUpdateComplete: false,
    })
  },

  onLocation() {
    wx.navigateTo({
      url: '/pages/citylist/citylist?rurl=index',
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
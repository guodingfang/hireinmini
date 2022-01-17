import { remoteImagesUrl } from '../../config'
import { getUserInfo, judgeTabBarHeight } from '../../utils/util'
import { addRequirement } from '../../models/demand'
import { upload } from '../../models/util'
import { verifyData } from '../../utils/tool'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    headerBlock: 0,
    uploadImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderBlock()
  },

  getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader,
			tabHeight,
		})
  },

  onChanageInput (e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [`${type}`]: e.detail.value
    })
  },

  async onUploadComplete (e) {
    console.log('e2', e)
    const { uploadImages } = e.detail
    this.setData({
      uploadImages
    })
  },

  async onSubmit () {
    const { verify } = verifyData(this.data, [
      { type: 'companyname', label: '需求方(公司)名称' },
      { type: 'contact', label: '联系人' },
      { type: 'phone', label: '联系电话' },
      { type: 'actaddress', label: '活动地点' },
      { type: 'budget', label: '活动预算' },
      { type: 'acttype', label: '活动类型' },
      { type: 'remarks', label: '文字留言' }
    ])
    if (!verify) return

    const { uploadImages = [], companyname = '', contact = '', phone = '', actaddress = '', budget = '', acttype = '', remarks = '' } = this.data
    const result = await upload({
      url: '/Requirement/uploadReqPictures',
      files: uploadImages
    }, {
      formData: {
        type: 'require'
      }
    })
    const pics = result.map(item => JSON.parse(item).picid).join(',')
    
    const res = await addRequirement({
      companyname,
      contact,
      phone,
      actaddress,
      budget,
      acttype,
      remarks,
      pics
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
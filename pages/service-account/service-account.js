import { getCompanyInfo } from '../../models/company'
import { getCompanyGoodsList } from '../../models/goods'
import { addUserDialRecord } from '../../models/release'
import { isAFocusB, addAttention } from '../../models/user'
import { getUserInfo } from '../../utils/util'
import config from '../../config'
import { isLogin } from '../../utils/util'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    carouselList: [],
    goodsList: [],
    imageConfigs: {
      width: 690,
      height: 450,
      radius: 20
    },
    type: 'about',
    tabList: [{
      type: 'about',
      name: '简介',
      select: true
    }, {
      type: 'service',
      name: '产品/服务'
    }, {
      type: 'comment',
      name: '评论'
    }],
    companyid: '',
    isCurrentUser: false,
    isAttention: false,
    imgUrl: config.imgUrl,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { companyid = '' } = options
    this.setData({
      companyid,
    })
    this.getCompanyInfo()
    this.getCompanyGoodsList()
  },

  async onAgainRequestCompany() {
    this.getCompanyInfo()
    this.getCompanyGoodsList()
  },

  async getCompanyInfo() {
    const { userid } = getUserInfo(['userid'])
    const info = await getCompanyInfo({ id: this.data.companyid })
    this.setData({
      info,
      carouselList: info.compamypiclist.map(item => ({
        ...item,
        picfile: item.picfilename
      })),
      isCurrentUser: info.createdby === userid
    })
    await this.isAFocusB()
  },

  async isAFocusB() {
    const { info, isCurrentUser } = this.data
    if(isCurrentUser) return
    const { focused } = await isAFocusB({
      targetuserid: info.createdby
    })
    this.setData({
      isAttention: focused === 1
    })
  },

  async onAttention() {
    const login = isLogin()
    if(!login) return
    const { info, isAttention } = this.data
    await addAttention({
      targetuserid: info.createdby,
      focused: isAttention ? 0 : 1
    })
    this.setData({
      isAttention: !isAttention
    })
  },

  async getCompanyGoodsList() {
    const { data } = await getCompanyGoodsList({
      companyid: this.data.companyid,
      type: 'recommend',
      page: 1,
      pagesize: 10
    })
    this.setData({
      goodsList: data.data
    })
  },

  onSelectTab(e) {
    const { type } = e.detail
    this.setData({
      type,
      tabList: this.data.tabList.map(tab => tab.type === type ? {...tab, select: true} : {...tab, select: false})
    })
  },

  onEnterCompany() {
    const { companyid = '' } = this.data
    wx.navigateTo({
      url: `/pages/company-setup/company-setup?companyid=${companyid}`,
    })
  },
  onCompanyManage() {
    wx.showToast({
      title: '试用版本，敬请期待',
      icon: 'none'
    })
    // wx.navigateTo({
    //   url: '/pages/product-manage/product-manage',
    // })
  },

  async onDial() {
    const login = isLogin()
    if(!login) return

    const { phone } = this.data.info
		if(!phone) {
			wx.showToast({
				title: '该用户未提供电话',
				icon: 'none'
			})
			return
		}

		await addUserDialRecord({
			phone,
		})
		
		wx.makePhoneCall({
			phoneNumber: phone,
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
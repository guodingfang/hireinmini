import { uploadAccessLog } from '../../models/util'
import { remoteImagesUrl } from '../../config'
import { getUserInfo, getStorageInfo, getLocationCityInfo } from '../../utils/util'
import { getLocationInfo } from '../../models/map'
import { promisic } from '../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationLoading: false,
		locationErrLoading: false,
    type: 'power',
    bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    defaultIndex: 0,
    tabList: [
      {
        name: '功耗',
        type: 'power',
      },
      {
        name: 'LED屏',
        type: 'led',
      },
      {
        name: 'LED屏小间距',
        type: 'ledmini',
      },
      {
        name: 'Truss承重',
        type: 'truss',
      },
      {
        name: '雷亚计算',
        type: 'ly',
      },
      {
        name: '投影公式',
        type: 'projection'
      },
      {
        name: '舞台配件',
        type: 'stage'
      },
      {
        name: '音响Delay值',
        type: 'delay'
      },
      {
        name: '开窗比例',
        type: 'scal'
      },
      {
        name: '桁架、喷绘计算器',
        type: 'truss-prints'
      },
      {
        name: 'Truss计算',
        type: 'truss-compute'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const { type = '' } = options
    this.setData({ type })
    await this.getLocationInfo()
    this.getHeaderBlock()
  },

  getDefaultIndex() {
    let defaultIndex = 0
    this.data.tabList.map((item, index) => {
      if(item.type === this.data.type) {
        defaultIndex = index
      }
    })
    this.setData({ 
      defaultIndex
    })
  },

  async uploadAccessLog() {
    const { tabList, type } = this.data
    const tab = tabList.find(tab => tab.type === type)
    const { userid, unionid, wxappid } = getUserInfo(['userid', 'unionid', 'wxappid'])
    const { city } = getLocationCityInfo(['city'])
    await uploadAccessLog({
      page: tab ? tab.name : '',
      loginuserid: userid,
      loginunionid: unionid,
      openid: wxappid,
      city
    })
  },

	getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		this.setData({
      headerTop: statusBarHeight,
			headerBlock: headerTopHeader,
		})
  },
  
  onBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  onSelectTab(e) {
    this.setData({
      type: e.detail.type
    })
    this.uploadAccessLog()
  },

  async getLocationInfo() {
    const { city = '' } = getLocationCityInfo(['city'])
    if (city) {
      this.setData({
        locationLoading: false,
      })
      this.getDefaultIndex()
      return
    } else {
      this.setData({
        locationLoading: true,
      })
    }
		try {
			await getLocationInfo()
			this.setData({
				locationLoading: false,
      })
      this.getDefaultIndex()
		} catch (err) {
			this.setData({
				locationErrLoading: true,
			})
		}
	},

	// 重新定位
	async onAgainLocation() {
    const res = await promisic(wx.openSetting)()
    if (res.authSetting["scope.userLocation"]) {
      this.getLocationInfo();
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
    return {
      title: '携手开启数字租赁服务新生态',
      path: `/pages/index/index`,
    }
  }
})
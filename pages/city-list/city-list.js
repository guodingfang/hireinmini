import { getLocationInfo, addressGetinfo, getCityList, getHitoryList, getHotList } from '../../models/map'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    selectLetter: '',
    cityList: [],
    hitoryList: [],
    hotlist: [],
    currentCity: null,
    // 需要触发重新加载的页面路径
    againLoadList: [
      'pages/index/index',
      'pages/set-up/set-up'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLocationInfo()
    // 获取城市列表
    this.getCityList()
    // 获取历史城市列表
    this.getHitoryList();
    // 获取热门城市列表
    this.getHotList();
  },

  async getLocationInfo() {
    const info = await getLocationInfo()
    this.setData({
      currentCity: info
    })
	},

  // 获取城市列表
  async getCityList() {
    const { searchLetter } = this.data
    const cityList = await getCityList()
    const regroupList = searchLetter.map(letter => ({
      letter: letter,
      list: cityList.filter(city => city.initial === letter)
    }))
    this.setData({
      cityList: regroupList,
    })
  },

  // 获取历史城市列表
  async getHitoryList() {
    const hitoryList = await getHitoryList()
    this.setData({
      hitoryList,
    })
  },

  // 获取热门城市列表
  async getHotList() {
    const hotlist = await getHotList()
    this.setData({
      hotlist: hotlist,
    })
  },

  onSelectLetter(e) {
    const { letter } = e.target.dataset
    this.setData({
      selectLetter: letter
    })
  },

  async onSelectCity(e) {
    const { item } = e.target.dataset
    if(item && item.cityname) {
      await addressGetinfo({
        city: item.cityname
      })
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; //上一个页面
      const { route = '' } = prevPage
      const { againLoadList = [] } = this.data
      const existRoute = againLoadList.find(item => item === route)
      if(existRoute) {
        prevPage.onAgainLocationComplete({
          city: item.cityname
        })
      }
      wx.navigateBack({
        delta: 1,
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
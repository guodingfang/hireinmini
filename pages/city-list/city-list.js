import {
  getLocationInfo,
  addressGetinfo,
  addUserCity,
  getCityList,
  getCityInfo,
  getHitoryList,
  getHotList
} from '../../models/map'
import { promisic } from '../../utils/util'
import { storageSet, storageGet } from '../../utils/storage'

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
    isLocation: false
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
    this._getLocationCity()
    try {
      const info = await getLocationInfo({ againLocation: true })
      this.setData({
        isLocation: true
      })
    } catch (e) {
      this.setData({
        isLocation: false
      })
    }
    this._getLocationCity()
  },
  
  _getLocationCity() {
    const currentCity = storageGet('locationCity')
    this.setData({
      currentCity
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

  async onAginLocation() {
    const { isLocation } = this.data
    if (!isLocation) {
      const res = await promisic(wx.openSetting)()
      if (res.authSetting["scope.userLocation"]) {
        this.getLocationInfo();
      }
      return
    }
    const cityInfo = storageGet('locationCity')
    storageSet('cityinfo', cityInfo)

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面

    prevPage.onAgainLocationComplete && prevPage.onAgainLocationComplete({
      city: cityInfo.city,
      code: cityInfo.cityCode
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  async onSelectCity(e) {
    const { item } = e.target.dataset
    if(item && item.cityname) {
      const { data } = await getCityInfo({
        cityname: item.cityname,
        citycode: item.citycode
      })

      const info = {
        cityCode: item.citycode,
        city: item.cityname,
        province: data.provincename,
        district: data.countyname,
        location: '',
        address: '',
      }
      storageSet('cityinfo', info)

      // await addressGetinfo({
      //   city: item.cityname,
      //   code: item.citycode
      // })
      await addUserCity({
        cityname: item.cityname,
        citycode: item.citycode
      })

      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; //上一个页面

      prevPage.onAgainLocationComplete && prevPage.onAgainLocationComplete({
        city: item.cityname,
        code: item.citycode
      })
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
})
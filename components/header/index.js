import { getLocation } from '../../models/user'
import { getMap } from '../../models/map'

const app = getApp();

Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fixed: {
      type: Boolean,
      value: false
    },
    isTopTitle: {
      type: Boolean,
      value: false
    },
    isHeaderContent: {
      type: Boolean,
      value: true
    },
    currentPage: {
      type: String,
      value: ''
    },
    isWeather: {
      type: Boolean,
      value: false
    },
    cityname: {
      type: String,
      value: '',
      observer() {
        this.addressGetinfo()
      }
    },
    placeholder: String,
    search: {
      type: String,
      value: 'block'
    },
    value: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: ''
    }
  },

  /**
   * 外部样式
   */
  externalClasses: ['m-header'],

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    locationInfo: null,
    currentCity: '',
  },

  lifetimes: {
    ready() {
      this.getLocation()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 根据城市名获取位置信息
    addressGetinfo() {
      const { cityname } = this.properties
      console.log('cityname', cityname)
      if (!cityname) return
      const that = this
      getMap().geocoder({
        address: cityname,
        success({ result }) {
          const { province, city, district } = result.address_components
          const locationInfo = { province, city, county: district }
          that.setData({
            locationInfo,
          })
          that.triggerEvent('getLocation', { city }, {})
        }
      })
    },
    // 根据经纬度获取位置信息
    getLocation() {
      if (this.properties.cityname) return
      const that = this
      getLocation(({latitude, longitude}) => {
        getMap().reverseGeocoder({
          location: `${latitude},${longitude}`,
          success({ result }) {
            const { province, city, district: county } = result.address_component
            const locationInfo = { province, city, county }
            that.setData({
              locationInfo,
              currentCity: city,
            })
            that.triggerEvent('getLocation', { city }, {})
          }
        })
      }, () => {})
    },

    onChangeLocation() {
      wx.navigateTo({
        url: '/pages/citylist/citylist?rurl=service',
      })
    },

    onSearch() {
      wx.navigateTo({
        url: '/pages/search-goods/search-goods',
      })
    },
    onChange(e) {
      const { value } = e.detail
      this.triggerEvent('change', {
        value
      }, {})
    },
    onClear(e) {
      this.triggerEvent('clear', {}, {})
    }
  }
})

import { getWeather } from '../../../models/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCity: {
      type: Boolean,
      value: false,
      observer(val) {
        val && this.getWeather()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    degree: 0,
    weatherText: '',
    weather: '',
    location: '',
    aqi: '',
    aqiLevel: '',
    currentCity: null
  },
  
  pageLifetimes: {
    show() {

      this.getWeather()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getWeather() {
      const locationInfo = wx.getStorageSync('locationInfo')
      if(locationInfo && locationInfo.city !== this.data.currentCity) {
        const { data } = await getWeather({
          source: 'pc',
          province: locationInfo.province,
          city: locationInfo.city,
          county: locationInfo.district,
          weathertype: 'observe|air'
        })
        const { air, observe } = data
        this.setData({
          currentCity: locationInfo.city,
          degree: observe.degree,
          weatherText: observe.weather,
          weather: this._getWeather(observe.weather),
          location: locationInfo.city,
          aqi: air.aqi,
          aqiLevel: air.aqi_name,
        })
      }
    },
    _getWeather(weather) {
      const date = new Date()
      switch(weather) {
        case '晴':
          return date.getHours() > 18 ? 'icon-a-qingtianyewan' : 'icon-a-qingtianbaitian'
        case '多云':
          return date.getHours() > 18 ? 'icon-yejianduoyun' : 'icon-duoyun'
        case '阴天':
          return 'icon-yintian'
        case '小雨':
          return 'icon-xiaoyu'
        case '中雨':
          return 'icon-zhongyu'
        case '大雨':
          return 'icon-dayu'
        case '暴雨':
          return 'icon-baoyu'
        case '雷阵雨':
          return 'icon-leizhenyu'
        case '沙尘暴':
          return 'icon-shachenbao'
        case '雾霾':
          return 'icon-wumai'
        case '雨夹雪':
          return 'icon-yujiaxue'
        case '雾':
          return 'icon-wu'
        case '小雪':
          return 'icon-xiaoxue'
        case '中雪':
          return 'icon-zhongxue'
        case '大雪':
          return 'icon-daxue'
        case '扬沙':
          return 'icon-yangsha'
        default:
          return ''
      }
    },
    onChange() {
      this.triggerEvent('change', {}, {})
    }
  }
})

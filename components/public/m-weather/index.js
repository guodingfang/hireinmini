import { getWeather } from '../../../models/util'
import { re } from '../../../utils/pinYin'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    locationInfo: {
      type: Object,
      value: null,
      observer() {
        this.getWeather()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    degree: 0,
    weather: '',
    location: '',
    aqi: '',
    aqiLevel: '',
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    async getWeather() {
      const { locationInfo } = this.properties
      if(!locationInfo) return
      const { data } = await getWeather({
        source: 'pc',
        province: locationInfo.province,
        city: locationInfo.city,
        county: locationInfo.county,
        weathertype: 'observe|air'
      })
      const { air, observe } = data
      this.setData({
        degree: observe.degree,
        weather: observe.weather,
        location: locationInfo.city,
        aqi: air.aqi,
        aqiLevel: air.aqi_name,
      })
    },
    onChange() {
      this.triggerEvent('change', {}, {})
    }
  }
})

import { getPageAdvertsment } from '../../../models/util'
import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    page: {
      type: String,
      value: '',
      observer(val) {
        val && this.getPageAdvertsment()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
  },

  lifetimes: {
    ready() {
      // this.getPageAdvertsment()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getPageAdvertsment () {
      const advert = await getPageAdvertsment({
        page: this.properties.page
      })
      if (advert && advert.adcontent) {
        this.setData({
          advertUrl: advert.adcontent
        })
      }
    },
  }
})

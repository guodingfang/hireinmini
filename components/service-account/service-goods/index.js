import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    skipGoodsDetails() {
      const { info } = this.properties
      wx.navigateTo({
        url: `/pages/service-goods-details/service-goods-details?prodid=${info.prodid}`,
      })
    }
  }
})

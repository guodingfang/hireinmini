import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSkipDetail() {
      const { msgid = '' } = this.properties.info;
      wx.navigateTo({
        url: `/pages/detail/detail?msgid=${msgid}`
      })
    }
  }
})

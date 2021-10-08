import config from '../../../config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer(val) {
        this.getVideoUrl()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
    bigImgUrl: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getVideoUrl() {
      const { pics = [] } = this.properties.info
      const { imgUrl } = this.data
      const bigImgUrl = `${imgUrl}${pics[0].picurl}`
      this.setData({
        bigImgUrl,
      })
    },
    // 跳转详情页
    onSkipDetail(e) {
      const { msgid = '' } = this.properties.info;
      wx.navigateTo({
        url: `/pages/detail/detail?msgid=${msgid}`
      })
    },
  }
})

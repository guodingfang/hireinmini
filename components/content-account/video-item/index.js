import config from '../../../config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer() {
        this.getVideoUrl()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoUrl: config.videoUrl,
    bigImgAndVideoUrl: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getVideoUrl() {
      const { pics = [] } = this.properties.info
      const { videoUrl } = this.data
      const bigImgAndVideoUrl = `${videoUrl}${pics[0].videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${pics[0].width},h_${pics[0].height},m_fast`
      this.setData({
        bigImgAndVideoUrl,
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

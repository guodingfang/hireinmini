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
        this.getShowImg()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
    videoUrl: config.videoUrl,
    showImg: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getShowImg() {
      const { info } = this.properties
      const { picsign, pics = [] } = info
      if(!pics.length) return
      const { imgUrl, videoUrl } = this.data
      let url = ''
      if(picsign === '1') {
        url = `${imgUrl}${pics[0].picurl_thumbnails}`
      } else if (picsign === '2') {
        url = `${videoUrl}${pics[0].videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${pics[0].width},h_${pics[0].height},m_fast`
      }
      this.setData({
        showImg: url,
      })
    },
    onSkipDetail() {
      const { msgid = '' } = this.properties.info;
      wx.navigateTo({
        url: `/pages/detail/detail?msgid=${msgid}`
      })
    }
  }
})

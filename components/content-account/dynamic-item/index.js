import config from '../../../config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer: function() {
        this.getInfo();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
    videoUrl: config.videoUrl,
    imgs: [],
    isOperation: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      const { info } = this.properties;
      const { pics = [], picsign } = info;
      this.setData({
        isBigImg: pics.length === 1,
        imgs: pics.splice(0, 9),
        type: picsign == '2' ? 'video' : 'img',
      })
      this.getVideo()
    },
    getVideo() {
      const { type, videoUrl, imgs } = this.data
      if(type !== 'video') return
      this.setData({
        bigImgAndVideoUrl: `${videoUrl}${imgs[0].videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${imgs[0].width},h_${imgs[0].height},m_fast`
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

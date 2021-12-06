import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPublishUser: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    userInfo: {
      type: Object,
      value: null
    },
    content: {
      type: String,
      value: '',
      observer(val) {
        this.setData({
          showContent: val.length > 250 ? `${val.slice(0, 246)}...` : val,
          isShowMore: val.length > 250
        })
      }
    },
    imgList: {
      type: Array,
      value: []
    },
    video: {
      type: Object,
      value: null,
      observer(val) {
        val && this.getVideoUrl()
      }
    },
    isShowAll: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    videoUrl: config.videoUrl,
    videoUrlStatic: '',
    videoUrlDynamic: '',
    showContent: '',
    isShowMore: false,
    isShowAllContent: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取视频图片
    getVideoUrl() {
      const { video } = this.properties
      this.setData({
        videoUrlStatic: `${config.videoUrl}${video.videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${video.width},h_${video.height},m_fast`,
        videoUrlDynamic: `${config.videoUrl}${video.videourl}`,
      })
    },
    onShowMoreContent() {
      this.setData({
        showContent: this.properties.content,
        isShowAllContent: true
      })
    },
  }
})

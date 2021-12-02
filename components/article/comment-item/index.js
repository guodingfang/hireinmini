import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
      value: ''
    },
    imgList: {
      type: Array,
      value: []
    },
    video: {
      type: Object,
      value: null
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
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    picture: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
    videoUrl: config.videoUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

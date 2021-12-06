// components/contents/video/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoUrlStatic: {
      type: String,
      value: ''
    },
    videoUrlDynamic: {
      type: String,
      value: ''
    }
  },
  externalClasses: ['m-video'],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenVideo() {
      this.setData({
        openVideo: true,
      })
    }
  }
})

// components/content-account/ask-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },
    isCurrentUser: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSkipAskDetails() {
      const { id = '' } = this.properties.info
      wx.navigateTo({
        url: `/pages/article-details/article-details?id=${id}&source=private`
      })
    }
  }
})

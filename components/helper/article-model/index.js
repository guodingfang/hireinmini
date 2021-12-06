// components/helper/questions-model/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
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
    onSkipAskDetails (e) {
      const { id = '' } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/article-details/article-details?id=${id}`
      })
    },
    onSkipAnswer (e) {
      const { id = '' } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/answer-publish/answer-publish?id=${id}`,
      })
    }
  }
})

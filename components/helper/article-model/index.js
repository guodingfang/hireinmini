import { isLogin } from '../../../utils/util'

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
      const login = isLogin()
      if(!login) return
      const { id = '' } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/answer-publish/answer-publish?id=${id}&source=public`,
      })
    }
  }
})

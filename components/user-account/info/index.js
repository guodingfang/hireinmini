// components/user-account/info/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    onSkip(e) {
      const { type = '' } = e.currentTarget.dataset
      if (!type) return
      wx.navigateTo({
        url: `/pages/${type}/${type}`,
      })
    }
  }
})

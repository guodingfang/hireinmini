
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderaudit: {
      type: Boolean,
      value: true
    },
    ordernumbers: {
      type: Number,
      value: 0
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
    onSkipAccountDetails(e) {
      const { type } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/${type}/${type}`,
      })
    }
  }
})

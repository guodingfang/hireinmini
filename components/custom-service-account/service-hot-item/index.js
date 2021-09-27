// components/account/service-hot-item/index.js
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
    onSkipDetails() {
      wx.navigateTo({
        url: '/pages/custom-service-goods-details/custom-service-goods-details',
      })
    }
  }
})

// components/article/user-info/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
    isPublishUser: {
      type: Boolean,
      value: false
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
    onSkipAccount() {
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${this.properties.userInfo.userid}`
      })
    }
  }
})

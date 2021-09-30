// components/user/card-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userinfo: {
      type: Object,
      value: null,
      observer(newVal) {

      }
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
    onSkipContent() {
      const { userinfo } = this.properties
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userinfo.userid}`,
      })
    },
    onSetup() {
      wx.navigateTo({
        url: `/pages/set-up/set-up`,
      })
    }
  }
})

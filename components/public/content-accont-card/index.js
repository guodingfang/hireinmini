// components/public/content-accont-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
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
    onSkipAccont() {
      const { userid =  '' } = this.properties.info;
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userid}`
      })
    },
    onAttention() {
      this.triggerEvent('attention', {}, {})
    }
  }
})

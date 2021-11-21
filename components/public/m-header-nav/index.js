const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    theme: {
      type: String,
      value: 'white'
    },
    fixed: {
      type: Boolean,
      value: true
    },
    isBack: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ''
    },
    bgSrc: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBack() {
      wx.navigateBack({
        delta: 1,
      })
    },
  }
})

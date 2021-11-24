// components/user-account/detail/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isScroll: {
      type: Boolean,
      value: false
    },
    topHeader: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: '123456789012'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScrollTop() {
      this.triggerEvent('top')
    }
  }
})

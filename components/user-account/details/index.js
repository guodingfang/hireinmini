// components/user-account/detail/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isScroll: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if(oldVal && !newVal) {
          this.setData({
            scrollTop: 0,
          })
        }
        setTimeout(() => {
          this.setData({
            _isScroll: newVal
          })
        }, 0)
      }
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
    _isScroll: false,
    list: '123456789012'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScrollTop () {
      this.triggerEvent('top', {}, {})
    }
  }
})

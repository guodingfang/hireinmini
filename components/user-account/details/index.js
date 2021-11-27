import config from '../../../config'

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
    },
    list: {
      type: Array,
      value: [],
    },
    isLoading: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    _isScroll: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onScrollTop () {
      this.triggerEvent('top', {}, {})
    },
    onLoadDetails () {
      this.triggerEvent('load', {}, {})
    }
  }
})

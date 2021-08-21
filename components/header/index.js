const { fa } = require("../../utils/pinYin");

const app = getApp();

Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fixed: {
      type: Boolean,
      value: false
    },
    isTopTitle: {
      type: Boolean,
      value: false
    },
    isHeaderContent: {
      type: Boolean,
      value: true
    },
    currentPage: {
      type: String,
      value: ''
    },
    isLocation: {
      type: Boolean,
      value: true
    },
    cityname: String,
    placeholder: String,
    search: {
      type: String,
      value: 'block'
    },
    value: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: ''
    }
  },

  /**
   * 外部样式
   */
  externalClasses: ['m-header'],

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
    onChangeLocation() {
      wx.navigateTo({
        url: '/pages/citylist/citylist?rurl=index',
      })
    },
    onSearch() {
      wx.navigateTo({
        url: '/pages/search-goods/search-goods',
      })
    },
    onChange(e) {
      const { value } = e.detail
      this.triggerEvent('change', {
        value
      }, {})
    },
    onClear(e) {
      this.triggerEvent('clear', {}, {})
    }
  }
})

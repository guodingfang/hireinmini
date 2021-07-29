const { fa } = require("../../utils/pinYin")

// components/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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

  externalClasses: ['header-fixed'],

  /**
   * 组件的初始数据
   */
  data: {

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
        url: '/pages/searchgood/searchgood',
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

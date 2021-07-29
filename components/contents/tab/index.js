const { fa } = require("../../../utils/pinYin")

// components/tab/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
    height: {
      type: Number,
      value: 88,
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
    onSelectTab(e) {
      const { type = '' } = e.target.dataset
      if(type) {
        this.triggerEvent('select', { type }, {})
      }
    }
  }
})

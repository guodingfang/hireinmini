// components/public/m-button/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: ''
    },
    isSelect: {
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
    onSelect () {
      this.triggerEvent('select', {
        isSelect: !this.properties.isSelect
      })
    }
  }
})

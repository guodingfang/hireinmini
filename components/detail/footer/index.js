// components/detail/footer/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null
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
    onLike() {
      this.triggerEvent('live', {}, {})
    },
    onInput() {
      this.triggerEvent('input', {}, {})
    }
  }
})

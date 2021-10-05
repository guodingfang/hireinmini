// components/public/concern-btn/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isConcern: {
      type: Boolean,
      value: false,
    },
    concernUsers: {
      type: Array,
      value: []
    },
    amount: {
      type: String,
      optionalTypes: [Number],
      value: ''
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
    onConcern() {
      this.triggerEvent('concern', {}, {})
    }
  }
})

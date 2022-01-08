// components/vip/date-select/index.js
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: [],
    },
    notSelect: {
      type: Boolean,
      value: false
    }
  },

    /**
   * 外部样式
   */
  externalClasses: ['m-select'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      if(!this.properties.notSelect) {
        const { index } = e.currentTarget.dataset
        this.triggerEvent('select', {
          type: this.properties.type,
          index
        })
      }
    }
  }
})

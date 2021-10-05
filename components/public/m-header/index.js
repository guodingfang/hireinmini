
// components/public/m-header/index.js
Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: '',
    },
    more: {
      type: Boolean,
      value: true,
    },
    moreText: {
      type: String,
      value: '更多'
    },
    bgColor: {
      type: String,
      value: 'blue'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
 /**
   * 外部样式
   */
  externalClasses: ['m-header'],
  /**
   * 组件的方法列表
   */
  methods: {
    handleMore() {
      const { more, type } = this.properties;
      if(more) {
        this.triggerEvent('more', { type }, {})
      }
    }
  }
})

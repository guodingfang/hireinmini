// components/service/tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
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
      const { type = '' } = e.currentTarget.dataset
      if(type) {
        this.triggerEvent('select', { type }, {})
      }
    }
  }
})

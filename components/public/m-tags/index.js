// components/public/m-tags/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    showBtn: {
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
    onSelectLabel(e) {
      const { id } = e.currentTarget.dataset
      this.triggerEvent('select', {
        id
      }, {})
    },
    onAddLabel(e) {
      this.triggerEvent('add', {}, {})
    }
  }
})

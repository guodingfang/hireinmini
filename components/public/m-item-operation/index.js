// components/public/m-item-operation/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isOperation: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMore() {
      this.setData({
        isOperation: !this.data.isOperation
      })
    }
  }
})

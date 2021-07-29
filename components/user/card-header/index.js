// components/user/card-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userinfo: {
      type: Object,
      value: null,
      observer(newVal) {
        console.log('newVal', newVal)
      }
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

  }
})

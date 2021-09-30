
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
    errLoading: {
      type: Boolean,
      value: false,
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
    onManualLocation() {
      this.triggerEvent('manual', {}, {})
    },
    onAgainLocation() {
      this.triggerEvent('again', {}, {})
    }
  }
})

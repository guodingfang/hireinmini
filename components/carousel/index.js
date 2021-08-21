import config from '../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    displayIndicator: {
      type: Boolean,
      value: true,
    },
    images: {
      type: Array,
      value: [],
      observer(newVal) {
        this.setData({
          current: newVal.length === 0 ? 0 : 1,
        })
      }
    }
  },

  /**
   * 外部样式
   */
  externalClasses: ['m-carousel'],

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    total: 1,
    current: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const { current = 0 } = e.detail;
      this.setData({
        current: current + 1,
      })
    }
  }
})

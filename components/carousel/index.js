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
    },
    configs: {
      type: Object,
      value: {
        indicatorDots: false,
        indicatorColor: 'rgba(0, 0, 0, .3)',
        autoplay: false
      }
    },
    imageConfigs: {
      type: Object,
      value: {
        width: 690,
        height: 330,
        radius: 20
      }
    }
  },

  /**
   * 外部样式
   */
  externalClasses: ['m-carousel', 'm-carousel-item'],

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

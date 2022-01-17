// components/public/footer-tool/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer(val) {
        console.log('val', val)
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
    onComment() {
      this.triggerEvent('comment', {}, {})
    },
    onShare() {
      this.triggerEvent('share', {}, {})
    },
    onLike() {
      this.triggerEvent('like', {}, {})
    },
    onDial() {
      this.triggerEvent('dial', {}, {})
    }
  }
})

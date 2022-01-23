// components/company-select/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModel: {
      type: Boolean,
      value: false,
      observer (val) {
        val && this.setData({
          animateShow: true,
        });
      }
    },
    type: {
      type: String,
      value: 'service'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animateShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenCompany() {
      this.setData({
        animateShow: false
      })
      setTimeout(() => {
        this.triggerEvent('open', {}, {})
      }, 400)
    },
    onAddCompany() {
      this.setData({
        animateShow: false
      })
      setTimeout(() => {
        this.triggerEvent('add', {}, {})
      }, 400)
    },
    onClose() {
      this.setData({
        animateShow: false
      })
      setTimeout(() => {
        this.triggerEvent('close', {}, {})
      }, 400)
    }
  }
})

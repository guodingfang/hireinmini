// components/public/m-tags/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
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
    showModel: false,
    animateShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectLabel(e) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent('select', {
        index
      }, {})
    },
    onAddLabel(e) {
      this.setData({
        showModel: true,
        animateShow: true
      })
    },
    onChanageInput(e) {
      const { type } = e.currentTarget.dataset
      const { value } = e.detail
      this.setData({
        [type]: value
      })
    },
    onModelCancel() {
      this.setData({
        animateShow: false,
      })
      setTimeout(() => {
        this.setData({
          showModel: false,
        })
      }, 400)
    },
    onModelAdd() {
      this.triggerEvent('add', {
        label: this.data.label
      }, {})
      this.onModelCancel()
    }
  }
})

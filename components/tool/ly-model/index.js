// components/tool/ly-model/index.js
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
    width: '',
    thickness: '',
    height: '',
    verticalAmount: '',
    acrossAmount: '',
    slantingAmount: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      if (value % 2 !== 0) {
        wx.showToast({
          title: '输入值必须为2的倍数',
          icon: 'none'
        })
      }
      const _val = value % 2 !== 0 ? +value + 1 : value
      this.setData({
        [type]: _val
      })
      this.computeResult()
    },
    computeResult() {
      const { width, thickness, height } = this.data
      if(width && thickness && height) {
        const _height = Math.floor(height / 1.5)
        this.setData({
          verticalAmount: Math.floor((width / 2 + 1) * (thickness / 2 + 1) * (height / 2)),
          acrossAmount: Math.floor(((thickness / 2 + 1) * (width / 2) + (width / 2 + 1) * (thickness / 2)) * (+_height + 1)),
          slantingAmount: Math.floor(((width / 2) * (thickness / 2 + 1) + (thickness / 2) * (width / 2 + 1)) * (+_height)),
        })
      } else {
        this.setData({
          verticalAmount: '',
          acrossAmount: '',
          slantingAmount: '',
        })
      }
    }
  }
})

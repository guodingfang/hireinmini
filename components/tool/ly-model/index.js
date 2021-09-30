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
        this.setData({
          verticalAmount: ((width / 2 + 1) * (thickness / 2 + 1) * (height / 2)).toFixed(2),
          acrossAmount: (((thickness / 2 + 1) * (width / 2) + (width / 2 + 1) * (thickness / 2)) * (height / 2 + 1)).toFixed(2),
          slantingAmount: (((width / 2) * (thickness / 2 + 1) + (thickness / 2) * (width / 2 + 1)) * (height / 2)).toFixed(2),
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

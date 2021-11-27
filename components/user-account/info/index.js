import { storageGet, storageSet } from '../../../utils/storage'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalPrice: {
      type: String,
      value: '',
      observer(val) {
        const [integerPirce, decimalsPrice] = val.split('.')
        this.setData({
          integerPirce,
          decimalsPrice
        })
      } 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowPrice: storageGet('isShowPrice'),
    integerPirce: '0',
    decimalsPrice: '00'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBrowsePrice () {
      storageSet('isShowPrice', !this.data.isShowPrice)
      this.setData({
        isShowPrice: !this.data.isShowPrice
      })
    },
    onSkip(e) {
      const { type = '' } = e.currentTarget.dataset
      if (!type) return
      wx.navigateTo({
        url: `/pages/${type}/${type}`,
      })
    }
  }
})

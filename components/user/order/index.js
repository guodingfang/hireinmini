import { checkFrontPower } from '../../../models/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderaudit: {
      type: Boolean,
      value: true
    },
    ordernumbers: {
      type: Number,
      value: 0
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
    async onSkipOrder(e) {
      const { type } = e.currentTarget.dataset
      const { result = false } = await checkFrontPower({
        url: 'myorder'
      })
      if(result) {
        wx.navigateTo({
          url: `/pages/myorder/myorder?type=${type}`,
        })
      }
    },
    onSkipOrderDetails() {
      wx.navigateTo({
        url: '/pages/order-list/order-list',
      })
    }
  }
})

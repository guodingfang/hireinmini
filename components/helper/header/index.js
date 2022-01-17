import { promisic } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCity: {
      type: Boolean,
      value: false
    },
    locationInfo: {
      type: Object,
      value: null
    }
  },
  /**
   * 外部样式
   */
  externalClasses: ['m-header'],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打开助手
    async openCustomer () {
      try {
        await promisic(wx.openCustomerServiceChat)({
          extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc1e69e0f1c8a60125'},
          corpId: 'ww9e69cac7ccaa1f39',
        })
      } catch (err) {
        console.log('err', err)
      }

    },

  }
})

import { getUserInfo, promisic } from '../../../utils/util'
import { checkFrontPower } from '../../../models/util'

// components/user/card-company/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    company: {
      type: Object,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    companyid: 0,
  },
  lifetimes: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    async onSkip () {
      console.log('company', this.properties.company)
      if(!this.properties.company) {
        const { confirm = false } = await wx.showModal({
          title: '提示',
          content: '开通服务账号接收管理订单',
          confirmText: '去开通',
        })
        if(confirm) {
          this.triggerEvent('open', {}, {})
        }
      } else {
        wx.showToast({
          title: '订单接收、收款、管理功能即将上线',
          icon: 'none'
        })
      }
    },
  }
})

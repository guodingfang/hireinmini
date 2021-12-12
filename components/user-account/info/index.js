import { storageGet, storageSet } from '../../../utils/storage'
import { getUserInfo } from '../../../utils/util'

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
    async onSkip(e) {
      const { type = '' } = e.currentTarget.dataset
      if (!type) return
      const { authenticationstatus = '0' } = getUserInfo(['authenticationstatus'])
      if (type === 'withdraw' && authenticationstatus === '0') {
        const { confirm = false } = await wx.showModal({
          title: '进行认证',
          content: '提现请先认证',
          confirmText: '认证',
        })
        if(confirm) {
          wx.navigateTo({
            url: '/pages/user-authentication/user-authentication',
          })
          return
        }
        return
      }
      wx.navigateTo({
        url: `/pages/${type}/${type}`,
      })
    },

    onPassWord () {
      wx.navigateTo({
        url: `/pages/wallet-password/wallet-password`,
      })
    }
  }
})

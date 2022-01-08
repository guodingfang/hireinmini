import { getCoupon } from '../../../models/vip'
import { receiveCoupons } from '../../../models/user'
import { isLogin } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModel: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        newVal && this.setData({
          animateShow: true
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    animateShow: false
  },

  lifetimes: {
    ready () {
      this.getCoupon()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getCoupon () {
      const { data = [], errcode } = await getCoupon({})
      if(errcode === 0) {
        this.setData({
          list: data.map(item => ({...item, price: parseFloat(item.denomination)}))
        })
      }
    },
    async onDraw () {
      const login = isLogin()
      if(!login) return
      const { list = [] } = this.data
      for (let [index, item] of list.entries()) {
        await receiveCoupons({
          couponid: item.id
        })
      }
      wx.showToast({
        title: '领取成功',
        icon: 'none'
      })
      this.setData({
        animateShow: false,
      });
      setTimeout(() => {
        this.triggerEvent('draw', {}, {})
      }, 400)
    },
    onClose () {
      this.setData({
        animateShow: false,
      });
      setTimeout(() => {
        this.triggerEvent('draw', {}, {})
      }, 400)
    }
  }
})

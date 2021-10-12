import { isLogin } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
    },
    isHaveInterest: {
      type: Boolean,
      value: false
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
    onSkipUserAccount(e) {
      const login = isLogin()
      if(!login) return
      const { userid } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userid}`
      })
    }
  }
})

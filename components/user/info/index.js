import { isLogin } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userinfo: {
      type: Object,
      value: null,
      observer(newVal) {

      }
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
    onPortraitError(err) {
      console.log(err)
    },
    onPortraitLoad(e) {
      console.log('e', e)
    },
    onSkipContent() {
      const login = isLogin()
      if(!login) return
      const { userinfo } = this.properties
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userinfo.userid}`,
      })
    },
    onSetup() {
      const login = isLogin()
      if(!login) return
      wx.navigateTo({
        url: `/pages/set-up/set-up`,
      })
    }
  }
})

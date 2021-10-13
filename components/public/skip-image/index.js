import { isLogin } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    url: String,
    width: {
      type: Number,
      value: 0,
    },
    height: {
      type: Number,
      value: 0,
    },
    radius: {
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
    onSkip() {
      const login = isLogin()
      if(!login) return
      const { url } = this.properties;
      this.triggerEvent('skip', {}, {});
      if (url) {
        wx.navigateTo({ url })
      }
    }
  }
})

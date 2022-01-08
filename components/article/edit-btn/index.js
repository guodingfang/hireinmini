import { isLogin } from '../../../utils/util'

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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSkipAnswer() {
      const login = isLogin()
      if(!login) return
      this.triggerEvent('answer', {}, {})
    }
  }
})

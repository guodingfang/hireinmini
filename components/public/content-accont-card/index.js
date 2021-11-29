import { addAttention } from '../../../models/user'
import { isAFocusB } from '../../../models/user'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer(val) {
        val && this.isAFocusB()
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
    async isAFocusB() {
      const { userid: targetuserid } = this.properties.info
      const { focused } = await isAFocusB({
        targetuserid
      })
      this.setData({
        isAttention: focused === 1
      })
    },

    onSkipAccont() {
      const { userid =  '' } = this.properties.info;
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userid}`
      })
    },
    async onAttention() {
      const { isAttention } = this.data
      const { userid: targetuserid } = this.properties.info
      await addAttention({
        targetuserid,
        focused: isAttention ? 0 : 1
      })
      this.setData({
        isAttention: !isAttention
      })
    }
  }
})

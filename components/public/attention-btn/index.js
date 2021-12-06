import { addAttention } from '../../../models/user'
import { isAFocusB } from '../../../models/user'
import { getUserInfo } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userid: {
      type: String,
      value: '',
      observer(val) {
        if(val) {
          const { userid } = getUserInfo(['userid'])
          if(userid === val) {
            this.setData({
              showAttentionBtn: false
            })
          }
          this.isAFocusB()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showAttentionBtn: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async isAFocusB() {
      const { focused } = await isAFocusB({
        targetuserid: this.properties.userid
      })
      this.setData({
        isAttention: focused === 1
      })
    },
    async onAttention() {
      const { isAttention } = this.data
      await addAttention({
        targetuserid: this.properties.userid,
        focused: isAttention ? 0 : 1
      })
      this.setData({
        isAttention: !isAttention
      })
    }
  }
})

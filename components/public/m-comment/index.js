import { trim } from '../../../utils/util'

// components/public/m-comment/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentShow: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '请输入评论内容'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.setData({
        commentShow: false
      })
    },
    onInput(e) {
      this.setData({
        value: e.detail.value
      })
    },
    onSend(e) {
      const { value } = this.data;
      if (trim(value) === '') {
        wx.showToast({
          title: '请输入评论内容',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('send', {
        value: trim(value)
      }, {})
      this.onClose()
    }
  }
})

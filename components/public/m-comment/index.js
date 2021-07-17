import { fa } from "../../../utils/pinYin";

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
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    onSend(e) {
      const { value } = this.data;
      if (this.trim(value) === '') {
        wx.showToast({
          title: '请输入评论内容',
        })
        return
      }
      this.triggerEvent('send', {
        value: this.trim(value)
      }, {})
      this.onClose()
    }
  }
})

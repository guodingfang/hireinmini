
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '请输入钱包密码'
    },
    showPay: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        newVal && this.setData({
          animateShow: true,
        })
      }
    },
    showFooter: {
      type: Boolean,
      value: true,
    },
    passEmpty: {
      type: Boolean,
      observer: function (newVal, oldVal, changedPath) {
        newVal && this.onPassEmpty()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animateShow: false,
    codeList: Array.apply(null, new Array(6)).map(v => ''),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入监控
    onChange(event) {
      const code = event.detail.value
      let codeList = code.padEnd(6, ' ').split('')
      const index = codeList.indexOf(' ')
      codeList = codeList.map((item, _index) => (_index < index - 1) ? '*' : item)
      this.setData({
        code,
        codeList,
      });
      if (code.length === 6) {
        this.onChecking();
      }
    },
    // 关闭
    onClose(event) {
      this.triggerEvent('close', {}, {})
      setTimeout(() => {
        this.onPassEmpty()
      }, 500)
    },
    // 输入完成后出发
    onChecking(event) {
      const { code } = this.data;
      this.triggerEvent('checking', { code }, {});
    },
    // 忘记密码
    onForgetPassword() {
      this.triggerEvent('forget', {}, {});
      setTimeout(() => {
        this.onPassEmpty()
      }, 500)
    },
    onPassEmpty() {
      this.setData({
        code: '',
        codeList: Array.apply(null, new Array(6)).map(v => ''),
      })
      this.triggerEvent('empty', {}, {})
    }
  }
})

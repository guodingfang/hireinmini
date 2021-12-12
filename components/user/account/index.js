
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderaudit: {
      type: Boolean,
      value: true
    },
    ordernumbers: {
      type: Number,
      value: 0
    },
    userinfo: {
      type: Object,
      value: null
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
    async onSkipAccountDetails(e) {
      const { type } = e.currentTarget.dataset
      const { userinfo } = this.properties
      if (type === 'withdraw' && userinfo && userinfo.authenticationstatus === '0') {
        const { confirm = false } = await wx.showModal({
          title: '进行认证',
          content: '提现请先认证',
          confirmText: '认证',
        })
        if(confirm) {
          wx.navigateTo({
            url: '/pages/user-authentication/user-authentication',
          })
          return
        }
        return
      }

      wx.navigateTo({
        url: `/pages/${type}/${type}`,
      })
    }
  }
})

// components/public/publish-nav/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModel: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        newVal && this.setData({
          animateShow: true,
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animateShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSkipDemand () {
      wx.navigateTo({
        url: '/pages/demand-order/demand-order',
      })
      setTimeout(() => {
        this.onClose()
      }, 400)
    },
    onSkipConsult () {
      wx.navigateTo({
        url: '/pages/article-publish/article-publish',
      })
      setTimeout(() => {
        this.onClose()
      }, 400)
    },
    onSkipDynamic () {
      wx.navigateTo({
        url: '/pages/publish/publish',
      })
      setTimeout(() => {
        this.onClose()
      }, 400)
    },
    onClose () {
      this.setData({
        animateShow: false,
      });
      setTimeout(() => {
        this.triggerEvent('close', {}, {})
      }, 400);
    }
  }
})

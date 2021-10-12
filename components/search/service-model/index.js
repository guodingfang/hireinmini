import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSkipService(e) {
      const { companyid } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/service-account/service-account?companyid=${companyid}`,
      })
    },
  }
})

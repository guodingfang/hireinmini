
// components/account/user-info/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCurrentUser: {
      type: Boolean,
      value: false,
    },
    userinfo: {
      type: Object,
      value: null,
    },
    company: {
      type: Object,
      value: null,
      observer() {
        this.getCompany()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    skipCompanyUrl: '/pages/company-setup/company-setup',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCompany() {
      const { company } = this.properties
      if(company) {
        this.setData({
          skipCompanyUrl: `/pages/service-account/service-account?companyid=${company.companyid}`
        })
      } else {
        this.setData({
          skipCompanyUrl: '/pages/company_select/company_select'
        })
      }
    },
    onInterflow() {
      wx.showToast({
        title: '暂未开通，敬请期待',
        icon: 'none'
      })
    },
    onApproveCompany() {
      wx.showToast({
        title: '暂未开通，敬请期待',
        icon: 'none'
      })
    }
  }
})

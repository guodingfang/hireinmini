
import { addAttention } from '../../../models/user'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCurrentUser: {
      type: Boolean,
      value: false,
    },
    isAttention: {
      type: Boolean,
      value: false
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
    skipCompanyUrl: '',
    showModel: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCompany() {
      const { company } = this.properties
      this.setData({
        skipCompanyUrl: company 
          ? `/pages/service-account/service-account?companyid=${company.companyid}`
          : ''
      })
    },
    async onAttention() {
      const { userinfo, isAttention } = this.properties
      const { userid: targetuserid, focused } = userinfo
      await addAttention({
        targetuserid,
        focused: isAttention ? 0 : 1
      })
      this.setData({
        isAttention: !isAttention
      })
    },
    onSetUp() {
      wx.navigateTo({
        url: `/pages/set-up/set-up`,
      })
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
    },
      
    onSelectCompany() {
      const { skipCompanyUrl } = this.data
      if(skipCompanyUrl) return
      this.setData({
        showModel: true
      })
    },

    onOpenCompany() {
      wx.navigateTo({
        url: '/pages/company-setup/company-setup',
      })
      this.setData({
        showModel: false
      })
    },

    onAddCompany() {
      wx.navigateTo({
        url: '/pages/search-company/search-company',
      })
      this.setData({
        showModel: false
      })
    },

    onCloseModel() {
      this.setData({
        showModel: false
      })
    },
  }
})

import { getUserInfo, promisic } from '../../../utils/util'
import { checkFrontPower } from '../../../models/util'

// components/user/card-company/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    companyid: 0,
  },
  lifetimes: {
    attached: function() {
      const { companyid = 0 } = getUserInfo(['companyid'])
      this.setData({
        companyid,
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async onSkipCompany() {
      const { companyid } = this.data
      if(companyid === 0) {
        wx.navigateTo({
          url: '/pages/company_select/company_select',
        })
        return
      }
      const { result = false } = await checkFrontPower({
        url: 'company-manage',
      })
      if(result) {
        wx.navigateTo({
          url: `/pages/companydetails/companydetails?typeid=1&companyid=${companyid}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/companydetails/companydetails?typeid=2&companyid=${companyid}`,
        })
      }
    },
    async onSkipClient() {
      const { companyid } = this.data
      if(companyid === 0) {
        const { confirm } = await promisic(wx.showModal)({
          title: '提示',
          content: '请先创建或绑定公司',
        })
        if(!confirm) return
        const { result } = await checkFrontPower({
          url: 'company_select',
        })
        if(result) {
          wx.navigateTo({
            url: '/pages/company_select/company_select',
          })
        }
        return
      }
      const { result } = await checkFrontPower({
        url: 'client',
      })
      if(result) {
        wx.navigateTo({
					url: '/pages/client/client',
				})
      }
    },
    async onMemberManage() {
      const { companyid } = this.data
      if(companyid === 0) {
        const { confirm } = await promisic(wx.showModal)({
          title: '提示',
          content: '请先创建或绑定公司',
        })
        if(!confirm) return
        const { result } = await checkFrontPower({
          url: 'company_select',
        })
        if(result) {
          wx.navigateTo({
            url: '/pages/company_select/company_select',
          })
        }
        return
      } 
      const { result = false } = await checkFrontPower({
        url: 'member_manage',
      })
      if(result) {
        wx.navigateTo({
					url: '/pages/member_manage/member_manage',
				})
      }
    }
  }
})

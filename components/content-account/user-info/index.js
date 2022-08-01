
import { addAttention } from '../../../models/user'
import { remoteImagesUrl } from '../../../config'
import { promisic } from '../../../utils/util'
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
      observer(val) {
        if(val && val.userid) {
          this.setData({
            admin: this.properties.userinfo.userid === '3592'
          })
          this.getProfileStatus()
        }
      }
    },
    company: {
      type: Object,
      value: null,
      observer() {
        this.getCompany()
      }
    }
  },

  lifetimes: {
    attached() {
      // this.getCompany()
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    admin: false,
    isLive: false,
    openServiceImg: `${remoteImagesUrl}/advert/open-service-account.png`,
    enterServiceImg: `${remoteImagesUrl}/advert/enter-service-account.png`,
    skipCompanyUrl: '',
    showModel: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getProfileStatus () {
      if(!this.data.admin) return
      try {
        const { status } = await promisic(wx.getChannelsLiveInfo)({
          finderUserName: 'sphmPpfHEhfWB4d',
        })
        this.setData({
          isLive: status === 2
        })
      } catch (err) {
        console.log('err', err)
      }
    },
    async openProfile () {
      if(!this.data.admin) return
      try {
        const res = await promisic(wx.openChannelsUserProfile)({
          finderUserName: 'sphmPpfHEhfWB4d',
        })
      } catch (err) {
        console.log('err', err)
      }
    },

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
      const { userid: targetuserid } = userinfo
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
      const { userinfo } = this.properties
      // wx.showToast({
      //   title: '即将开启，敬请期待',
      //   icon: 'none'
      // })
      wx.navigateTo({
        url: `/pages/message-detail/message-detail?rid=${userinfo.userid}`,
      })
    },
    onApproveCompany() {
      const { userinfo } = this.properties
      if(userinfo && userinfo.authenticationstatus === '0') {
        wx.navigateTo({
          url: '/pages/user-authentication/user-authentication',
        })
      }
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

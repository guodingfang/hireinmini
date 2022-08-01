import { judgeTabBarHeight, isLogin } from '../../utils/util'
import { getPageHeaderImage } from '../../models/util'
import { getUnPayCount } from '../../models/demand'
import { getUnReadMsgCount } from '../../models/user'
import config from '../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    curRoute: '',
    tabHeight: 100,
    paddingBottom: 0,
    showModel: false,
    bgImagesUrl: '',
    tabbar: {
      selectedColor: "#24262B",
      backgroundColor: "#ffffff",
      color: "#333",
      list: [
        {
          key: 'index',
          pagePath: "pages/index/index",
          iconPath: "/images/tab/index.png",
          selectedIconPath: "/images/tab/index-select.png",
          text: "发现"
        },
        {
          key: 'service',
          pagePath: "pages/service/service",
          iconPath: "/images/tab/service.png",
          selectedIconPath: "/images/tab/service-select.png",
          text: "服务"
        },
        {
          pagePath: "pages/service/service",
          iconPath: "/images/tab/release.png",
          text: "服务",
          custom: true,
          width: '84rpx',
          height: '70rpx',
        },
        {
          key: 'helper',
          pagePath: "pages/helper/helper",
          iconPath: "/images/tab/helper.png",
          selectedIconPath: "/images/tab/helper-select.png",
          text: "助手"
        },
        {
          key: 'user',
          pagePath: "pages/user/user",
          iconPath: "/images/tab/user.png",
          selectedIconPath: "/images/tab/user-select.png",
          text: "我的"
        }
      ]
    },
  },

  lifetimes: {
    attached() {
      this.getPageHeaderImage()
      const { tabHeight, paddingBottom } = judgeTabBarHeight();
      this.setData({
        tabHeight,
        paddingBottom,
      })
    },
  },

  pageLifetimes: {
    show() {
      this.getPageHeaderImage()
      let pages = getCurrentPages();
      this.setData({
        curRoute: pages[pages.length - 1].route
      });
      this.getAmount()
    },
    // hide() {
    //   this.setData({
    //     curRoute: ''
    //   });
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getAmount () {
      const { msgcount } = await getUnReadMsgCount()
      const { unpay } = await getUnPayCount()
      
      const tabbar = {
        ...this.data.tabbar,
          list: this.data.tabbar.list.map(tab => tab.key === 'user' ? {
          ...tab,
          isTips: (msgcount > 0 || unpay > 0),
        } : tab)
      }
      this.setData({
        tabbar
      })
    },
    async getPageHeaderImage () {
      const { data, errcode } = await getPageHeaderImage({
        pagename: 'navigator'
      })
      if(errcode === 0 && data && data.picurl) {
        this.setData({
          bgImagesUrl: `${config.imgUrl}${data.picurl}`
        })
      } else {
        this.setData({
          bgImagesUrl: ''
        })
      }
    },
    onCloseModel () {
      this.setData({
        showModel: false
      })
    },
    redirectTo(e) {
      let { taburl } = e.currentTarget.dataset;
      if (taburl === this.data.curRoute) return
      wx.switchTab({
        url: `/${taburl}`,
      })
    },
    onSkipCustom() {
      const login = isLogin()
      if(!login) return
      this.setData({
        showModel: true
      })
      // wx.navigateTo({
      //   url: '/pages/publish/publish',
      // })
    }
  }
})

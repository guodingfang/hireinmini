import { judgeTabBarHeight, isLogin } from '../../utils/util'
import { getPageHeaderImage } from '../../models/util'
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
          pagePath: "pages/index/index",
          iconPath: "/images/tab/index.png",
          selectedIconPath: "/images/tab/index-select.png",
          text: "发现"
        },
        {
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
          pagePath: "pages/helper/helper",
          iconPath: "/images/tab/helper.png",
          selectedIconPath: "/images/tab/helper-select.png",
          text: "助手"
        },
        {
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

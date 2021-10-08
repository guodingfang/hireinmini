import { judgeTabBarHeight } from '../../utils/util'

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
    tabHeight: 100,
    paddingBottom: 0,
  },

  lifetimes: {
    attached() {
      const { tabHeight, paddingBottom } = judgeTabBarHeight();
      this.setData({
        tabHeight,
        paddingBottom,
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

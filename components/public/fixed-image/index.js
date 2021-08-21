import { judgeTabBarHeight } from '../../../utils/util';

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  lifetimes: {
    attached() {
      const { workInfo } = app.globalData;
      const {
        tabHeight,
      } = judgeTabBarHeight(workInfo);
      this.setData({
        tabHeight,
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

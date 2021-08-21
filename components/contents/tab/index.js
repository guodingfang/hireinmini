const app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fixed: {
      type: Boolean,
      value: false
    },
    list: {
      type: Array,
      value: [],
    },
    height: {
      type: Number,
      value: 80,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  
  lifetimes: {
    attached() {
      const { statusBarHeight, headerTopHeader, headerSearchHeader } = app.globalData;
      console.log(' statusBarHeight, headerTopHeader, headerSearchHeader ',  statusBarHeight, headerTopHeader, headerSearchHeader )
      this.setData({
        headerBlock: statusBarHeight + headerTopHeader + headerSearchHeader - 2
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectTab(e) {
      const { type = '' } = e.target.dataset
      if(type) {
        this.triggerEvent('select', { type }, {})
      }
    }
  }
})

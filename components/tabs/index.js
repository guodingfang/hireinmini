const app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer() {
        this.initTabList()
      }
    },
    top: {
      type: Number,
      value: 0,
    },
    tabHeight: {
      type: Number,
      value: 90
    },
    openScrollControl: {
      type: Boolean,
      value: false,
    },
    isScroll: {
      type: Boolean,
      value: true,
      observer() {
        this.getScrollInfo()
      }
    },
    tabsBgColor: {
      type: String,
      value: '#ffffff'
    },
    tabColor: {
      type: String,
      value: '#808080'
    },
    tabSelectColor: {
      type: String,
      value: '#1A1A1A'
    },
    backgroundColor: {
      type: String,
      value: '#ffffff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [],  // tab分类
    current: 0,   // 当前tab
    screenWidth: 0, // 屏幕宽度
    tabWidth: 0,  // 一个tab宽度
    sLeft: 0, // tab 滚动
    allowScroll: true,  // 允许内容滚动
    scrollTop: 0, // 滚动距离
  },
  lifetimes: {
    ready() {
      this.getTabWidth()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getScrollInfo() {
      const { isScroll } = this.properties
      if(!isScroll) {
        this.setData({
          scrollTop: 0,
        })
      }
      setTimeout(() => {
        this.setData({
          allowScroll: isScroll
        })
      }, 0)
    },
    getTabWidth() {
      const { screenWidth = 0 } = app.globalData.workInfo
      this.setData({ screenWidth })
      const query = wx.createSelectorQuery().in(this)
      query.select('.tab-item').boundingClientRect((element) => {
        if (element) {
          this.setData({
            tabWidth: element.width || 100
          })
        }
      }).exec()
    },
    initTabList() {
      const { list } = this.properties
      const { current } = this.data
      list[current] = {
        ...list[current],
        select: true
      }
      console.log('list', list)
      this.setData({
        tabList: list
      })
    },
    onSelectTab(e) {
      const { index } = e.target.dataset
      this.setData({ current: index })
    },
    onSwiperChange(e) {
      const { current } = e.detail
      let type = ''
      const tabList = this.data.tabList.map((tab, index) => {
        if (index ===  current) {
          type = tab.type || ''
          return  {...tab, select: true}
        } else {
          return { ...tab, select: false}
        }
      })
      const { tabWidth, screenWidth } = this.data
      const sLeft = current * tabWidth - screenWidth / 2 + tabWidth / 2

      this.setData({ tabList, sLeft, current })
      this.isSelectType(type)
    },
    
    isSelectType(type) {
      this.triggerEvent('select', { type }, {})
    }
  }
})

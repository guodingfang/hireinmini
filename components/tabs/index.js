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
    defaultIndex: {
      type: Number,
      value: 0,
      observer(val) {
        val && this.setData({
          current: val
        })
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
    tabElement: [], // tab Dom数据
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
      query.selectAll('.tab-item').boundingClientRect((element) => {
        if (element) {
          this.setData({
            tabElement: element,
          })
          this._change()
        }
      }).exec()
    },
    initTabList() {
      const { list } = this.properties
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
      this.setData({
        current
      })
      this._change()
    },

    _change() {
      const { current } = this.data
      let type = ''
      const tabList = this.data.tabList.map((tab, index) => {
        if (index ===  current) {
          type = tab.type || ''
          return  {...tab, select: true}
        } else {
          return { ...tab, select: false}
        }
      })
      const { tabElement, screenWidth } = this.data
      const sLeft = tabElement[current].left - screenWidth / 2 + tabElement[current].width / 2
      this.setData({ tabList, sLeft, current })
      this.isSelectType(type)
    },
    
    isSelectType(type) {
      this.triggerEvent('select', { type }, {})
    }
  }
})

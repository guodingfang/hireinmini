// components/tool/truss-compute-model/index.js
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
    type: 'haveTop',
    tabList: [{
      type: 'haveTop',
      name: '有顶棚',
      select: true
    }, {
      type: 'notHaveTop',
      name: '无顶棚'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectTab (e) {
      const { type } = e.detail
      if (type && type !== this.data.type) {
        this.setData({
          type,
          tabList: this.data.tabList.map(tab => tab.type === type 
            ? {...tab, select: true} 
            : {...tab, select: false}),
        })
      }
    },
  }
})

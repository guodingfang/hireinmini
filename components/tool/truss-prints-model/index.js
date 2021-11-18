// components/tool/truss-prints-model/index.js
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
    numList: ['包三面', '包四面', '包五面'],
    selectNum: '包三面',
    type: '1',
    tabList: [{
      type: '1',
      name: '宽6米内',
      select: true
    }, {
      type: '2',
      name: '宽6~10米'
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
    onSelectNum (e) {
      const { item } = e.target.dataset
      this.setData({
        selectNum: item
      })
    }
  }
})

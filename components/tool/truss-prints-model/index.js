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
    selectNum: '包三面'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectNum (e) {
      const { item } = e.target.dataset
      this.setData({
        selectNum: item
      })
    }
  }
})

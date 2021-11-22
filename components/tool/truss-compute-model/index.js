import { verifyData } from '../common.js'

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
        this.setData({
          amount: '',
          topArea: '',
          trigonumLength: '',
          trigonumHeight: '',
          topLength: '',
          topWidth: ''
        })
      }
    },

    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
    },

    onResult() {
      const {
        type = '',
        width = '',
        sideHeight = '',
        interiorHeight = '',
        verticalAmount = ''
      } = this.data

      const { verify } = verifyData(this.data, [
        { type: 'width', label: '正面宽度' },
        { type: 'sideHeight', label: '侧面高度' },
        { type: 'interiorHeight', label: '内部高度' },
        { type: 'verticalAmount', label: '立柱数量' },
      ])
      if (!verify) return

      let amount = '', topArea = ''
      let trigonumLength = '', trigonumHeight = ''
      let topLength = '', topWidth = ''

      if(type === 'haveTop') {
        amount = width * 2 + sideHeight * 3 + (+interiorHeight + 1) * verticalAmount + (+width + 3) * 2
        trigonumLength = +width + 1
        trigonumHeight = 3
        topLength = +width + 3
        topWidth = +sideHeight + 1
        topArea = trigonumLength * trigonumHeight * 2 + topLength * topWidth
      } else if (type === 'notHaveTop') {
        amount = width * 2 + sideHeight * 3 + (+interiorHeight + 1) * verticalAmount
      }

      this.setData({
        amount: amount,
        topArea: topArea,
        trigonumLength: trigonumLength,
        trigonumHeight: trigonumHeight,
        topLength: topLength,
        topWidth: topWidth
      })
    }
  }
})

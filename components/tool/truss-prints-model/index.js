import { verifyData } from '../../../utils/tool'
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
    typeList: ['包三面', '包四面', '包五面'],
    selectType: '包三面',
    type: 'six',
    tabList: [{
      type: 'six',
      name: '宽6米内',
      select: true
    }, {
      type: 'sixToTen',
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
    onSelectType (e) {
      const { item } = e.target.dataset
      this.setData({
        selectType: item
      })
    },

    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
    },

    // 计算结构
    onResult() {
      const {
        type = '',
        width = '',
        height = '',
        thickness = '',
        price = '',
        selectType = '',
      } = this.data

      const { verify } = verifyData(this.data, [
        { type: 'width', label: '宽度' },
        { type: 'height', label: '高度' },
        { type: 'thickness', label: '厚度' },
        { type: 'price', label: '单画面单价' },
        { type: 'selectType', label: '类型' },
      ])
      if (!verify) return

      // 计算
      let amount = '', area = '', totalPrice = ''

      if (type === 'six') {

        if(selectType === '包三面') {
          amount = width * 2 + height * 4 + thickness * 4
          area = (+width + thickness * 2 + 0.4) * (+height + 0.4)
          totalPrice = price * area
        } else if (selectType === '包四面') {
          amount = (+width + +height + +thickness) * 4
          area = (width * 2 + thickness * 2 + 0.4) * (+height + 0.4)
          totalPrice = price * area
        } else if (selectType === '包五面') {
          amount = (+width + +height + +thickness) * 4
          area = (width * 2 + thickness * 2 + 0.4) * (+height + 0.4) + width * thickness
          totalPrice = price * area
        }
      } else if (type === 'sixToTen') {
        if(selectType === '包三面') {
          amount = width * 2 + height * 5 + thickness * 4
          area = (+width + thickness * 2 + 0.4) * (+height + 0.4)
          totalPrice = price * area
        } else if (selectType === '包四面') {
          amount =  width * 4 + height * 6 + thickness * 6
          area = (width * 2 + thickness * 2 + 0.4) * (+height + 0.4)
          totalPrice = price * area
        } else if (selectType === '包五面') {
          amount =  width * 4 + height * 6 + thickness * 6
          area = (width * 2 + thickness * 2 + 0.4) * (+height + 0.4) + width * thickness
          totalPrice = price * area
        }
      }


      this.setData({
        amount: amount.toFixed(2),
        area: area.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      })
    }
  }
})

// components/public/pay-way/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectWay: {
      type: String,
      value: 'wechat',
    },
    haveWay: {
      type: Array,
      value: ['wechat'],
    },
    isUseWallet: {
      type: Boolean,
      value: true,
    }
  },
  options: {
    multipleSlots: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    wayText: {
      "wechat": "微信",
      "wallet": "嗨应钱包",
      "bank": "银行卡"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      const { type } = e.currentTarget.dataset
      if (type === 'wallet' && !this.properties.isUseWallet) return
      if(this.properties.selectWay === type) {
        return
      }
      this.triggerEvent('select', { type }, {})
    }
  }
})

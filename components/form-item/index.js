// components/form/item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {
        type: '',
        label: '标题',
        placeholder: '提示文字',
        value: '',
        require: false,
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputChange(e) {
      const { type } = e.currentTarget.dataset
      const { value } = e.detail
      this.triggerEvent('change', {
        type,
        value
      }, {})
    }
  }
})

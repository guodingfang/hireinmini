import { trim } from '../../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '搜索内容'
    },
    search: {
      type: String,
      value: 'block'
    },
    value: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: ''
    }
  },

  externalClasses: ['m-search'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e) {
      console.log('e', e.detail.value)
      const { value } = e.detail
      this.triggerEvent('change', {
        value
      }, {})
    },

    onSearch() {
      if(this.properties.search === 'input') return
      this.triggerEvent('search', {}, {})
    },

    onClear() {
      this.triggerEvent('clear', {}, {})
    }
  }
})


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityname: {
      type: String,
      value: '全国'
    }
  },

  externalClasses: ['m-location'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChangeLocation() {
      this.triggerEvent('change', {}, {})
    }
  }
})

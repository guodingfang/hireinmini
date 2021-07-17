// components/header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityname: String,
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
    onChangeLocation() {
      console.log('重选地址')
      wx.navigateTo({
        url: '/pages/citylist/citylist?rurl=index',
      })
    },
    onSearch() {
      console.log('搜索')
      wx.navigateTo({
        url: '/pages/searchgood/searchgood',
      })
    }
  }
})

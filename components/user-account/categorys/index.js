// components/user-account/categorys/index.js
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
    list: '12345',
    isModel: false,
    animateShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect () {
      if(this.data.isModel) {
        this.setData({
          animateShow: false,
        }),
        setTimeout(() => {
          this.setData({
            isModel: false,
          })
        }, 400)
      } else {
        this.setData({
          animateShow: true,
          isModel: true,
        })
      }

    }
  }
})

import config from '../../../config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer(val = []) {
        this.setData({
          categorys: [{
            balancetype: '',
            dicvalue: '全部'
          }, ...val]
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    categorys: [],
    imgUrl: config.imgUrl,
    isModel: false,
    animateShow: false,
    selectCategoryName: '全部',
    selectCategory: '',
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
    },
    onSelectCategory(e) {
      const { type = '', name = '全部' } = e.currentTarget.dataset
      this.setData({
        selectCategory: type,
        selectCategoryName: name
      })
      this.onSelect()
      this.triggerEvent('select', { type }, {})
    }
  }
})

// components/tool/scal-model/index.js
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
    // 比例计算
    scalList: [
      { id: 1, name: '4:3', select: true },
      { id: 2, name: '16:9' },
      { id: 3, name: '16:10' }
    ],
    scaleWidth: '',
    scaleHeight: '',
    
    // 其他计算
    dpiWidth: '',
    dpiHeight: '',
    ledWidth: '',
    ledHeight: '',
    aWidth: '',
    aHeight: '',
    bWidth: '',
    bHeight: '',
    cWidth: '',
    cHeight: '',
    // 计算结果
    aWidthPixel: '',
    aHeightPixel: '',
    bWidthPixel: '',
    bHeightPixel: '',
    cWidthPixel: '',
    cHeightPixel: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变比例
    selectScalType(e) {
      const { id } = e.target.dataset
      this.setData({
        scalList: this.data.scalList.map(item => item.id === id
          ? {...item, select: true}
          : {...item, select: false})
      })
      this.computeScaleResult('tab')
    },
    // 参考比例动态计算
    onScaleInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
      this.computeScaleResult(type)
    },
    // 计算比例结果
    computeScaleResult(type) {
      const { scalList = [], scaleWidth = '',  scaleHeight = '' } = this.data
      const selectTab = scalList.find(item => item.select).name
      const [_width, _height] = selectTab.split(':')
      if (type === 'scaleWidth') {
        this.setData({
          scaleHeight: scaleWidth ? (_height / _width * scaleWidth).toFixed(3) : ''
        })
      } else if(type === 'scaleHeight') {
        this.setData({
          scaleWidth: scaleHeight ? (_width / _height * scaleHeight).toFixed(3) : ''
        })
      } else if(type === 'tab') {
        if(scaleWidth || scaleHeight) {
          this.setData({
            scaleHeight: scaleWidth ? (_height / _width * scaleWidth).toFixed(3) : ''
          })
        }
      }
    },

    // 动态获取input值
    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
      this.computeResult()
    },

    computeResult() {
      const { dpiWidth = '', dpiHeight = '', ledWidth = '', ledHeight = '', aWidth = '', aHeight = '', bWidth = '', bHeight = '', cWidth ='', cHeight = '' } = this.data
      
      // A计算
      if(aWidth && dpiWidth && ledWidth) {
        this.setData({
          aWidthPixel: (aWidth / dpiWidth * ledWidth).toFixed(3)
        })
      } else {
        this.setData({
          aWidthPixel: ''
        })
      }

      if(aHeight && dpiHeight && ledHeight) {
        this.setData({
          aHeightPixel: (aHeight / dpiHeight * ledHeight).toFixed(2)
        })
      } else {
        this.setData({
          aHeightPixel: ''
        })
      }
      
      // B计算
      if(bWidth && dpiWidth && ledWidth) {
        this.setData({
          bWidthPixel: (bWidth / dpiWidth * ledWidth).toFixed(3)
        })
      } else {
        this.setData({
          bWidthPixel: ''
        })
      }

      if(bHeight && dpiHeight && ledHeight) {
        this.setData({
          bHeightPixel: (bHeight / dpiHeight * ledHeight).toFixed(2)
        })
      } else {
        this.setData({
          bHeightPixel: ''
        })
      }

       // C计算
       if(cWidth && dpiWidth && ledWidth) {
        this.setData({
          cWidthPixel: (cWidth / dpiWidth * ledWidth).toFixed(3)
        })
      } else {
        this.setData({
          cWidthPixel: ''
        })
      }

      if(cHeight && dpiHeight && ledHeight) {
        this.setData({
          cHeightPixel: (cHeight / dpiHeight * ledHeight).toFixed(2)
        })
      } else {
        this.setData({
          cHeightPixel: ''
        })
      }

    }
  }
})

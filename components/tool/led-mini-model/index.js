import { getMiniLedSpacing } from '../../../models/util'
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
    spaceList: [],
    selectSpace: '',
    specList: [],
    pixel: '',
    point: '',
    spaceWidth: 600,
    spaceHeight: 337.5,
    xCorss: '',
    yCorss: '',
  },

  lifetimes: {
    ready() {
      this.getMiniLedSpacing()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getMiniLedSpacing() {
      const specList = await getMiniLedSpacing()
      this.setData({
        specList,
      })
    },
    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
      if(type === 'spaceWidth' || type === 'spaceHeight' || type === 'selectSpace') {
        this.computeSelectResult()
      }
      this.computeResult()
    },
    computeResult() {
      const { spaceWidth = 0, spaceHeight = 0, selectSpace = 0, xCorss = 0, yCorss = 0 } = this.data
      if (selectSpace) {
        const widthPoint = spaceWidth && xCorss ? (spaceWidth / selectSpace * xCorss).toFixed(0) : ''
        const heightPoint = spaceHeight && yCorss ? (spaceHeight / selectSpace * yCorss).toFixed(0) : ''
        this.setData({
          widthPoint,
          heightPoint,
          areaPoint: widthPoint && heightPoint ? widthPoint * heightPoint : '',
        })
      } else {
        this.setData({
          widthPoint: '',
          heightPoint: '',
          areaPoint: '',
        })
      }

    },
    onSelectSpecTab(e) {
      const { type, spaceheight, spacewidth, index } = e.currentTarget.dataset
      const { specList } = this.data
      this.setData({
        [type]: index,
        spaceHeight: spaceheight,
        spaceWidth: spacewidth,
        spaceList: specList[index].spacing
      })
      this.computeSelectResult()
    },
    onSelectTab(e) {
      const { item, type } = e.currentTarget.dataset
      this.setData({
        [type]: item
      })
      this.computeSelectResult()
    },
    computeSelectResult() {
      const { selectSpace, spaceWidth = 0, spaceHeight = 0 } = this.data
      if(selectSpace) {
        const pixel = Math.pow(1000 / selectSpace, 2)
        const point = `${(spaceWidth / selectSpace).toFixed(0)} * ${(spaceHeight / selectSpace).toFixed(0)}`
        this.setData({
          pixel: pixel.toFixed(2),
          point: spaceWidth && spaceHeight ? point : '',
        })
      } else {
        this.setData({
          pixel: '',
          point: '',
        })
      }
    }
  }
})

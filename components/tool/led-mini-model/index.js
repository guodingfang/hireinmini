import { getMiniLedSpacing } from '../../../models/tool'
import { verifyData } from '../../../utils/tool'
import { judgeVip } from '../../../utils/util'
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
        // this.computeSelectResult()
      }
      // this.computeResult()
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

      // this.computeSelectResult()
    },
    onSelectTab(e) {
      const { item, type } = e.currentTarget.dataset
      this.setData({
        [type]: item
      })
      // this.computeSelectResult()
    },

    async onResult () {
      const { verify } = verifyData(this.data, [
        { type: 'spaceWidth', label: '宽度' },
        { type: 'spaceHeight', label: '高度' },
        { type: 'selectSpace', label: '间距' },
        { type: 'xCorss', label: '横向块数' },
        { type: 'yCorss', label: '纵向块数' },
      ])
      if (!verify) return

      const isVip = await judgeVip()
      if(!isVip) return

      this.computeSelectResult(),
      this.computeResult()
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
    },
    computeResult() {
      const { spaceWidth = 0, spaceHeight = 0, selectSpace = 0, xCorss = 0, yCorss = 0} = this.data
      if (selectSpace) {
        const widthPoint = spaceWidth && xCorss ? (spaceWidth / selectSpace * xCorss).toFixed(0) : ''
        const heightPoint = spaceHeight && yCorss ? (spaceHeight / selectSpace * yCorss).toFixed(0) : ''
        const width = spaceWidth && xCorss ? (spaceWidth * xCorss / 1000).toFixed(2) : ''
        const height = spaceHeight && yCorss ? (spaceHeight * yCorss / 1000).toFixed(2) : ''
        this.setData({
          widthPoint,
          heightPoint,
          width,
          height,
          area: height && width ? (height * width).toFixed(2) : '',
          areaPoint: widthPoint && heightPoint ? widthPoint * heightPoint : '',
        })
      } else {
        this.setData({
          widthPoint: '',
          heightPoint: '',
          areaPoint: '',
          width: '',
          height: '',
        })
      }
    },
  }
})

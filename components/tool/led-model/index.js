import { getSpacingList, getSpecList } from '../../../models/tool'
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
    specList: [],
    screenRatioList: ['4:3', '16:9', '16:10'],
    selectScreen: '4:3',
    selectSpaceId: '',
    selectSpecId: '',
    pixel: '',
    point: '',
    width: '',
    height: '',
    widthPoint: '',
    heightPoint: '',
    areaPoint: '',
    area: '',
    widthBlock: '',
    heightBlock: '',
    sumBlock: '',
    screenWidth: '',
    screenHeight: '',
  },

  lifetimes: {
    ready() {
      this.getSpacingList()
      this.getSpecList()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getSpacingList() {
      const spaceList = await getSpacingList({})
      this.setData({
        spaceList,
      })
    },
    async getSpecList() {
      const specList = await getSpecList({})
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
      this.computeResult()
    },
    computeResult() {
      const { width, height, spaceList = [], specList = [], selectSpaceId = '', selectSpecId = '' } = this.data
      const space = spaceList.find(item => item.id ===  selectSpaceId)
      const spec = specList.find(item => item.id ===  selectSpecId)
      if (width && height) {
        this.setData({
          area: width * height
        })
        if(space) {
          this.setData({
            widthPoint: width * space.pointperunit,
            heightPoint: height * space.pointperunit,
            areaPoint: (width * space.pointperunit) * (height * space.pointperunit),
          })
        } else {
          this.setData({
            widthPoint: '',
            heightPoint: '',
            areaPoint: '',
          })
        }
        if(spec) {
          this.setData({
            widthBlock: (width / (spec.width_spec / 1000)).toFixed(2),
            heightBlock: (height / (spec.height_spec / 1000)).toFixed(2),
            sumBlock: ((width / (spec.width_spec / 1000)) * (height / (spec.height_spec / 1000))).toFixed(2)
          })
        } else {
          this.setData({
            widthBlock: '',
            heightBlock: '',
            sumBlock: '',
          })
        }
      } else {
        this.setData({
          widthPoint: '',
          heightPoint: '',
          areaPoint: '',
          area: '',
          widthBlock: '',
          heightBlock: '',
          sumBlock: '',
        })
      }
    },
    onSelectTab(e) {
      const { id, type } = e.currentTarget.dataset
      if(!id) return
      this.setData({
        [type]: id
      })
      this.computeSelectResult()
    },
    computeSelectResult() {
      const { spaceList = [], specList = [], selectSpaceId = '', selectSpecId = '' } = this.data
      if(selectSpaceId) {
        const space = spaceList.find(item => item.id ===  selectSpaceId)
        this.setData({
          pixel: space ? space.pixeldensity : ''
        })
      } else {
        this.setData({
          pixel: ''
        })
      }
      if(selectSpaceId && selectSpecId) {
        const space = spaceList.find(item => item.id ===  selectSpaceId)
        const spec = specList.find(item => item.id ===  selectSpecId)
        this.setData({
          point: space && spec ? `${spec.width_spec / 1000 * space.pointperunit}*${spec.height_spec / 1000 * space.pointperunit}` : ''
        })
      } else {
        this.setData({
          point: ''
        })
      }
      this.computeResult()
    },

    onSelectScreenRatio(e) {
      this.setData({
        selectScreen: e.currentTarget.dataset.item
      })
    },

    onInputScreenChange(e) {
      const { type } = e.currentTarget.dataset
      const { value } = e.detail
      this.setData({
        [type]: value
      })
      this.computeScreenResult(type)
    },
    
    computeScreenResult(type) {
      const { screenHeight, screenWidth, selectScreen } = this.data
      const [_widthRate, _heightRate] = selectScreen.split(':')
      if(type === 'screenHeight') {
        if(screenHeight) {
          this.setData({
            screenWidth: (screenHeight / _heightRate *_widthRate).toFixed(2)
          })
        } else {
          this.setData({
            screenWidth: ''
          })
        }
      } else if(type === 'screenWidth') {
        if(screenWidth) {
          this.setData({
            screenHeight: (screenWidth / _widthRate * _heightRate).toFixed(2)
          })
        } else {
          this.setData({
            screenWidth: ''
          })
        }
      }
    }
  }
})

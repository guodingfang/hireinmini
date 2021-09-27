// components/tool/projection-model/index.js
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
    rateList: ['4:3', '16:9', '16:10'],
    selectRate: '4:3',
    tabList: [{
      type: 'dist',
      name: '投影距离',
      select: true
    }, {
      type: 'size',
      name: '画面尺寸'
    }],
    type: 'dist',
    transformRatio: 0.0254,
    width: '',
    height: '',
    screenSize: '',
    dist: '',
    percent: '',

    // 下方计算
    min: '',
    max: '',
    size: '',
    projectDist: '',
    projectSize: '',
    minPicture: '',
    maxPicture: '',
    minDist: '',
    maxDist: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectRate(e) {
      const { item } = e.target.dataset
      this.setData({
        selectRate: item
      })
      this.formula()
      this.computeResult()
    },
    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
      if(type === 'screenSize') {
        this.formula()
        // this.computeResult()
        return
      }
      if(type === 'percent' || type === 'dist') {
        this.computePercentAndDistResult(type)
        return
      }
      this.computeResult()
    },
    formula() {
      const { screenSize = '', selectRate = '', transformRatio = 0 } = this.data
      if (screenSize && selectRate) {
        const [_widthRate, _heightRate] = selectRate.split(':')
        const width = screenSize * transformRatio* Math.sqrt(1 / (1 + Math.pow((_heightRate / _widthRate), 2)))
        const height = screenSize * transformRatio* Math.sqrt(1 / (1 + Math.pow((_widthRate / _heightRate), 2)))
        this.setData({
          width: width.toFixed(2),
          height: height.toFixed(2),
        })
      } else {
        this.setData({
          width: '',
          height: '',
        })
      }
    },
    computePercentAndDistResult(type) {
      const { percent = '', dist = '', width = '' } = this.data
      if(width) {
        if(type === 'percent') {
          this.setData({
            dist: percent ? (percent * width).toFixed(2) : ''
          })
        } else {
          this.setData({
            percent: dist ? (dist / width).toFixed(2) : ''
          })
        }
      } else {
        this.setData({
          percent: '',
          dist: '',
        })
      }
    },
    onSelectTab(e) {
      const { type } = e.detail
      this.setData({
        tabList: this.data.tabList.map(tab => tab.type === type ? {...tab, select: true} : {...tab, select: false}),
        type,
        min: '',
        max: '',
        size: '',
        projectDist: '',
        projectSize: '',
        minPicture: '',
        maxPicture: '',
        minDist: '',
        maxDist: '',
        minProjectRatio: '',
        maxProjectRatio: '',
      })
      this.computeResult()
    },
    computeResult() {
      const {
        type = '',
        min = '',
        max = '',
        size = '',
        projectDist = '',
        projectSize = '',
        transformRatio = 0,
        selectRate = [],
      } = this.data
      if(type === 'dist') {
        if(projectDist && size && max) {
          const minPicture = (projectDist * size / max * 1000).toFixed(2)
          const [_widthRate, _heightRate] = selectRate.split(':')
          const maxProjectRatio = projectDist / (minPicture * transformRatio * Math.sqrt(1 / (1 + Math.pow(_heightRate / _widthRate, 2))))
          this.setData({
            minPicture,
            maxProjectRatio: maxProjectRatio.toFixed(2)
          })
        } else {
          this.setData({
            minPicture: '',
            maxProjectRatio: '',
          })
        }
        if(projectDist && size && min) {
          const maxPicture = (projectDist * size / min * 1000).toFixed(2)
          const [_widthRate, _heightRate] = selectRate.split(':')
          const minProjectRatio = projectDist / (maxPicture * transformRatio * Math.sqrt(1 / (1 + Math.pow(_heightRate / _widthRate, 2))))
          this.setData({
            maxPicture,
            minProjectRatio: minProjectRatio.toFixed(2)
          })
        } else {
          this.setData({
            maxPicture: '',
            minProjectRatio: '',
          })
        }
      } else if (type === 'size') {
        if(min && projectSize && size) {
          const minDist = (min * projectSize / size / 1000).toFixed(2)
          const [_widthRate, _heightRate] = selectRate.split(':')
          const minProjectRatio = (minDist / (projectSize * transformRatio * Math.sqrt(1 / (1 + Math.pow(_heightRate / _widthRate, 2))))).toFixed(2)
          this.setData({
            minDist,
            minProjectRatio
          })
        } else {
          this.setData({
            minDist: '',
            minProjectRatio: ''
          })
        }
        if(max && projectSize && size) {
          const maxDist = (max * projectSize / size / 1000).toFixed(2)
          const [_widthRate, _heightRate] = selectRate.split(':')
          const maxProjectRatio = (maxDist / (projectSize * transformRatio * Math.sqrt(1 / (1 + Math.pow(_heightRate / _widthRate, 2))))).toFixed(2)
          this.setData({
            maxDist,
            maxProjectRatio
          })
        } else {
          this.setData({
            minDist: '',
            maxProjectRatio: ''
          })
        }
      }
    }
  }
})

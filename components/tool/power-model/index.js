import { getAirSwitch, getDiameterList } from '../../../models/util'
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
    objectArray: [],
    diameterIndex: 0,
    type: '220',
    tabList: [{
      type: '220',
      name: '单相-220V',
      select: true
    }, {
      type: '380',
      name: '三相-380V'
    }],
    // 第一项计算
    loadPower: '',
    airSwitch: '',
    // 第二项计算
    loadPower2: '',
    airSwitch2: '',
    line: '',
  },

  lifetimes: {
    ready() {
      this.getDiameterList()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getDiameterList() {
      const objectArray = await getDiameterList()
      this.setData({
        objectArray
      })
    },

    onSelectTab(e) {
      const { type } = e.detail
      if (type && type !== this.data.type) {
        this.setData({
          type,
          tabList: this.data.tabList.map(tab => tab.type === type 
            ? {...tab, select: true} 
            : {...tab, select: false}),
        })
        this.computeResult()
        this.computePowertResult()
      }
    },

    // 监控input
    onInputChange(e) {
      const { value } = e.detail
      this.setData({
        airSwitch: value
      })
      this.computeResult()
    },
    computeResult() {
      const { type, airSwitch } = this.data
      if(airSwitch) {
        const loadPower = type === '220' 
        ? (airSwitch * type / 1000).toFixed(1)
        : ((airSwitch * type * Math.sqrt(3) * 0.85) / 1000).toFixed(1)
        this.setData({
          loadPower
        })
      } else {
        this.setData({
          loadPower: '',
        })
      }
    },

    // 计算功率
    onInpuPowertChange(e) {
      const { value } = e.detail
      this.setData({
        loadPower2: value
      })
      this.computePowertResult()
    },
    async computePowertResult() {
      const { loadPower2, type } = this.data
      if(loadPower2) {
        const { electricity = '', diameter = '' } = await getAirSwitch({
          power: loadPower2
        }, type)
        this.setData({
          airSwitch2: electricity,
          line: diameter,
        })
      } else {
        this.setData({
          airSwitch2: '',
          line: '',
        })
      }
    },
    getDiameter(e) {
      this.setData({
        diameterIndex: e.detail.value
      })
    }
  }
})

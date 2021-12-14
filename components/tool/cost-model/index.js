import { calculateDistance } from '../../../models/map'
import { verifyData } from '../../../utils/tool'
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      this.setData({
        [type]: value
      })
    },
    // 位置选择
    async onLocation(e) {
      const { type } = e.target.dataset
      const {
        address,
        latitude,
        longitude,
      } = await wx.chooseLocation()
      if(!address) {
        wx.showToast({
          title: `请勾选${type === 'from' ? '始发地' : '目的地'}`,
          icon: 'none'
        })
        return
      }
      this.setData({
        [type]: {
          address,
          latitude,
          longitude,
        }
      })
      this.computeDistance()
    },

    async computeDistance() {
      const { from, to } = this.data
      if (from && to) {
        const {
          distance = 0
        } = await calculateDistance({
          from: {
            latitude: from.latitude,
            longitude: from.longitude,
          },
          to: {
            latitude: to.latitude,
            longitude: to.longitude,
          },
        })
        this.setData({
          distance: (distance / 1000).toFixed(2)
        })
      }
    },

    async onResult () {
      const { verify } = verifyData(this.data, [
        { type: 'distance', label: '运输距离' },
        { type: 'price', label: '运输单价' },
      ])
      if (!verify) return

      const {
        // 运费
        price = '',
        distance = '',
      } = this.data
      this.setData({
        totalPirce: distance ? (price * distance).toFixed(2) : '',
      })
    },
  }
})

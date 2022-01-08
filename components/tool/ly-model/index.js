import { getLyBrand } from '../../../models/tool'
import { calculateDistance } from '../../../models/map'
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
    barndList: [],
    brand: null,
    selectBrandId: '',
    step: '1.5',
    isHangingLamp: '否'
  },

  lifetimes: {
    ready() {
      this.getLyBrand()
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    async getLyBrand () {
      const brandList = await getLyBrand({})

      this.setData({
        brandList
      })
    },
    onSelectBrand (e) {
      const index = e.detail.value
      const brand = this.data.brandList[index]
      if(!brand) return
      const {
        crossbar,
        slantingpole,
        verticalbar
      } = brand
      this.setData({
        brand,
        // 立柱
        verticalBarWeight: verticalbar.weight,
        verticalBarPkVolume: verticalbar.pkgvolume,
        verticalBarAmount: verticalbar.pkgqty,
        
        // 横杆
        crossBarWeight: crossbar.weight,
        crossBarPkVolume: crossbar.pkgvolume,
        crossBarAmount: crossbar.pkgqty,

        // 斜拉
        slantingPoleWeight: slantingpole.weight,
        slantingPolePkVolume: slantingpole.pkgvolume,
        slantingPoleAmount: slantingpole.pkgqty,
      })
    },
    onSelectRadio (e) {
      const { type, val } = e.target.dataset
      this.setData({
        [type]: val
      })
    },
    // 位置选择
    // async onLocation(e) {
    //   const { type } = e.target.dataset
    //   const {
    //     address,
    //     latitude,
    //     longitude,
    //   } = await wx.chooseLocation()
    //   this.setData({
    //     [type]: {
    //       address,
    //       latitude,
    //       longitude,
    //     }
    //   })

    //   this.computeDistance()
    // },

    // async computeDistance() {
    //   const { from, to } = this.data
    //   if (from && to) {
    //     const {
    //       distance = 0
    //     } = await calculateDistance({
    //       from: {
    //         latitude: from.latitude,
    //         longitude: from.longitude,
    //       },
    //       to: {
    //         latitude: to.latitude,
    //         longitude: to.longitude,
    //       },
    //     })
    //     this.setData({
    //       distance: (distance / 1000).toFixed(2)
    //     })
    //   }
    // },

    onInputChange(e) {
      const { value } = e.detail
      const { type } = e.target.dataset
      if (type === 'width' || type === 'thickness' || type === 'height') {
        if (value % 2 !== 0) {
          wx.showToast({
            title: '输入值必须为2的倍数',
            icon: 'none'
          })
        }
        const _val = value % 2 !== 0 ? +value + 1 : value
        this.setData({
          [type]: _val
        })
      } else {
        this.setData({
          [type]: value
        })
        if(type !== 'price' || type !== 'distance') {
          this.setData({
            brand: null,
          })
        }
      }
    },

    async onResult () {
      const { width, thickness, height, step, isHangingLamp } = this.data
      const { verify } = verifyData(this.data, [
        { type: 'width', label: '宽度' },
        { type: 'height', label: '高度' },
        { type: 'thickness', label: '厚度' },
      ])
      if (!verify) return

      const isVip = await judgeVip()
      if(!isVip) return

      const _height = Math.floor(height / step)
      
      let verticalAmount = Math.floor((width / 2 + 1) * (thickness / 2 + 1) * (height / 2))
      let acrossAmount = Math.floor(((thickness / 2 + 1) * (width / 2) + (width / 2 + 1) * (thickness / 2)) * (_height + 1))
      let slantingAmount = Math.floor(((width / 2) * (thickness / 2 + 1) + (thickness / 2) * (width / 2 + 1)) * (_height)) - (isHangingLamp === '是' ? (width / 2) : 0)

      this.setData({
        verticalAmount,
        acrossAmount,
        slantingAmount,
      })

      const {
        // 重量
        verticalBarWeight = '',
        crossBarWeight = '',
        slantingPoleWeight = '',

        // 体积
        verticalBarPkVolume = '',
        crossBarPkVolume = '',
        slantingPolePkVolume = '',

        // 数量
        verticalBarAmount = '',
        crossBarAmount = '',
        slantingPoleAmount = '',

        // 运费
        price = '',
        distance = '',
      } = this.data
      this.setData({
        totalWeight: verticalBarWeight ? (verticalBarWeight * verticalAmount + crossBarWeight * acrossAmount + slantingPoleWeight * slantingAmount).toFixed(2) : '',
        totalPkVolume: verticalBarPkVolume ?
        (Math.ceil(verticalAmount / verticalBarAmount) * verticalBarPkVolume
        + Math.ceil(acrossAmount / crossBarAmount) * crossBarPkVolume
        + Math.ceil(slantingAmount / slantingPoleAmount) * slantingPolePkVolume).toFixed(2) : '',
        totalPirce: distance ? (price * distance).toFixed(2) : '',
      })
    },
  }
})

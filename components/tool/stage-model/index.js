import { remoteImagesUrl } from '../../../config'
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
    remoteImagesUrl,
    tabList: [
      { type: 'lhj', name: '铝合金舞台', select: true },
      { type: 'ly', name: '雷亚舞台', select: false }
    ],
    type: 'lhj',
    xCross: '',
    yCross: '',
    plateAmount: '',
    columnAmount: '',
    pleuritesAmount: '',
    footAmount: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectType(e) {
      const { type } = e.currentTarget.dataset
      if(type === this.data.type) return
      this.setData({
        tabList: this.data.tabList.map(item => item.type === type
          ? {...item, select: true}
          : {...item, select: false}),
          type,
          xCross: '',
          yCross: '',
          plateAmount: '',
          columnAmount: '',
          pleuritesAmount: '',
          footAmount: '',
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
      const { xCross, yCross } = this.data
      if(xCross && yCross) {
        const plateAmount = xCross * yCross;
        const columnAmount = (+xCross + 1) * (+yCross + 1);
        const pleuritesAmount = (+xCross + 1) * yCross + (+yCross + 1) * xCross;
        const footAmount = (+xCross + 1) * (+yCross + 1);
        this.setData({
          plateAmount,
          columnAmount,
          pleuritesAmount,
          footAmount,
        })
      } else {
        this.setData({
          plateAmount: '',
          columnAmount: '',
          pleuritesAmount: '',
          footAmount: '',
        })
      }
    }
  }
})

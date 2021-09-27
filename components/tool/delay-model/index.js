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
    distA: '',
    distB: '',
    result: '',
    resultList: [],
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
      this.computeResult()
    },
    computeResult() {
      const { distA, distB } = this.data
      if(distA && distB) {
        const result = ((distA - distB) / 340 * 1000).toFixed(4)
        this.setData({
          result,
          resultList: [...this.data.resultList, result]
        })
      } else {
        this.setData({
          result: '',
        })
      }
    },
    onEmpty() {
      this.setData({
        resultList: [],
      })
    }
  }
})

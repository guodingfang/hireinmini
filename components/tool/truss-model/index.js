import { getTrussSpec, getTrussSpan } from '../../../models/tool'
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
    type: 'screw',
    tabList: [{
      type: 'screw',
      name: '螺丝式',
      select: true
    }, {
      type: 'latch',
      name: '插销式'
    }],
    specsList: [],
    selectSpecs: null,
    spanList: ['6', '8', '9', '10', '12'],
    selectSpan: null,
    trussWay: 'center'
  },

  lifetimes: {
    ready() {
      this.getTrussSpec()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getTrussSpec() {
      const { type } = this.data
      const specsList = await getTrussSpec({
        mode: type
      })
      this.setData({
        specsList,
        selectSpecs: specsList.length ? specsList[0] : null
      })
      await this.getTrussSpan()
    },
    async getTrussSpan() {
      const { selectSpecs } = this.data
      if (!selectSpecs) return
      const spanList = await getTrussSpan({
        trussid: selectSpecs.id
      })
      this.setData({
        spanList,
        selectSpan: spanList.length ? spanList[0] : null
      })
    },
    onSelectItem(e) {
      const { type, item } = e.currentTarget.dataset
      this.setData({
        [type]: item
      })
      if (type === 'selectSpecs') {
        this.getTrussSpan()
      }
      if (type === 'selectSpam') {

      }
    },
    onSelectTab(e) {
      const { type } = e.detail
      if (type && type !== this.data.type) {
        this.setData({
          type,
          tabList: this.data.tabList.map(tab => tab.type === type 
            ? {...tab, select: true} 
            : {...tab, select: false})
        })
        this.getTrussSpec()
      }
    },
    onSelectTrussWay(e) {
      const { type } = e.currentTarget.dataset
      this.setData({
        trussWay: type
      })
    }
  }
})

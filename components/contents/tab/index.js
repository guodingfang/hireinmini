// components/tab/index.js
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
    list: [
      {
        id: '1',
        name: '关注',
        select: true
      },
      {
        id: '2',
        name: '推荐',
      },
      {
        id: '3',
        name: '全国',
      },
      {
        id: '4',
        name: '官方直播',
      },
      {
        id: '5',
        name: '其他科目1'
      },
      {
        id: '6',
        name: '其他科目2'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectTab(e) {
      console.log('选择tab', e)
    }
  }
})

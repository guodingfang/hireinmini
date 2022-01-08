// components/vip/privilege/index.js
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
        type: 'helper',
        name: '助手',
        explain: '一对一服务'
      },
      {
        type: 'tool',
        name: '租赁工具',
        explain: '全部免费用'
      },
      {
        type: 'user',
        name: '服务账号',
        explain: '对外提供服务'
      },
      {
        type: 'manage',
        name: '后台管理',
        explain: '移动端后台'
      },
      {
        type: 'ask',
        name: '问答',
        explain: '有偿答付费咨询'
      },
      {
        type: 'market',
        name: '产服营销',
        explain: '我的店+直播'
      },
      {
        type: 'advert',
        name: '广告接入',
        explain: '赚钱的广告位'
      },
      {
        type: 'gift',
        name: '续费好礼',
        explain: '老用户续费五折'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

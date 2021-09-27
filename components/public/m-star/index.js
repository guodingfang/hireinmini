// components/public/m-star/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal, changedPath) {
        const { scoreArr, scoreVal } = this.scoreCompute();
        this.setData({ scoreArr: scoreArr, scoreVal })
      }
    },
    configs: {
      type: Object,
      value: {
        fontColor: '#ffffff'
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scoreArr: Array.apply(null, Array(5)),
    scoreVal: 5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scoreCompute() {
      const { score } = this.properties;
      let scoreArr = Array.apply(null, Array(5))
      console.log.log('scoreArr', scoreArr)
      return {
        scoreArr,
        scoreVal: 5
      }
    }
  }
})

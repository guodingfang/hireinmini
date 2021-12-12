// components/public/m-model/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: 546,
    },
    showModel: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        newVal && this.setData({
          animateShow: true,
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animateShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm() {
      this.setData({
        animateShow: false,
      });
      setTimeout(() => {
        this.triggerEvent('confirm', {}, {})
      }, 400);
    },
  }
})

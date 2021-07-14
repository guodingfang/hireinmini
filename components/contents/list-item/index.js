import config from '../../../config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: null,
      observer (newVal) {
        console.log('newVal', newVal)
        this.getInfo()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: config.imgUrls,
    imgs: [],
    imgShow: 0,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      const { pics = [] } = this.properties.item;
      this.setData({
        imgShow: pics.length,
        imgs: pics.slice(0, 3)
      })
    },
    // 拨打电话
    onDial(e) {
      const phone = e.currentTarget.dataset['phone'];
      wx.makePhoneCall({
          phoneNumber: phone,
      })
    },
    // 点赞
    onLick() {
      console.log('点赞')
    },
    // 评论
    onComment() {
      console.log('评论')
    }
  }
})

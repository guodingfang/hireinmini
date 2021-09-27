import config from '../../../config'
import { addUserDialRecord, addLikeRelease, deleteLikeRelease, addComment } from '../../../models/release'
import { addAttention } from '../../../models/user'
import { fa } from '../../../utils/pinYin'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer (newVal) {
        this.getInfo()
      }
    },
    showConcern: {
      type: Boolean,
      value: true,
    },
    showOpertion: {
      type: Boolean,
      value: false,
    },
    isCurrentUser: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: config.imgUrls,
    videoUrl: config.videoUrl,
    imgs: [],
    imgShow: 0,
    type: '',
    bigImgAndVideoUrl: '',
    openVideo: false,
    commentShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getInfo() {
      const { info } = this.properties
      const { pics = [], picsign } = info
      this.setData({
        item: {
          ...info,
          praisecount: Number(info.praisecount),
          discusscount: Number(info.discusscount),
          forwardcount: Number(info.forwardcount)
        },
        imgShow: pics.length,
        imgs: pics.slice(0, 3),
        type: picsign == '2' ? 'video' : 'img'
      })
      this.getBigImgAndVideoUrl()
    },
    
    // 获取大图及视频图片
    getBigImgAndVideoUrl() {
      const { type, imgs, videoUrl, imgUrl } = this.data
      let url = ''
      if(imgs.length === 0) return
      if(type === 'img') {
        url = `${imgUrl}${imgs[0].picurl_thumbnails}`
      } else if (type === 'video') {
        url = `${videoUrl}${imgs[0].videourl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_${imgs[0].width},h_${imgs[0].height},m_fast`
      }
      this.setData({
        bigImgAndVideoUrl: url,
      })
    },

    // 拨打电话
    async onDial(e) {
      const { contactphone: phone } = this.data.item

      if(!phone) {
        wx.showToast({
          title: '该用户未提供电话',
          icon: 'none'
        })
        return
      }

			await addUserDialRecord({
				phone: phone,
      })
      
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    // 点赞
    async onLike() {
      const { msgid, praised = 0, userid: tuserid, praisecount = 0 } = this.data.item
      if(praised === 0) {
        await addLikeRelease({
          msgid,
          tuserid
        })
        this.setData({
          item: {
            ...this.data.item,
            praised: 1,
            praisecount: praisecount + 1
          }
        })
      } else if(praised === 1) {
        await deleteLikeRelease({
          msgid,
          tuserid
        })
        this.setData({
          item: {
            ...this.data.item,
            praised: 0,
            praisecount: praisecount - 1
          }
        })
      }
      this.onSkipDetail()
    },

    onShare() {
      this.onSkipDetail()
    },

    onComment() {
      this.onSkipDetail();
    },

    async onAttention() {
      const { userid: targetuserid, focused } = this.data.item
      const { fans, fansnum } = await addAttention({
        targetuserid,
        focused: focused === 1 ? 0 : 1
      })
      this.setData({
        item: {
          ...this.data.item,
          focused: focused === 1 ? 0 : 1,
          fans,
          fansnum
        }
      })
    },

    // 跳转用户页
    onSkipUser(e) {
      const { userid =  '', companyid } = this.properties.item;
      wx.navigateTo({
        url: `/pages/content-account/content-account?userid=${userid}`
      })
    },

    // 跳转详情页
    onSkipDetail(e) {
      const { msgid = '' } = this.properties.item;
      wx.navigateTo({
        url: `/pages/detail/detail?msgid=${msgid}`
      })
    },

  }
})

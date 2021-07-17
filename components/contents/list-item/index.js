import config from '../../../config'
import { addUserDialRecord, addLikeRelease, deleteLikeRelease, addComment } from '../../../models/release';
import { getUserInfo } from '../../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: null,
      observer (newVal) {
        // console.log('newVal', newVal)
        this.getInfo()
      }
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

    // 播放视频
    onOpenVideo() {
      this.setData({
        openVideo: true,
      })
    },

    // 拨打电话
    async onDial(e) {
      const { contactphone: phone } = this.data.item
      console.log('phone', phone)

      if(!phone) {
        wx.showToast({
          title: '该用户未提供电话',
          icon: 'none'
        })
        return
      }

			const res = await addUserDialRecord({
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
    },
    // 评论
    onComment() {
      console.log('评论')
      this.setData({
        commentShow: true,
      })
    },

    // 发送评论内容
    async onSendComment(e) {
      const { msgid, userid: tuserid, contacter } = this.data.item
      const userinfo = getUserInfo(['nickname', 'userid'])
      await addComment({
        content: e.detail.value,
        tuserid,
        fuserid: userinfo.userid,
        tusername: contacter,
        fusername: userinfo.nickname,
        msgid,
      })
      this.setData({
        item: {
          ...this.data.item,
          discusscount: this.data.item.discusscount + 1
        }
        
      })
    },

    // 跳转用户页
    onSkipUser(e) {
      const { userid =  '', companyid } = this.properties.item;
      wx.navigateTo({
        url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
      })
    },

    // 跳转企业页
    onSkipCompany(e) {
      const { userid =  '', companyid } = this.properties.item;
      wx.navigateTo({
        url: "../recommend/recommend?userid=" + userid + '&companyid=' + companyid
      })
    },

    // 跳转详情页
    onSkipDetail(e) {
      const { msgid = '' } = this.properties.item;
      wx.navigateTo({
          url: "/pages/detail/detail?msgid=" + msgid
      })
    },
  }
})

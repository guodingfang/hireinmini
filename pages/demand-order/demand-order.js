import config, { remoteImagesUrl } from '../../config'
import { getUserInfo, getCityInfo, judgeTabBarHeight, formatDate, promisic } from '../../utils/util'
import { addRequirement, editRequirement, deletePictures, getRequriementDetail, payRequirement } from '../../models/demand'
import { upload, payment } from '../../models/util'
import { verifyData } from '../../utils/tool'


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    type: '',
    bgImagesUrl: `${remoteImagesUrl}/user-bg.png`,
    headerBlock: 0,
    uploadImages: [],
    showDate: [],
    showCalendar: false,
    orderStatus: '',
    isService: false,
    isUser: false,
    images: [],
    isEditComplete: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type = 'apply', reqid = '' } = options
    this.setData({
      type,
      isEdit: type === 'details',
      reqid
    })
    this.getHeaderBlock()
    if (type === 'details') {
      this.getOrderDetails()
    } else {
      const {companyname, nickname, phone} = getUserInfo(['companyname', 'nickname', 'phone'])
      const { city } = getCityInfo(['city'])
      this.setData({
        isUser: true,
        companyname,
        contact: nickname,
        phone,
        city
      })
    }
  },

  getHeaderBlock() {
		const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
		const { tabHeight } = judgeTabBarHeight(workInfo);
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader,
			tabHeight,
		})
  },

  async getOrderDetails () {
    const { reqid } = this.data
    const data = await getRequriementDetail({
      reqid
    })

    const havImages = data.reqpic.map(item => ({
      ...item,
      img: `${config.imgUrl}${item.picurl}`
    }))

    const { userid } = getUserInfo(['userid'])
    this.setData({
      ...data,
      date: `${data.startdate} ~ ${data.enddate}`,
      showDate: [data.startdate, data.enddate],
      isService: userid === data.serviceuserid,
      isUser: userid === data.userid,
      havImages,
      images: havImages.map(item => item.img)
    })
  },

  async onDownloadFile () {
    wx.showLoading({
      title: '正在加载中...',
    })
    const res = await promisic(wx.downloadFile)({
      url: `${this.data.imgUrl}${this.data.contractfile}`,
    })
    let path = res.tempFilePath;
    wx.openDocument({
      filePath: path,
      showMenu: true,
      success (res) {
        console.log('res', res)
      },
      fail (err) {
        console.log('err', err)
      },
      complete () {
        wx.hideLoading()
      }
    })
  },

  onChanageInput (e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [`${type}`]: e.detail.value
    })
  },

  onSelectDate () {
    if(!this.data.isEdit) {
      this.setData({
        showCalendar: true
      })
    }
  },

  onCalendarClose () {
    this.setData({
      showCalendar: false
    })
  },

  onCalendarConfirm (e) {
    const [start, end] = e.detail;
    const startdate = formatDate(start, 'yyyy/MM/dd')
    const enddate = formatDate(end, 'yyyy/MM/dd')
    this.setData({
      showCalendar: false,
      startdate,
      enddate,
      date: `${startdate} ~ ${enddate}`
    })
  },

  async onDeleteUpload (e) {
    const deleteItem = e.detail.item[0]
    const { havImages } = this.data
    const exist = havImages.find(item => item.img === deleteItem)
    if (exist) {
      const { errcode, errmsg } = await deletePictures({
        picid: exist.id
      })
      if (errcode !== 0) {
        wx.showToast({
          title: errmsg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '删除图片成功',
          icon: 'none'
        })
      }
    }
  },

  async onUploadComplete (e) {
    const { uploadImages } = e.detail
    this.setData({
      uploadImages
    })
  },

  async onEdit () {
    if (!this.data.orderStatus) {
      this.setData({
        isEdit: false,
        orderStatus: 'edit'
      })
      return
    }
    if(!this.data.isEditComplete) return
    this.setData({
      isEditComplete: false
    })
    await this.onSubmit()
    this.setData({
      isEditComplete: true
    })
  },

  async onSubmit () {
    const { verify } = verifyData(this.data, [
      { type: 'companyname', label: '需求方(公司)名称' },
      { type: 'contact', label: '联系人' },
      { type: 'phone', label: '联系电话' },
      { type: 'city', label: '活动城市' },
      { type: 'actaddress', label: '活动地点' },
      { type: 'budget', label: '活动预算' },
      { type: 'acttype', label: '活动类型' },
      { type: 'remarks', label: '文字留言' }
    ])
    if (!verify) return

    const { uploadImages = [], companyname = '', contact = '', phone = '', city = '', actaddress = '', budget = '', acttype = '', remarks = '',  startdate = '', enddate = '', } = this.data
    
    
    const params = {
      companyname,
      contact,
      phone,
      city,
      actaddress,
      budget,
      acttype,
      remarks,
      startdate,
      enddate
    }

    if (this.data.orderStatus === 'edit') {
      wx.showLoading({
        title: '提交信息中...',
      })
      const result = await upload({
        url: '/Requirement/uploadReqPictures',
        files: uploadImages
      }, {
        formData: {
          type: 'require',
          reqid: this.data.reqid
        }
      })
      const { errcode, errmsg } = await editRequirement({
        reqid: this.data.reqid,
        ...params
      })
      wx.hideLoading()
      if (errcode !== 0) {
        wx.showToast({
          title: errmsg,
          icon: 'none'
        })
      } else {
        this.setData({
          isEdit: true,
          orderStatus: ''
        })
      }
    } else {
      wx.showLoading({
        title: '提交信息中...',
      })
      const result = await upload({
        url: '/Requirement/uploadReqPictures',
        files: uploadImages
      }, {
        formData: {
          type: 'require'
        }
      })
      const pics = result.map(item => JSON.parse(item).picid).join(',')
      const { errcode, errmsg } = await addRequirement({
        ...params,
        pics
      })
      wx.hideLoading()
      if (errcode !== 0) {
        wx.showToast({
          title: errmsg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1250)
      }
    }
  },

  async onAcceptOrder () {
    const { userid = '', wxappid = '' } = getUserInfo(['userid', 'wxappid'])
    const { code, jsApiParameters, errmsg = '' } = await payRequirement({
      price: this.data.brokerage,
      reqid: this.data.id,
      userid,
      openid: wxappid,
    })
    if (code !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }
    const res = await payment({
      payParams: jsApiParameters,
      ordertype: 'requirement',
      orderid: this.data.id,
    })
    console.log('res', res)
    if(res.code === 0) {
      this.getOrderDetails()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import {
  getCompanyInfo,
  getCompanyLabels,
  createCompany,
  editCompany
} from '../../models/company'
import { upload } from '../../models/util'
import { getUserInfo, getCityInfo, getStorageInfo, promisic } from '../../utils/util'
import config from '../../config'
import { formVerify } from './verify'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    companyid: '',
    userid: '',
    logo: '',
    uploadLogoUrl: '',
    companyname: '',
    contact: '',
    phone: '',
    city: '',
    citycode: '',
    countyname: '',
    provincename: '',
    lat: '',
    lng: '',
    address: '',
    introduction: '',
    havImages: [],
    images: [],
    uploadImages: [],
    tags: [],
    picidstr: '',     // 修改时删除原图片id-string
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { companyid = '' } = options
    this.setData({
      companyid,
      type: companyid ? 'edit' : 'create',
    })
    await this.getCompanyLabels()
    if(companyid) {
      await this.getCompanyInfo()
    } else {
      this.getInfo()
    }
  },

  async getCompanyInfo() {
    const { companyid, tags } = this.data
    const info = await getCompanyInfo({ id: companyid })
    const havImages = info.compamypiclist.map(item => ({
      ...item,
      img: `${config.imgUrl}${item.picfilename}`
    }))

    const { label = [], userdefined = [] } = info.mainbusiness

    let newTags = [
      ...tags.map(item => label.find(_label => _label.labelid === item.id) 
        ? {...item, select: true}
        : item), 
      ...userdefined.map(_label => ({
        id: _label.labelid,
        label: _label.labelname,
        select: true
      }))
    ]

    this.setData({
      companyid: info.companyid,
      logo: info.logopic ? `${config.imgUrl}${info.logopic}` : '',
      companyname: info.companyname,
      contact: info.contact,
      phone: info.phone,
      city: info.cityname,
      citycode: info.citycode,
      address: info.address,
      countyname: info.countyname,
      provincename: info.provincename,
      lat: info.lat,
      lng: info.lng,
      havImages,
      introduction: info.briefintroduction,
      images: havImages.map(item => item.img),
      tags: newTags,
      userid: info.createdby
    })
  },

  getInfo() {
    const { userid, nickname: contact, phone } = getUserInfo(['userid', 'nickname', 'phone'])
    const {
      city,
      cityCode: citycode,
      province: provincename,
      district: countyname,
      location,
    } = getStorageInfo('locationCity', ['city', 'cityCode', 'district', 'province', 'location'])
    this.setData({
      userid,
      contact,
      phone,
      city,
      citycode,
      countyname,
      provincename,
      lat: location.lat,
      lng: location.lng
    })
  },

  async getCompanyLabels() {
    const tags = await getCompanyLabels({})
    this.setData({
      tags: tags.map(item => ({id: item.id, label: item.labelname, select: false}))
    })
  },

  async uploadLogo() {
    const { tempFilePaths = [] } = await promisic(wx.chooseImage)({
      count: 1,
      sourceType: ['album', 'camera'],
    });
    this.setData({
      logo: tempFilePaths[0],
      uploadLogoUrl: tempFilePaths[0],
    })
  },

  onSelectCity() {
    wx.navigateTo({
      url: '/pages/city-list/city-list',
    })
  },

  onAgainLocationComplete(e) {
    this.setData({
      city: e.city,
      citycode: e.code
    })
  },

  async onAddress() {
    const { address } = await wx.chooseLocation()
    this.setData({
      address,
    })
  },

  onSelectLabel(e) {
    const { tags } = this.data
    this.setData({
      tags: tags.map((tag, index) => index === e.detail.index ? {...tag, select: !tag.select} : tag)
    })
  },

  onAddLabel(e) {
    const { label } = e.detail
    if(!label) return
    const { tags } = this.data
    this.setData({
      tags: [...tags, {
        id: "0",
        label,
        select: true,
      }]
    })
  },

  onUploadComplete(e) {
    const { uploadImages } = e.detail
    this.setData({
      uploadImages
    })
  },

  onDeleteUpload(e) {
    const deleteItem = e.detail.item[0]
    const { picidstr, havImages } = this.data
    const exist = havImages.find(item => item.img === deleteItem)
    if(exist) {
      this.setData({
        picidstr: picidstr ? `${picidstr},${exist.picid}` : exist.picid,
        havImages: havImages.filter(item => item.img !== deleteItem)
      })
    }
  },

  onChanageInput(e) {
    const { type } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [type]: value
    })
  },

  // 提交信息
  async onSubmit() {
    const {
      type = '',
      companyid = '',
      userid = '',
      companyname = '',
      contact = '',
      phone = '',
      citycode = '',
      address = '',
      introduction = '',
      tags = [],
      picidstr = '',
      countyname = '',
      provincename = '',
      lat = '',
      lng = '',
    } = this.data

    let mainbusiness = {}
    tags.filter(tag => tag.select).map((tag, index) => {
      mainbusiness[index] = {
        labelid: tag.id,
        labelname: tag.label
      }
    })

    const params = {
      companyid,
      companyname,
      contact,
      phone,
      citycode,
      countyname,
      provincename,
      lat,
      lng,
      address,
      introduction,
      userid,
      mainbusiness: JSON.stringify(mainbusiness),
      picidstr
    }

    const verify = formVerify(params)

    if(!verify) return

    if(type === 'create') {
      const {
        companyid = '',
        employeeid = '',
        msg = '',
        result = false
      } = await createCompany({
        ...params
      })
      if(!result) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }

      this.setData({
        companyid,
        employeeid
      })
    } else {
      await editCompany({
        ...params
      })
    }
    await this.submitLogo()
    await this.uploadPicture()

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面

    prevPage.onAgainRequestCompany && prevPage.onAgainRequestCompany({})

    wx.navigateBack({
      delta: 1,
    })
  },

  async submitLogo() {
    const { uploadLogoUrl, companyid } = this.data
    if(!uploadLogoUrl) return
    await upload({
      url: '/Company/addCompanyLogoPicture',
      files: [uploadLogoUrl]
    }, {
      formData: {
        companyid: companyid,
      },
    })
  },

  // 上传轮播图
  async uploadPicture() {
    const { userid, companyid, employeeid, uploadImages } = this.data
    if(!uploadImages.length) return
    await upload({
      url: '/Company/addCompanyPicture',
      files: uploadImages
    }, {
      formData: {
        companyid: companyid,
        employeeid: employeeid,
        userid: userid,
      },
    })
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
})
import { addMainProduct } from '../../models/goods'
import { upload } from '../../models/util'
import { verifyData } from '../../utils/tool'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formList: [
      {
        type: 'prodspec',
        label: '规格',
        placeholder: '输入产品规格'
      }, {
        type: 'stocknumber',
        label: '数量',
        placeholder: '输入产品库存数量'
      }, {
        type: 'produnit',
        label: '单位',
        placeholder: '输入产品单位'
      }, {
        type: 'prodbrand',
        label: '品牌',
        placeholder: '输入产品品牌'
      }, {
        type: 'price',
        label: '单价',
        placeholder: '输入产品价格'
      }
    ],
    areaList: [
      {
        start: '',
        end: '',
        price: '',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyid: options.companyid
    })
  },

  // 图片上传回调
  onUploadComplete(e) {
    const { uploadImages = [], formDataParams = null } = e.detail
    this.setData({
      uploadImages,
      formDataParams,
    })
  },

  // 输入内容
  onChanageInput (e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      [`${type}`]: e.detail.value
    })
  },

  onChanageAreaInput (e) {
    const { type, index } = e.currentTarget.dataset
    this.setData({
      areaList: this.data.areaList.map((item, _index) => index === _index ? {
        ...item,
        [`${type}`]: e.detail.value
      } : item)
    })
  },

  addArea () {
    this.setData({
      areaList: [
        ...this.data.areaList,
        {
          start: '',
          end: '',
          price: '',
        }
      ]
    })
  },

  async onSaveProduct () {
    const { verify } = verifyData(this.data, [
      { type: 'prodname', label: '名称' },
      { type: 'introduction', label: '描述' },
      { type: 'prodspec', label: '规格' },
      { type: 'stocknumber', label: '数量' },
      { type: 'produnit', label: '单位' },
      { type: 'prodbrand', label: '品牌' },
      { type: 'price', label: '单价' },
    ])

    if (!verify) return
    
    let areaList = this.data.areaList.map(item => ({
      rd_start: item.start,
      rd_end: item.end,
      price: item.price
    }))

    console.log('areaList', areaList)

    let params = {
      companyid: this.data.companyid,
      prodname: this.data.prodname,
      introduction: this.data.introduction,
      prodspec: this.data.prodspec,
      produnit: this.data.produnit,
      prodbrand: this.data.prodbrand,
      stocknumber: this.data.stocknumber,
      prodprice: this.data.price,
      rent: JSON.stringify(areaList)
    }
    const { errcode = -1, errmsg = '', mainprodid } = await addMainProduct({
      ...params
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
      return
    }

    const { uploadImages = [] } = this.data
    if(uploadImages && uploadImages.length) {
      await upload({
        url: '/Company/addMainProductPicture',
        files: [uploadImages[0]]
      }, {
        formData: { mainprodid, iscover: 1 }
      })
      if(uploadImages.length > 1) {
        await upload({
          url: '/Company/addMainProductPicture',
          files: uploadImages.slice(1)
        }, {
          formData: { mainprodid, iscover: 0 }
        })
      }
    }
    wx.showToast({
      title: '保存成功',
      icon: 'none'
    })
    wx.navigateBack({
      delta: 1,
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
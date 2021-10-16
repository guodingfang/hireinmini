import { remoteImagesUrl } from '../../config'
import config from '../../config'
import { promisic, getUserInfo } from '../../utils/util.js'
import { userAuthentication } from '../../models/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remoteImagesUrl,
    formData: [
      {
        type: 'fullname',
        label: '真实姓名',
        placeholder: '必填，输入真实姓名',
        value: '',
        need: true
      },
      {
        type: 'phone',
        label: '联系电话',
        placeholder: '必填，输入联系电话',
        value: '',
        need: true
      },
      {
        type: 'idnumber',
        label: '身份证号',
        placeholder: '必填，输入身份证号',
        value: '',
        need: true
      },
      {
        type: 'othercontacter',
        label: '其他联系人',
        placeholder: '输入其他联系人',
        value: '',
        need: false
      },
      {
        type: 'companyUser',
        label: '公司负责人',
        placeholder: '输入其他输入公司负责人联系人',
        value: '',
        need: false
      },
      {
        type: 'companyname',
        label: '隶属关系或隶属公司',
        placeholder: '输入隶属关系或隶属公司',
        value: '',
        need: false,
        flex: 'column'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onChangeInput(e) {
    const { type, value } = e.detail
    this.setData({
      formData: this.data.formData.map(item => item.type === type
        ? { ...item, value }
        : item)
    })
  },

  async onUpload(e) {
    console.log('e', e)
    const { type } = e.currentTarget.dataset
    const { tempFilePaths = [] } = await promisic(wx.chooseImage)({
      count: 1,
      sourceType: ['album', 'camera'],
    });
    console.log('tempFilePaths', tempFilePaths)
    const {userid = 0, accesstoken = '', unionid = ''} = getUserInfo([
      'accesstoken',
      'userid',
      'unionid'
    ])
    const { data } = await promisic(wx.uploadFile)({
      url: `${config.baseUrl}/User/userAuthenticationImage`,
      filePath: tempFilePaths[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        userid,
        loginuserid: userid,
        accesstoken,
        loginunionid: unionid,
        imgfield: type
      }
    })
    const { result = false, msg = '' } = JSON.parse(data) || {}
    if(!result) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
  },

  async onPublish() {
    const { formData } = this.data
    console.log('formData', formData)
    const { code, msg = '' } = this.formVerify(formData)
    if(code !== 0) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }

    // await userAuthentication()
  },

  // 提交验证
  formVerify(data = []) {
    let verify = {
      code: 0,
      msg: '认证成功'
    }
    for(let i = 0; i < data.length; i++) {
      const item = data[i]
      if(item.need && !item.value) {
        verify.code = -1,
        verify.msg = `请输入${item.label}`
        break
      }
      if(item.type === 'phone') {
        if(!(/^1[3456789]\d{9}$/.test(item.value))) {
          verify.code = -1,
          verify.msg = `${item.label}输入格式错误`
          break
        }
      }
      if(item.type === 'idnumber') {
        if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(item.value))) {
          verify.code = -1,
          verify.msg = `${item.label}输入格式错误`
          break
        }
      }
    }
    return verify
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
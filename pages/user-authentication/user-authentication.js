import { remoteImagesUrl } from '../../config'
import config from '../../config'
import { promisic, getUserInfo, judgeTabBarHeight } from '../../utils/util.js'
import { userAuthentication } from '../../models/user'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: config.imgUrl,
    remoteImagesUrl,
    selectAgreement: false,
    idcard_front: '',
    idcard_back: '',
    identifyCardId: '',
    identifyName: '',
    idcardFrontImg: `${remoteImagesUrl}/authentication/idCrad-obverse.png`,
    idcardBackImg: `${remoteImagesUrl}/authentication/idCrad-reverse.png`,
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
      // {
      //   type: 'othercontacter',
      //   label: '公司名称',
      //   placeholder: '输入公司名称',
      //   value: '',
      //   need: false
      // },
      // {
      //   type: 'companyUser',
      //   label: '纳税人识别号',
      //   placeholder: '输入纳税人识别号',
      //   value: '',
      //   need: false
      // },
      // {
      //   type: 'companyname',
      //   label: '隶属关系或隶属公司',
      //   placeholder: '输入隶属关系或隶属公司',
      //   value: '',
      //   need: false,
      //   flex: 'column'
      // }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeaderBlock()    
  },

  getHeaderBlock() {
    const { workInfo, statusBarHeight, headerTopHeader } = app.globalData;
    const { tabHeight } = judgeTabBarHeight(workInfo);
    this.setData({
      headerBlock: statusBarHeight + headerTopHeader,
      tabHeight,
    })
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
    const res = JSON.parse(data) || {}
    const { result = false, msg = '' } = res
    if(!result) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    } else {
      if(type === 'idcard_front') {
        this.setData({
          idcard_front: res.idcard_front,
          idcardFrontImg: `${this.data.imgUrl}${res.idcard_front}`,
          identifyCardId: res.idnumer,
          identifyName: res.name
        })
      } else if (type === 'idcard_back') {
        this.setData({
          idcard_back: res.idcard_back,
          idcardBackImg: `${this.data.imgUrl}${res.idcard_back}`
        })
      }
    }
  },

  onLink(e) {
    const { type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/${type}/${type}`,
    })
  },

  onSelectAgreement () {
    this.setData({
      selectAgreement: !this.data.selectAgreement
    })
  },

  async onPublish() {
    if (!this.data.selectAgreement) {
      wx.showToast({
        title: '请先勾选同意《嗨应隐私权政策》、《用户协议》',
        icon: 'none'
      })
      return
    }
    const {
      formData,
      idcard_front,
      idcard_back,
      identifyCardId,
      identifyName,
    } = this.data
    console.log('formData', formData)
    const result = this.formVerify(formData)
    console.log('result', result)
    if(identifyName !== result.fullname) {
      wx.showToast({
        title: '填写的姓名与识别的姓名不一致',
        icon: 'none'
      })
      return
    }
    if(identifyCardId !== result.idnumber) {
      wx.showToast({
        title: '填写的身份证号与识别的身份证号不一致',
        icon: 'none'
      })
      return
    }
    const { code, msg = '' } = result
    if(code !== 0) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    
    const res = await userAuthentication({
      fullname: result.fullname,
      phone: result.phone,
      idnumber: result.idnumber,
      idcard_front,
      idcard_back
    })

    if(!res.result) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '认证成功',
        icon: 'none'
      })
      setTimeout(() => {
        // 通知上一个页面信息已修改
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.onSetUserInfo({})
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }
  },

  // 提交验证
  formVerify(data = []) {
    let result = {
      code: 0,
      msg: '认证成功'
    }
    for(let i = 0; i < data.length; i++) {
      const item = data[i]
      result[item.type] = item.value
      if(item.need && !item.value) {
        result.code = -1,
        result.msg = `请输入${item.label}`
        break
      }
      if(item.type === 'phone') {
        if(!(/^1[3456789]\d{9}$/.test(item.value))) {
          result.code = -1,
          result.msg = `${item.label}输入格式错误`
          break
        }
      }
      if(item.type === 'idnumber') {
        if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(item.value))) {
          result.code = -1,
          result.msg = `${item.label}输入格式错误`
          break
        }
      }
    }
    return result
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
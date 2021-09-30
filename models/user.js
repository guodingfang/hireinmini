import request from '../utils/request'
import { promisic } from '../utils/util'

/**
 * 用户登录
 * @param {*} option 
 */
const login = async (option = {}) => {
  const { code = '' } = await promisic(wx.login)()
  const info = await request.post('/WXAppLogin/WXAppLogins', {
    code,
  })
  console.log('info', info)
  if(info.code === 0 && info.result) {
    wx.setStorageSync('userinfo', info.userinfo)
    return {
      code: 0,
      userinfo: info.userinfo
    }
  } else {
    const navTo = await wx.navigateTo({
      url: `/pages/login-2/login-2?status=${info.code === 1 ? 'userInfo' : 'baseInfo'}`,
    })
    navTo.eventChannel.emit('getUserBaseInfo', { userinfo: info.userinfo })
    return {
      code: -1,
      userinfo: null
    }
  }
}

/**
 * 用户注册
 * @param {*} option 
 */
const registerUser = (option = {}) => {
  return request.post('/WXAppLogin/userRegByUserinfo', {
    ...option
  })
}

/**
 * 获取微信手机号
 * @param {*} option 
 */
const getUserPhone = (option = {}) => {
  return request.post('/WXAppLogin/getWxUserPhoneNumber', {
    ...option
  })
}

/**
 * 注销账户
 * @param {*} option 
 */
const unRegisterUser = (option = {}) => {
  return request.post('/WXAppLogin/unregister', {
    ...option
  })
}

// 获取用户当前经纬度
const getLocation = (success, fail) => {
  promisic(wx.getLocation)({
    type: 'wgs84',
  }).then(res => {
    success && success(res)
  }).catch(err => {
    fail && fail(err)
  })
}

/**
 * 上传访问日志
 * @param {*} option 
 */
const uploadAccessLog = (option = {}) => {
  return request.post('/User/accessLog', {
    ...option
  })
}

/**
 * 获取我的公司信息
 * @param {*} option 
 */
const getMyCompanyInfo = (option = {}) => {
  return request.post('/Company/getMyCompanyInfo', {
    ...option
  })
}

/**
 * 获取待审批订单
 * @param {*} option 
 */
const getMyOrderForAuditNum = (option = {}) => {
  return request.post('/Order/myOrderForAuditNum', {
    ...option
  })
}

/**
 * 关注内容好
 * @param {*} option 
 */

const addAttention = (option = {}) => {
  return request.post('/User/addAttention', {
    ...option
  })
}

/**
 * 已关注用户列表
 * @param {*} option 
 */
const getAttentionedList = (option = {}) => {
  return request.post('/User/getAttentionedList', {
    ...option
  })
}

/**
 * 我的页动态、关注以及订单的数量、角标
 * @param {*} option 
 */
const getUserBaseInfo = (option = {}) => {
  return request.post('/User/getUserBaseInfo', {
    ...option
  })
}

/**
 * 我的-厂家页面，动态/文章/视频/小视频…(店铺除外)，账号信息流列表
 * @param {*} option 
 */
const getMsgDynamics = (option = {}) => {
  return request.post('/Release/getMsgDynamics', {
    ...option
  })
}

/**
 * 获取服务号信息
 * @param {*} option 
 */
const getCompanyInfo = (option = {}) => {
  return request.post('/Company/getCompanyInfo', {
    ...option
  })
}

/**
 * 获取用户编辑信息
 * @param {*} option 
 */
const getUserEditableInfo = (option = {}) => {
  return request.post('/User/getUserEditableInfo', {
    ...option
  })
}


/**
 * 改变用户信息
 * @param {*} option 
 */
const setUserInfo = (option = {}) => {
  return request.post('/User/changeUserInfo', {
    ...option
  })
}

export {
  login,
  registerUser,
  getUserPhone,
  unRegisterUser,
  getLocation,
  uploadAccessLog,
  getMyCompanyInfo,
  getMyOrderForAuditNum,
  addAttention,
  getAttentionedList,
  getUserBaseInfo,
  getMsgDynamics,
  getCompanyInfo,
  getUserEditableInfo,
  setUserInfo
}
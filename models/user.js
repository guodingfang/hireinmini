import request from '../utils/request'
import { storageSet } from '../utils/storage'
import { promisic } from '../utils/util'

export const initUserInfo = async (option = {}) => {
  const { code = '' } = await promisic(wx.login)()
  const info = await request.post('/WXAppLogin/WXAppLogins', { code })
  if(info && info.code === 0 && info.result) {
    storageSet('userinfo', info.userinfo)
    return {
      code: 0,
      userinfo: info.userinfo
    }
  } else {
    const { unionid, accesstoken } = info.userinfo
    storageSet('userinfo', {
      unionid,
      accesstoken
    })
    return {
      code: -1,
      userinfo: null
    }
  }
}

/**
 * 用户登录
 * @param {*} option 
 */
export const login = async (option = {}) => {
  const { code = '' } = await promisic(wx.login)()
  const info = await request.post('/WXAppLogin/WXAppLogins', {
    code,
  })
  if(info && info.code === 0 && info.result) {
    storageSet('userinfo', info.userinfo)
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]
    console.log('currentPage', currentPage)
    currentPage.onRegainGetUserInfo && currentPage.onRegainGetUserInfo()
    return {
      code: 0,
      userinfo: info.userinfo
    }
  } else {
    const navTo = await wx.navigateTo({
      url: `/pages/login/login?status=${info.code === 1 ? 'userInfo' : 'baseInfo'}`,
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
export const registerUser = (option = {}) => {
  return request.post('/WXAppLogin/userRegByUserinfo', {
    ...option
  })
}

/**
 * 获取微信手机号
 * @param {*} option 
 */
export const getUserPhone = (option = {}) => {
  return request.post('/WXAppLogin/getWxUserPhoneNumber', {
    ...option
  })
}

/**
 * 注销账户
 * @param {*} option 
 */
export const unRegisterUser = (option = {}) => {
  return request.post('/WXAppLogin/unregister', {
    ...option
  })
}

// 获取用户当前经纬度
export const getLocation = (success, fail) => {
  promisic(wx.getLocation)({
    type: 'wgs84',
  }).then(res => {
    success && success(res)
  }).catch(err => {
    fail && fail(err)
  })
}

/**
 * 获取我的公司信息
 * @param {*} option 
 */
export const getMyCompanyInfo = (option = {}) => {
  return request.post('/Company/getMyCompanyInfo', {
    ...option
  })
}

/**
 * 获取待审批订单
 * @param {*} option 
 */
export const getMyOrderForAuditNum = (option = {}) => {
  return request.post('/Order/myOrderForAuditNum', {
    ...option
  })
}

/**
 * 关注内容好
 * @param {*} option 
 */

export const addAttention = (option = {}) => {
  return request.post('/User/addAttention', {
    ...option
  })
}

/**
 * 已关注用户列表
 * @param {*} option 
 */
export const getAttentionedList = (option = {}) => {
  return request.post('/User/getAttentionedList', {
    ...option
  })
}

/**
 * 我的信息
 * @param {*} option 
 */
export const getUserBaseInfo = (option = {}) => {
  return request.post('/User/getUserBaseInfo', {
    ...option
  })
}

/**
 * 我的-厂家页面，动态/文章/视频/小视频…(店铺除外)，账号信息流列表
 * @param {*} option 
 */
export const getMsgDynamics = (option = {}) => {
  return request.post('/Release/getMsgDynamics', {
    ...option
  })
}

/**
 * 获取用户编辑信息
 * @param {*} option 
 */
export const getUserEditableInfo = (option = {}) => {
  return request.post('/User/getUserEditableInfo', {
    ...option
  })
}

/**
 * 改变用户信息
 * @param {*} option 
 */
export const setUserInfo = (option = {}) => {
  return request.post('/User/changeUserInfo', {
    ...option
  })
}

/**
 * 用户A是否关注了用户B
 * @param {*} option 
 */
export const isAFocusB = (option = {}) => {
  return request.post('/User/isAFocusB', {
    ...option
  })
}

/**
 * 用户认证信息提交
 * @param {*} option 
 */
export const userAuthentication = (option = {}) => {
  return request.post('/User/userAuthentication', {
    ...option
  })
}

/**
 * 优惠券领取接口
 * @param {*} option 
 */
export const receiveCoupons = (option = {}) => {
  return request.post('/User/receiveCoupons', {
    ...option
  })
}

/**
 * 我的优惠券列表
 * @param {*} option 
 */
export const getMyCoupon = (option = {}) => {
  return request.post('/User/getMyCoupon', {
    ...option
  })
}
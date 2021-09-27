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
    wx.setStorageSync('logininfo', info.userinfo)
    return {
      code: 0,
      userinfo: info.userinfo
    }
  } else {
    wx.navigateTo({
      url: '/pages/login/login',
    })
    return {
      code: -1,
      userinfo: null
    }
  }
}

// 获取用户当前经纬度
const getLocation = (success, fail) => {
  promisic(wx.getLocation)({
    type: 'wgs84',
  }).then(res => {
    console.log('res', res)
    success && success(res)
  }).catch(err => {
    console.log('err', err)
    fail && fail
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


export {
  login,
  getLocation,
  uploadAccessLog,
  getMyCompanyInfo,
  getMyOrderForAuditNum,
  addAttention,
  getAttentionedList,
  getUserBaseInfo,
  getMsgDynamics,
  getCompanyInfo
}
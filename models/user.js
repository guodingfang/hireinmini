import { nu } from '../utils/pinYin'
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

const getLocation = () => {
  promisic(wx.getLocation)({
    type: 'wgs84',
  }).then(res => {
    console.log('res', res)
  }).catch(err => {
    console.log('err', err)
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


export {
  login,
  getLocation,
  getMyCompanyInfo,
  getMyOrderForAuditNum,
  addAttention,
  getAttentionedList
}
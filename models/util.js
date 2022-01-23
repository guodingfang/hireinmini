import request from '../utils/request'
import { getUserInfo, promisic } from '../utils/util'
import config from '../config'

/**
 * 获取轮播
 * @param {*} option 
 */
export const getCarousel = (option = {}) => {
  return request.post('/Index/getSlideshow', {
    ...option
  })
}

/**
 * 权限控制
 * @param {*} option 
 */
export const checkFrontPower = (option = {}) => {
  const { employeeid = 0 } = getUserInfo(['employeeid'])
  return request.post('/Base/checkFrontPower', {
    ...option,
    employeeid
  })
}

/**
 * 推荐账号列表
 * @param {*} option 
 */
export const getRecommendAccountList = (option = {}) => {
  return request.post('/User/getRecommendAccountList', {
    ...option
  })
}

/**
 * 页面广告
 * @param {*} option 
 */
export const getPageAdvertsment = (option = {}) => {
  return request.post(`/Advert/getPageAdvertsment`, {
    ...option
  })
}

/**
 * 获取天气
 * @param {*} option 
 */
export const getWeather = (option = {}) => {
  return request.post(`/Assistant/weatherforecast`, {
    ...option
  })
}

/**
 * 上传文件
 * @param {*} params 
 * @param {*} option 
 */
export const upload = async (params = {}, option = {}) => {
  const { prefixUrl = config.baseUrl, url = '', files = [] } = params
  const {
    formData = null,
    header = { 'content-type': 'multipart/form-data' },
  } = option
  const {userid = 0, accesstoken = '', unionid = ''} = getUserInfo([
    'accesstoken',
    'userid',
    'unionid'
  ])
  const resList = Array.apply(null, Array(files.length))
  for (let [index, file] of files.entries()) {
     const { data } = await promisic(wx.uploadFile)({
      url: `${prefixUrl}${url}`,
      filePath: file,
      name: 'file',
      formData: {
        userid,
        loginuserid: userid,
        accesstoken,
        loginunionid: unionid,
        ...formData,
      },
      header: { ...header },
    })

    resList[index] = data
  }
  return resList
}

/**
 * 获取天气
 * @param {*} option 
 */
export const getNLoginList = (option = {}) => {
  return request.post(`/WXAppLogin/getNLoginList`, {
    ...option
  })
}

/**
 * 页面头图查询
 * @param {*} option 
 */
export const getPageHeaderImage = (option = {}) => {
  return request.post(`/Index/getPageImage`, {
    ...option
  })
}

/**
 * 上传访问日志
 * @param {*} option 
 */
export const uploadAccessLog = (option = {}) => {
  const launchInfo = wx.getLaunchOptionsSync()
  const enterInfo = wx.getEnterOptionsSync()
  const { userid, unionid, wxappid } = getUserInfo(['userid', 'unionid', 'wxappid'])
  request.post('/User/accessLog', {
    ...option,
    loginuserid: userid,
    loginunionid: unionid,
    openid: wxappid,
    launchscene: launchInfo.scene,
    enterscene: enterInfo.scene,
  })
}

/**
 * 支付統一接口
 * @param {*} option 
 */
export const payment = async (option = {}) => {
  const { payParams, ...args } = option
  const prepay_id = payParams.package.split('=')[1]
  try {
    await promisic(wx.requestPayment)({
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType,
      paySign: payParams.paySign,
    })
    await paymentCallBack({
      ...args,
      status: 'success',
      prepay_id
    })
    return { code: 0, msg: '支付成功' }
  } catch (e) {
    await paymentCallBack({
      ...args,
      status: 'fail',
      prepay_id
    })
    return { code: -1, msg: '取消支付' }
  }
}

/**
 * 支付回调
 * @param {*} option 
 */
export const paymentCallBack = (option = {}) => {
  const { ordertype = '' } = option
  const prefixUrls = {
    'consume': '',
    'lease': '',
    'qa': 'QuestionAnswer',
    'recharge': 'User',
    'vip': 'User',
    'requirement': 'Requirement'
  }
  const { userid } = getUserInfo(['userid'])
  return request.post(`/${prefixUrls[ordertype]}/payCallBack`, {
    ...option,
    userid
  })
}


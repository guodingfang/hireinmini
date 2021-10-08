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
  console.log('employeeid', employeeid)
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
  console.log('files', files)
  const {
    formData = null,
    header = {
      'content-type': 'multipart/form-data'
    }
  } = option

  for (let [index, file] of files.entries()) {
    await promisic(wx.uploadFile)({
      url: `${prefixUrl}${url}`,
      filePath: file,
      name: 'file',
      formData,
      header: {
        ...header,
      }
    })
  }
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
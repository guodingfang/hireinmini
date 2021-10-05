import request from '../utils/request'
import { getUserInfo, promisic } from '../utils/util'

/**
 * 获取轮播
 * @param {*} option 
 */
const getCarousel = (option = {}) => {
  return request.post('/Index/getSlideshow', {
    ...option
  })
}

/**
 * 权限控制
 * @param {*} option 
 */
const checkFrontPower = (option = {}) => {
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
const getRecommendAccountList = (option = {}) => {
  return request.post('/User/getRecommendAccountList', {
    ...option
  })
}

/**
 * 页面广告
 * @param {*} option 
 */
const getPageAdvertsment = (option = {}) => {
  return request.post(`/Advert/getPageAdvertsment`, {
    ...option
  })
}

/**
 * 获取天气
 * @param {*} option 
 */
const getWeather = (option = {}) => {
  return request.post(`/Assistant/weatherforecast`, {
    ...option
  })
}
/**
 * 上传文件
 * @param {*} option 
 */
const upload = (option = {}) => {
  const {
    url = '',
    file = [],
    formData = null,
    headerConfig = {
      'content-type': 'multipart/form-data'
    }
  } = option
  return promisic(wx.uploadFile)({
    url,
    filePath: file,
    name: 'file',
    formData,
    header: {
      ...headerConfig,
    }
  })
}

export {
  getCarousel,
  checkFrontPower,
  getRecommendAccountList,
  getPageAdvertsment,
  getWeather,
  upload
}
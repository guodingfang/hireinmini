import request from '../utils/request'
import { getUserInfo } from '../utils/util'
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
 * 工具-计算空开
 * @param {*} option 
 */
const getAirSwitch = (option = {}, type) => {
  const url = type === '220' ? 'electricity_singlePhase' : 'electricity_threePhase'
  return request.post(`/Formula/${url}`, {
    ...option
  })
}

/**
 * 工具-获取线径功率列表
 * @param {*} option 
 */
const getDiameterList = (option = {}) => {
  return request.post(`/Formula/diameter_electricity_Table`, {
    ...option
  })
}

/**
 * 工具-小间距LED屏常间距参数
 * @param {*} option 
 */
const getMiniLedSpacing = (option = {}) => {
  return request.post(`/Formula/ledSmallSpacing`, {
    ...option
  })
}

/**
 * 工具-获取间距列表
 * @param {*} option 
 */
const getSpacingList = (option = {}) => {
  return request.post(`/Formula/getSpacingList`, {
    ...option
  })
}

/**
 * 工具-获取规格列表
 * @param {*} option 
 */
const getSpecList = (option = {}) => {
  return request.post(`/Formula/getSpecList`, {
    ...option
  })
}

/**
 * 工具-获取Truss架规格
 * @param {*} option 
 */
const getTrussSpec = (option = {}) => {
  return request.post(`/Formula/getTrussSpec`, {
    ...option
  })
}

/**
 * 工具-获取Truss架跨度承重
 * @param {*} option 
 */
const getTrussSpan = (option = {}) => {
  return request.post(`/Formula/getTrussSpan`, {
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

export {
  getCarousel,
  checkFrontPower,
  getRecommendAccountList,
  getAirSwitch,
  getDiameterList,
  getSpacingList,
  getSpecList,
  getMiniLedSpacing,
  getTrussSpec,
  getTrussSpan,
  getPageAdvertsment,
  getWeather
}
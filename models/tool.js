import request from '../utils/request'

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

export {
  getAirSwitch,
  getDiameterList,
  getMiniLedSpacing,
  getSpacingList,
  getSpecList,
  getTrussSpec,
  getTrussSpan,
}
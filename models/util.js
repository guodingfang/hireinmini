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

export {
  getCarousel,
  checkFrontPower,
  getRecommendAccountList
}
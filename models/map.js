
import request from '../utils/request'
import { promisic } from '../utils/util'

import QQMapWX from '../libs/qqmap-wx-jssdk.min.js';
import { qqMapkey } from '../config.js';

import { getLocation } from './user'

// 获取QQ地图实例对象
const getMap = () => {
  return new QQMapWX({key: qqMapkey})
}

/**
 * 获取城市列表
 * @param {*} option 
 */
const getCityList = (option = {}) => {
  return request.post('/Index/getCityList', {
    ...option
  })
}

/**
 * 获取历史城市
 * @param {*} option 
 */
const getHitoryList = (option = {}) => {
  return request.post('/Index/getHitoryList', {
    ...option
  })
}

/**
 * 获取热门城市
 * @param {*} option 
 */
const getHotList = (option = {}) => {
  return request.post('/Index/getHotList', {
    ...option,
  })
}
    
export {
  getMap,
  getCityList,
  getHitoryList,
  getHotList,
}
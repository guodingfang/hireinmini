
import request from '../utils/request'

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

// 根据经纬度获取位置信息
const getLocationInfo = (params = {}) => {
  const { againLocation = false } = params
  return new Promise((resolve, reject) => {
    // 如果已经有位置信息，并且不需要重新定位的话，直接拿缓存中的数据
    if(wx.getStorageSync('locationInfo') && !againLocation) {
      resolve(wx.getStorageSync('locationInfo'))
      return
    }
    
    getLocation(({latitude, longitude}) => {
      getMap().reverseGeocoder({
        location: `${latitude},${longitude}`,
        success({ result }) {
          const { ad_info = null, address } = result
          const info = {
            cityCode: ad_info.city_code,
            city: ad_info.city,
            province: ad_info.province,
            district: ad_info.district,
            location: ad_info.location,
            address,
          }
          wx.setStorageSync('locationInfo', info)
          resolve(info)
        }
      })
    }, (err) => {
      console.log('[定位失败]', err)
      reject(err)
    })
  })
}

// 根据城市名获取位置信息
const addressGetinfo = (params) => {
 const { city = '' } = params
 if(!city) return
  return new Promise((resolve, reject) => {
    getMap().geocoder({
      address: city,
      success({ result }) {
        const { address_components, ad_info, location } = result
        const info = {
          cityCode: ad_info.adcode,
          city: address_components.city,
          province: address_components.province,
          district: address_components.district,
          location: location,
          address: '',
        }
        wx.setStorageSync('locationInfo', info)
        resolve(info)
      }
    })
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
  getLocationInfo,
  addressGetinfo,
  getCityList,
  getHitoryList,
  getHotList,
}
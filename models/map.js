
import request from '../utils/request'
import { storageSet } from '../utils/storage'
import QQMapWX from '../libs/qqmap-wx-jssdk.min.js';
import { qqMapkey } from '../config.js';

import { getLocation } from './user'

// 获取QQ地图实例对象
export const getMap = () => {
  return new QQMapWX({key: qqMapkey})
}

/**
 * 获取城市列表
 * @param {*} option 
 */
export const getCityList = (option = {}) => {
  return request.post('/Index/getCityList', {
    ...option
  })
}

export const getCityInfo = (option = {}) => {
  return request.post('/Index/getCityCounty', {
    ...option
  })
}

// 根据经纬度获取位置信息
export const getLocationInfo = (params = {}) => {
  const { againLocation = false } = params
  return new Promise((resolve, reject) => {
    // 如果已经有位置信息，并且不需要重新定位的话，直接拿缓存中的数据
    if(wx.getStorageSync('cityinfo') && !againLocation) {
      resolve(wx.getStorageSync('cityinfo'))
      return
    }
    getLocation(({latitude, longitude}) => {
      getMap().reverseGeocoder({
        location: `${latitude},${longitude}`,
        success({ result }) {
          const { ad_info = null, address } = result
          const info = {
            cityCode: ad_info.city_code.slice(3),
            city: ad_info.city,
            province: ad_info.province,
            district: ad_info.district,
            location: ad_info.location,
            address,
          }
          storageSet('locationCity', info)
          storageSet('cityinfo', info)
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
export const addressGetinfo = (params) => {
 const { city = '', code = '' } = params
 if(!city) return
  return new Promise((resolve, reject) => {
    getMap().geocoder({
      address: city,
      region: city,
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
        storageSet('cityinfo', info)
        resolve(info)
      }
    })
  })
}

/**
 * 添加历史城市记录
 * @param {*} option 
 */
export const addUserCity =  (option = {}) => {
  return request.post('/Index/addUserCity', {
    ...option
  })
}

/**
 * 获取历史城市
 * @param {*} option 
 */
export const getHitoryList = (option = {}) => {
  return request.post('/Index/getHitoryList', {
    ...option
  })
}

/**
 * 获取热门城市
 * @param {*} option 
 */
export const getHotList = (option = {}) => {
  return request.post('/Index/getHotList', {
    ...option,
  })
}

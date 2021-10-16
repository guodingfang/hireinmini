import { storageGet, storageSet } from './storage'
import { login } from '../models/user'

export const isLogin = () => {
	const { userid = '' } = getUserInfo(['userid'])
	if(userid) return true
	login();
	return false
}

// 获取Storage存储的userinfo信息
export const getUserInfo = (params = []) => {
	return getStorageInfo('userinfo', params)
}

// 获取Storage存储的cityInfo信息
export const getCityInfo = (params = []) => {
	return getStorageInfo('cityinfo', params)
}

// 获取Storage存储的信息
export const getStorageInfo = (key, params) => {
	const result = {};
	if(params.length === 0) return result
	const info = storageGet(key)
	params.forEach(param => {
		result[param] = info[param]
	})
	return result
}

/**
 * Promise封装
 * @param {*} func 
 */
export const promisic = (func) => {
  return function (params={}) {
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      });
      func(args);
    })
  }
}

/**
 * 获取Tab栏高度
 * @param {*} workInfo 
 */
export const judgeTabBarHeight = () => {
	const app = getApp();
	const { workInfo } = app.globalData;
	if(workInfo && workInfo.model) {
		const { model } = workInfo;
		if (model.search('iPhone X') != -1 || 
			model.search('iPhone 11') != -1 ||
			model.search('unknown<iPhone12,1>') != -1
		) {
			return {
				tabHeight: 150,
				paddingBottom: 50,
			};
		}
		return {
			tabHeight: 100,
			paddingBottom: 0,
		}
	}
}

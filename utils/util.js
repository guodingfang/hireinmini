import { storageGet, storageSet } from './storage'
import { login } from '../models/user'

export const isLogin = () => {
	const { userid = '' } = getUserInfo(['userid'])
	if(userid) return true
	login();
	return false
}

export const judgeVip = async () => {
	const { vip = '' } = getUserInfo(['vip'])
	const isVip = vip && vip.vipsign > 0
	if(!isVip) {
		const { confirm = false } = await wx.showModal({
			title: '提示',
			content: '该功能需要成为VIP才可使用',
			confirmText: '去开通',
		})
		if(confirm) {
			wx.navigateTo({
				url: '/pages/vip/vip',
			})
		}
	}
	return isVip
}

// 获取Storage存储的userinfo信息
export const getUserInfo = (params = []) => {
	return getStorageInfo('userinfo', params)
}

// 获取Storage存储的cityInfo信息
export const getCityInfo = (params = []) => {
	return getStorageInfo('cityinfo', params)
}

// 获取Storage存储的locationCityInfo信息
export const getLocationCityInfo = (params = []) => {
	if (storageGet('locationCity')) {
		return getStorageInfo('locationCity', params)
	} else {
		return getStorageInfo('cityinfo', params)
	}
}

// 获取Storage存储的信息
export const getStorageInfo = (key, params = []) => {
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

// 函数 padLeftZero 的作用：如果月份为1位（如9），则在其左边补0（变为09）
const padLeftZero =(str) => {
  return ('00' + str).substr(str.length);
}

/**
 * 时间戳转换为时间
 * date 时间戳
 * fmt  yyyy-MM-dd HH:mm:ss
 */
export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  // 遍历这个对象
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
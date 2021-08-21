const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

//获取当前时间，格式YYYY-MM-DD
const getNowFormatDate = () => {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

// 获取Storage 存储的 userinfo 信息
const getUserInfo = (params = []) => {
	const result = {};
	if(params.length === 0) return result

	const info = wx.getStorageSync('logininfo')
	params.forEach(param => {
		result[param] = info[param]
	})
	return result
}

// 去字符串首位空格
const trim = (str) => {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * Promise封装
 * @param {*} func 
 */
const promisic = (func) => {
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

const judgeTabBarHeight = (workInfo) => {
	if(workInfo && workInfo.model) {
		console.log('workInfo', workInfo)
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

export {
	formatTime,
	getNowFormatDate,
	getUserInfo,
	trim,
	promisic,
	judgeTabBarHeight
}
export const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//获取当前时间，格式YYYY-MM-DD
export const getNowFormatDate = () => {
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


// 去字符串首位空格
export const trim = (str) => {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 参数{object}拼接为url参数{string}
export const gainParams = (args) => {
  let params = '';
  for(let key in args) {
    params += `&${key}=${args[key]}`;
  }
  return params;
}

// 银行卡验证
export const bankCardFormat = (str = '') => {
	if(!str) return ''
	return str.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ')
}

// 验证数据
export const verifyData = (data, params) => {
  let verify = true
  for (let i = 0; i < params.length; i++) {
    const item = params[i]
    if(!data[item.type]) {
      verify = false
      wx.showToast({
        title: `请填写入${item.label}`,
        icon: 'none'
      })
      break 
    }
  }
  return { verify }
}
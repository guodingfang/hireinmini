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
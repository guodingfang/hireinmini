export const storageGet = (key) => {
  return wx.getStorageSync(key)
}

export const storageSet = (key, value) => {
  return wx.getStorageSync(key, value)
}

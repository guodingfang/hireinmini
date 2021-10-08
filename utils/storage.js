export const storageGet = (key) => {
  return wx.getStorageSync(key)
}

export const storageSet = (key, value) => {
  return wx.setStorageSync(key, value)
}

export const storageRemove = (key) => {
  return wx.removeStorageSync(key)
}

export const storageClear = () => {
  return wx.clearStorageSync()
}


export const formVerify = (data) => {
  const { companyname, contact, phone, citycode, address, mainbusiness } = data
  if (!companyname) {
    wx.showToast({
      title: '请填写公司名称',
      icon: 'none',
    })
    return false
  }
  if (!contact) {
    wx.showToast({
      title: '请填写联系人',
      icon: 'none',
    })
    return false
  }
  if (!phone) {
    wx.showToast({
      title: '请填写联系电话',
      icon: 'none',
    })
    return false
  }
  if (!citycode) {
    wx.showToast({
      title: '请选择城市',
      icon: 'none',
    })
    return false
  }
  if (!address) {
    wx.showToast({
      title: '请选择详细地址',
      icon: 'none',
    })
    return false
  }

  if(mainbusiness === '{}') {
    wx.showToast({
      title: '请选择主营业务标签',
      icon: 'none',
    })
    return false
  }
  return true
}
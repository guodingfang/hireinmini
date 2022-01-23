import { getCompanyMainProductList, deleteMainProduct } from '../../models/goods'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 10,
    productList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      companyid: options.companyid
    })
  },

  async getCompanyMainProductList() {
    const { data = [] } = await getCompanyMainProductList({
      companyid: this.data.companyid,
      page: this.data.page,
      pagesize: this.data.pagesize
    })
    this.setData({
      productList: data
    })
  },
  
  onAddProduct() {
    wx.navigateTo({
      url: `/pages/add-product/add-product?companyid=${this.data.companyid}`,
    })
  },

  async onDelete(e) {
    const { prodid } = e.currentTarget.dataset
    const { errcode, errmsg } = await deleteMainProduct({
      prodid
    })
    if(errcode !== 0) {
      wx.showToast({
        title: errmsg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.setData({
        productList: this.data.productList.filter(item => item.prodid !== prodid)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCompanyMainProductList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})
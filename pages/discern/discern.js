// pages/discern/discern.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: false,
    checked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  takePhoto() {
    if(this.data.checked != true){
      wx.showToast({
        icon: "none",
        title: '请勾选授权书',
      })
      return;
    }
    this.setData({
      photo: true
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log("res===", res);
        
      }
    })
  },
  checkboxChange(e){
    var value = e.currentTarget.dataset.value;
    value = !value;
    this.setData({
      checked: value
    })
    console.log("e==", this.data.checked );
  },
  error(e) {
    console.log(e.detail)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
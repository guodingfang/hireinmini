// pages/company-manage/company-manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyid: '',
    list: [
      {
        type: 'img',
        backgroundColor: '#E6FFF5',
        btnColor: '#62DAAB',
        title: '精选图片',
      },
      {
        type: 'video',
        backgroundColor: '#FFEDE6',
        btnColor: '#FF9D73',
        title: '精选视频',
      },
      {
        type: 'edit',
        backgroundColor: '#FFF4E6',
        btnColor: '#FFC473',
        title: '公司修改',
      },
      {
        type: 'product',
        backgroundColor: '#E6EEFF',
        btnColor: '#6395F9',
        title: '产品管理',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { companyid = '' } = options
    this.setData({
      companyid
    })
  },

  onSkipModel(e) {
    const { companyid } = this.data
    const { type = '' } = e.currentTarget.dataset
    switch(type) {
      case 'img':

        break;
      case 'video':

        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/company-setup/company-setup?companyid=${companyid}`,
        })
        break;
      case 'product':
        wx.navigateTo({
          url: `/pages/product-manage/product-manage?companyid=${companyid}`,
        })
        break;
      default:
        console.log('无效')
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

  }
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: [
      {
        type: 'username',
        label: '真实姓名',
        placeholder: '必填，输入真实姓名',
        value: '',
        require: true
      },
      {
        type: 'tel',
        label: '联系电话',
        placeholder: '必填，输入联系电话',
        value: '',
        require: true
      },
      {
        type: 'tel',
        label: '身份证号',
        placeholder: '必填，输入身份证号',
        value: '',
        require: true
      },
      {
        type: 'ohterUer',
        label: '其他联系人',
        placeholder: '输入其他联系人',
        value: '',
        require: false
      },
      {
        type: 'companyUser',
        label: '公司负责人',
        placeholder: '输入其他输入公司负责人联系人',
        value: '',
        require: false
      },
      {
        type: 'company',
        label: '隶属关系或隶属公司',
        placeholder: '输入隶属关系或隶属公司',
        value: '',
        require: false,
        flex: 'column'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onChangeInput(e) {
    const { type, value } = e.detail
    this.setData({
      formData: this.data.formData.map(item => item.type === type
        ? { ...item, value }
        : item)
    })
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
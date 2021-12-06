import { getArticleDetails } from '../../models/article'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    answerid: '',
    isShowAllAnswerBtn: false,
    userInfo: {},
    details: {},
    answerList: [],
    showAnswerList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id = '', answerid = '' } = options
    this.setData({ id, answerid })
  },

  async getArticleDetails () {
    const { q, a = [] } = await getArticleDetails({
      questionid: this.data.id
    })
    this.setData({
      details: q,
      userInfo: {
        ...q.user,
        created: q.qatime,
        userid: q.userid,
        shareid: q.id
      }
    })

    const answerList = a.map(item => ({
      ...item,
      userInfo: {
        ...item.user,
        userid: item.userid,
        created: item.qatime,
        shareid: item.id
      }
    }))
    if(this.data.answerid) {
      const showAnswerList = answerList.filter(item => item.id === this.data.answerid)
      const _answerList = answerList.filter(item => item.id !== this.data.answerid)
      this.setData({
        isShowAllAnswerBtn: true,
        showAnswerList: answerList.filter(item => item.id === this.data.answerid),
        answerList: [...showAnswerList, ..._answerList]
      })
    } else {
      this.setData({
        answerList,
        showAnswerList: answerList,
      })
    }
  },

  onShowAllAnswer () {
    this.setData({
      showAnswerList: this.data.answerList,
      isShowAllAnswerBtn: false  
    })
  },

  onSkipAnswer() {
    wx.navigateTo({
      url: `/pages/answer-publish/answer-publish?id=${this.data.id}`,
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
    this.getArticleDetails()
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
	async onShareAppMessage (e) {
    console.log('e', e)
    let path = `/pages/index/index?path=article-details&needLogin=need&id=${this.data.id}`
		if (e.from === 'button') {
      const { id, type } = e.target.dataset
      if (type === 'answer' && id) {
        path = `${path}&answerid=${id}`
      }
    }
    return {
      title: '携手开启数字租赁服务新生态',
      path
    }
	},
})
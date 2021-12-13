import { getArticleDetails, acceptAnswer } from '../../models/article'
import { getUserInfo } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    answerid: '',
    isShowAllAnswerBtn: false,
    isCurrentUser: false,
    isEnd: false,
    userInfo: {},
    details: {},
    answerList: [],
    showAnswerList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id = '', source = 'private', answerid = '' } = options
    this.setData({ id, source, answerid })
  },

  async getArticleDetails () {
    const { q, a = [] } = await getArticleDetails({
      questionid: this.data.id
    })
    const { userid = '' } = getUserInfo(['userid'])
    this.setData({
      details: q,
      isCurrentUser: userid === q.userid,
      isEnd: q.solved === '1',
      userInfo: {
        ...q.user,
        created: q.qatime,
        userid: q.userid,
        shareid: q.id,
        goldcoin: q.goldcoin,
        solved: q.solved
      }
    })

    const answerList = a.map(item => ({
      ...item,
      userInfo: {
        ...item.user,
        userid: item.userid,
        created: item.qatime,
        shareid: item.id,
        goldcoin: item.goldcoin,
        solved: item.solved
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

  async onAcceptAnswer (e)  {
    const { answerid } = e.detail
    const { userInfo, details } = this.data
    if(details.solved === '1') return
    const { errcode } = await acceptAnswer({
      questionid: userInfo.shareid,
      userid: userInfo.userid,
      answerid
    })
    if (errcode === 0) {
      wx.showToast({
        title: '已采纳',
        icon: 'none'
      })
      this.setData({
        details: {
          ...details,
          solved: '1'
        },
        isEnd: true,
        showAnswerList: this.data.showAnswerList.map(item => item.id === answerid
          ? {...item, userInfo: {...item.userInfo, solved: '1'}}
          : item)
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
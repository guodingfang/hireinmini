import request from '../utils/request'

/**
 * 根据关键字获取服务页-租赁列表
 * @param {*} option 
 */
const getKeyWordReleaseList = (option = {}) => {
  return request.post('/Release/releaseList', {
    ...option
  })
}

/**
 * 拨打电话
 * @param {*} option 请求参数
 */
const addUserDialRecord = (option = {}) => {
  return request.post('/Release/addUserDialRecord', {
    ...option
  })
}

/**
 * 添加喜欢租赁
 * @param {*} option 请求参数
 */
const addLikeRelease = (option = {}) => {
  return request.post('/Release/addPraise', {
    ...option
  })
}

/**
 * 删除已喜欢租赁
 * @param {*} option 
 */
const deleteLikeRelease = (option = {}) => {
  return request.post('/Release/deletePraise', {
    ...option
  })
}

/**
 * 添加对租赁信息的评论
 * @param {*} option 
 */
const addComment = (option = {}) => {
  return request.post('/Release/addComment', {
    ...option
  })
}

/**
 * 发现页信息流查询接口
 * @param {*} option 
 */
const getDiscoverMsgList = (option = {}) => {
  return request.post('/Release/getDiscoverMsgList', {
    ...option
  })
}

/**
 * 获取租赁详情
 * @param {*} option 
 */
const getReleaseDetail = (option = {}) => {
  return request.post('/Release/getMsgReleaseDetail', {
    ...option,
  })
}
// 其他热门
const getOtherHosList = (option = {}) => {
  return request.post('/Release/otherHostMsgList', {
    ...option
  })
}

// 增加发布信息流
const addMsgRelease = (option = {}) => {
  return request.post('/Release/addMsgRelease', {
    ...option
  })
}

// 推荐租赁商列表
const getRecommendCompanyList = (option = {}) => {
  return request.post('/Company/getRecommendCompanyList', {
    ...option
  })
}

export {
  getDiscoverMsgList,
  getKeyWordReleaseList,
  addUserDialRecord,
  addLikeRelease,
  deleteLikeRelease,
  addComment,
  getReleaseDetail,
  getOtherHosList,
  addMsgRelease,
  getRecommendCompanyList
}
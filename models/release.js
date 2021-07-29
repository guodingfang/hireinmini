import request from '../utils/request'

/**
 * 获取发现页-租赁列表
 * @param {*} option 
 */
const getReleaseList = (option = {}) => {
  return request.post('/Release/newRelease', {
    ...option
  })
}
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

const getDiscoverMsgList = (option = {}) => {
  return request.post('/Release/getDiscoverMsgList', {
    ...option
  })
}

export {
  getDiscoverMsgList,
  getReleaseList,
  getKeyWordReleaseList,
  addUserDialRecord,
  addLikeRelease,
  deleteLikeRelease,
  addComment
}
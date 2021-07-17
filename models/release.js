import request from '../utils/request'

/**
 * 获取租赁列表
 * @param {*} option 
 */
const getReleaseList = (option = {}) => {
  return request.post('/Release/newRelease', {
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

export {
  getReleaseList,
  addUserDialRecord,
  addLikeRelease,
  deleteLikeRelease,
  addComment
}
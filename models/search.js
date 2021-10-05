import request from '../utils/request'

/**
 * 获取历史搜索
 * @param {*} option 
 */
const getSearchHistoryList = (option = {}) => {
  return request.post('/Search/getSearchHistoryList', {
    ...option
  })
}

/**
 * 获取热门搜索
 * @param {*} option 
 */
const getSearchHotList = (option = {}) => {
  return request.post('/Search/getSearchHotList', {
    ...option,
  })
}

/**
 * 根据关键字获取搜素信息
 * @param {*} option 
 */
// const getSearchList = (option = {}) => {
//   return request.post('/Search/getSearchList', {
//     ...option,
//   })
// }

const getSearchList = (option = {}) => {
  return request.post('/Search/search', {
    ...option,
  })
}

/**
 * 清空历史搜索
 * @param {*} option 
 */
const clearHisSearch = (option = {}) => {
  return request.post('/Search/clearHisSearch', {
    ...option,
  })
}

export {
  getSearchHistoryList,
  getSearchHotList,
  getSearchList,
  clearHisSearch
}
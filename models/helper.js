import request from '../utils/request'

/**
 * 知识推荐
 * @param {*} option 
 */
export const getknowledgeRecommend = (option = {}) => {
  return request.post('/Assistant/leasingKnowledgeRecommend', {
    ...option
  })
}

/**
 * 租赁知识分类列表
 * @param {*} option 
 */
export const getKnowledgeList = (option = {}) => {
  return request.post('/Assistant/leasingKnowledgeList', {
    ...option
  })
}

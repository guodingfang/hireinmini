import { re } from '../utils/pinYin'
import request from '../utils/request'

/**
 * 知识推荐
 * @param {*} option 
 */
const getknowledgeRecommend = (option = {}) => {
  return request.post('/Assistant/leasingKnowledgeRecommend', {
    ...option
  })
}

/**
 * 租赁知识分类列表
 * @param {*} option 
 */
const getKnowledgeList = (option = {}) => {
  return request.post('/Assistant/leasingKnowledgeList', {
    ...option
  })
}

/**
 * 在线问答推荐
 * @param {*} option 
 */
const getTopNQuestions = (option = {}) => {
  return request.post('/QuestionAnswer/getTopNQuestions', {
    ...option
  })
}

/**
 * 在线问答列表
 * @param {*} option 
 */
const getQuestionsList = (option = {}) => {
  return request.post('/QuestionAnswer/getQuestionsList', {
    ...option
  })
}

/**
 * 在线问答详情
 * @param {*} option 
 */
const getQuestionAndAnswerDetail = (option = {}) => {
  return request.post('/QuestionAnswer/getQuestionAndAnswerDetail', {
    ...option
  })
}

export {
  getknowledgeRecommend,
  getKnowledgeList,
  getTopNQuestions,
  getQuestionsList,
  getQuestionAndAnswerDetail
}
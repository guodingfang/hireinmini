
import request from '../utils/request'
import { promisic, getUserInfo } from '../utils/util'

/**
 * 我的在线问答列表
 * @param {*} option 
 */
export const getArticleList = (option = {}) => {
  return request.post('/QuestionAnswer/myQuestionAndAnswer', {
    ...option
  })
}

/**
 * 在线问答推荐
 * @param {*} option 
 */
export const getTopArticleList = (option = {}) => {
  return request.post('/QuestionAnswer/getTopNQuestions', {
    ...option
  })
}

/**
 * 发布问答
 * @param {*} option 
 */
export const publishArtic = (option = {}) => {
  return request.post('/QuestionAnswer/addQuestionAnswer', {
    ...option
  })
}

/**
 * 在线问答详情
 * @param {*} option 
 */
export const getArticleDetails = (option = {}) => {
  return request.post('/QuestionAnswer/getQuestionAndAnswerDetail', {
    ...option
  })
}


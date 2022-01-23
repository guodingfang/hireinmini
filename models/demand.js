
import request from '../utils/request'
import { promisic } from '../utils/util'

/**
 * 发布需求单
 * @param {*} option 
 */
export const addRequirement = (option = {}) => {
  return request.post('/Requirement/addRequirement', {
    ...option
  })
}

/**
 * 需求单列表
 * @param {*} option 
 */
export const getRequirementList = (option = {}) => {
  return request.post('/Requirement/requirementList', {
    ...option
  })
}

/**
 * 需求详情
 * @param {*} option 
 */
export const getRequriementDetail = (option = {}) => {
  return request.post('/Requirement/requriementDetail', {
    ...option
  })
}

/**
 * 修改需求单
 * @param {*} option 
 */
export const editRequirement = (option = {}) => {
  return request.post('/Requirement/editRequirement', {
    ...option
  })
}

/**
 * 需求单支付佣金
 * @param {*} option 
 */
export const payRequirement = (option = {}) => {
  return request.post('/Requirement/payRequirement', {
    ...option
  })
}

/**
 * 删除需求单图片
 * @param {*} option 
 */
export const deletePictures = (option = {}) => {
  return request.post('/Requirement/deletePictures', {
    ...option
  })
}


/**
 * 查询未付款需求单数量
 * @param {*} option 
 */
export const getUnPayCount = (option = {}) => {
  return request.post('/Requirement/getUnPayCount', {
    ...option
  })
}

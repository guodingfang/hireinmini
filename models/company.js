
import request from '../utils/request'
import { promisic } from '../utils/util'

/**
 * 获取公司信息
 * @param {*} option 
 */
export const getCompanyInfo = (option = {}) => {
  return request.post('/Company/getCompanyInfo', {
    ...option
  })
}

/**
 * 获取公司主要业务标签
 * @param {*} option 
 */
export const getCompanyLabels = (option = {}) => {
  return request.post('/Company/getMainBusinessLabel', {
    ...option
  })
}

/**
 * 创建公司
 * @param {*} option 
 */
export const createCompany = (option = {}) => {
  return request.post('/Company/createCompany', {
    ...option
  })
}

/**
 * 编辑公司
 * @param {*} option 
 */
export const editCompany = (option = {}) => {
  return request.post('/Company/editCompany', {
    ...option
  })
}

/**
 * 获取企业列表
 * @param {*} option 
 */
export const getCompanyList = (option = {}) => {
  return request.post('/Company/getCompanyList', {
    ...option
  })
}

/**
 * 申请加入公司
 * @param {*} option 
 */
export const joinCompany = (option = {}) => {
  return request.post('/Company/joinCompany', {
    ...option
  })
}
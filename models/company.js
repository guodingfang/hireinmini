
import request from '../utils/request'
import { promisic } from '../utils/util'

/**
 * 在线问答推荐
 * @param {*} option 
 */
const getCompanyLabels = (option = {}) => {
  return request.post('/Company/getMainBusinessLabel', {
    ...option
  })
}

/**
 * 创建公司
 * @param {*} option 
 */
const createCompany = (option = {}) => {
  return request.post('/Company/createCompany', {
    ...option
  })
}

/**
 * 编辑公司
 * @param {*} option 
 */
const editCompany = (option = {}) => {
  return request.post('/Company/editCompany', {
    ...option
  })
}
    
export {
  getCompanyLabels,
  createCompany,
  editCompany
}
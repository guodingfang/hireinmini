import request from '../utils/request'
import { promisic } from '../utils/util'


/**
 * 获取租赁商主营产品列表
 * @param {*} option 
 */
export const getCompanyGoodsList = (option = {}) => {
  return request.post('/Company/companyMainProductList', {
    ...option
  })
}

/**
 * 获取租赁商主营产品详情
 * @param {*} option 
 */
export const getGoodsDetail = (option = {}) => {
  return request.post('/Company/getGoodsDetail', {
    ...option
  })
}

/**
 * 公司主营产品列表
 * @param {*} option 
 */
export const getCompanyMainProductList = (option = {}) => {
  return request.post('/Company/companyMainProductList', {
    ...option
  })
}

/**
 * 主营产品录入
 * @param {*} option 
 */
export const addMainProduct = (option = {}) => {
  return request.post('/Company/addMainProduct', {
    ...option
  })
}

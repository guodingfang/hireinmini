import request from '../utils/request'
import { promisic } from '../utils/util'


/**
 * 获取租赁商主营产品列表
 * @param {*} option 
 */
const getCompanyGoodsList = (option = {}) => {
  return request.post('/Company/companyRecommendGoodsList', {
    ...option
  })
}

/**
 * 获取租赁商主营产品详情
 * @param {*} option 
 */
const getGoodsDetail = (option = {}) => {
  return request.post('/Company/getGoodsDetail', {
    ...option
  })
}


export {
  getCompanyGoodsList,
  getGoodsDetail
}
import request from '../utils/request'
/**
 * 热租商品
 * @param {*} option 
 */
const getHighRentRateProduct = (option = {}) => {
  return request.post('/Goods/getHighRentRateProduct', {
    ...option
  })
}

/**
 * 设计方案
 * @param {*} option 
 */
const getRecommendSchemeList = (option = {}) => {
  return request.post('/Hotel/getRecommendSchemeList', {
    ...option
  })
}

/**
 * 品质二手推荐
 * @param {*} option 
 */
const getTopSell = (option = {}) => {
  return request.post('/Shop/quality2ndHandTopN', {
    ...option
  })
}

export {
  getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
}
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
  return request.post('/SecondHandMarket/getTopNSell2ndList', {
    ...option
  })
}

export {
  getHighRentRateProduct,
  getRecommendSchemeList,
  getTopSell
}
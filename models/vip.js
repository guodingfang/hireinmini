import request from '../utils/request'
import { getUserInfo, promisic } from '../utils/util'


/**
 * VIP资费列表
 * @param {*} option 
 */
export const getVIPPriceList = (option = {}) => {
  return request.post('/User/getVIPPriceList', {
    ...option
  })
}

/**
 * 获取VIP优惠价列表
 * @param {*} option 
 */
export const getCoupon = (option = {}) => {
  return request.post('/Services/getCoupon', {
    ...option
  })
}

/**
 * 财务VIP资费查询
 * @param {*} option 
 */
export const getFinanceVIPPriceList = (option = {}) => {
  return request.post('/User/getFinanceVIPPriceList', {
    ...option
  })
}

/**
 * VIP充值/续费
 * @param {*} option 
 */
export const vipCharge = (option = {}) => {
  const { price, ...args } = option
  const { wxappid: openid } = getUserInfo(['wxappid'])
  return request.post('/User/vipCharge', {
    price: (price * 100).toFixed(0),
    ...args,
    openid
  })
}

/**
 * VIP购买动态
 * @param {*} option 
 */
export const getPurchaseLog = (option = {}) => {
  return request.post('/User/getPurchaseLog', {
    ...option,
  })
}

/**
 * 查询优惠券领取情况
 * @param {*} option 
 */
export const isUserHaveCoupon = (option = {}) => {
  return request.post('/User/isUserHaveCoupon', {
    ...option,
  })
}

import request from '../utils/request'
import { promisic, getUserInfo } from '../utils/util'


/**
 * 统一下单支付接口
 * @param {*} option 
 */
export const payOrder = async (option = {}) => {
  const { wxappid: openid } = getUserInfo(['wxappid'])
  const {
    jsApiParameters: payResult,
    msg = '',
    result = false
  } =  await request.post('/WxPay/payOrder', {
    ...option,
    openid
  })
  if(!result) {
    return { code: -1, msg }
  }
  // 调起支付接口
  try {
    await promisic(wx.requestPayment)({
      timeStamp: payResult.timeStamp,
      nonceStr: payResult.nonceStr,
      package: payResult.package,
      signType: payResult.signType,
      paySign: payResult.paySign,
    })
    return { code: 0, msg: '支付成功' }
  } catch (e) {
    return { code: -1, msg: '取消支付' }
  }
}

/**
 * 提现到银行卡
 * @param {*} option 
 */
export const withdrawBankCard = (option = {}) => {
  return request.post('/User/bankCardCashout', {
    ...option
  })
}

/**
 * 余额账户分类字典
 * @param {*} option 
 */
export const getAccountType = (option = {}) => {
  return request.post('/User/getAccountType', {
    ...option
  })
}

/**
 * 用户钱包余额
 * @param {*} option 
 */
export const getUserBalance = (option = {}) => {
  return request.post('/User/getUserBalance', {
    ...option
  })
}

/**
 * 账户余额及分类汇总查询
 * @param {*} option 
 */
export const getBalanceSum = (option = {}) => {
  return request.post('/User/getBalanceSum', {
    ...option
  })
}

/**
 * 账户余额流水
 * @param {*} option 
 */
export const getUserBalanceLog = (option = {}) => {
  return request.post('/User/getUserBalanceLog', {
    ...option
  })
}

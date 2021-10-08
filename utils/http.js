import errorHandle from './errorHandle'
import { getUserInfo } from './util'
import { storageGet } from './storage'

class HttpRequest {
  constructor (baseURL) {
    this.baseURL = baseURL
  }
  
  httpRequest(options) {
    // const isNeedLogin = this.judgeIsNeedNotLogin(options.url)
    // if(!isNeedLogin) return 
    const newOptions = Object.assign(this.getInsideConfig(), options)
    return new Promise((resolve, reject) => {
      this.request({
        ...newOptions,
        resolve,
        reject
      })
    })
  }

  // judgeIsNeedNotLogin(url) {
  //   const { userid = '' } = storageGet('userinfo')
  //   if (userid) {
  //     return true
  //   }
  //   const notLoginList = storageGet('notLoginList') || []
  //   return notLoginList.find(item => item === `/${url}`)
  // }

  getInsideConfig() {
    return {
      baseURL: this.baseURL,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {},
      method: 'GET',
    }
  }

  request({
    baseURL,
    url,
    data,
    method,
    resolve,
    reject,
    header,
  }) {
    wx.request({
      url: `${baseURL}${url}`,
      data,
      method,
      header,
      dataType: 'json',
      responseType: 'text',
      success(res) {
        resolve(res.data);
      },
      fail(res) {
        errorHandle(err)
        reject(res)
      },
      complete(res) {
        // 调用完成回调
      },
    })
  }

  get(url, config) {
    const options = Object.assign({
      method: 'GET',
      url
    }, config)
    return this.httpRequest(options)
  }
  post(url, data) {
    const commonParams = getUserInfo([
      'accesstoken',
      'userid',
      'unionid'
    ])
    // console.log('commonParams', commonParams)
    return this.httpRequest({
      method: 'POST',
      url,
      data: {
        ...commonParams,
        ...data,
      }
    })
  }
}

export default HttpRequest
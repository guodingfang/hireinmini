import HttpRequest from './http'
import config from '../config'

const baseUrl = config.baseUrl

const request = new HttpRequest(baseUrl)

export default request

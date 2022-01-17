
import request from '../utils/request'
import { promisic } from '../utils/util'

/**
 * 发布需求单
 * @param {*} option 
 */
export const addRequirement = (option = {}) => {
  return request.post('/Requirement/addRequirement', {
    ...option
  })
}

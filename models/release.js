import request from '../utils/request'

const getReleaseList = (option) => {
  return request.post('/Release/newRelease', {
    ...option
  })
}

export {
  getReleaseList
}
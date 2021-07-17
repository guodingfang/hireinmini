import request from '../utils/request'

const getCarousel = (option = {}) => {
  return request.post('/Index/getSlideshow', {
    ...option
  })
}

export {
  getCarousel
}
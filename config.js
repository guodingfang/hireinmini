const devUrl = `https://wxmini.ilinking.com.cn`
const porUrl = `https://wxapp.ilinking.com.cn`

const url = false ? devUrl : porUrl

const config = {
  baseUrl: `${url}/index.php/WxMini`,
  imgUrl: `${url}/Public/`,
  imgUrls: `${url}/upload/`,
  videoUrl: 'http://file.ilinking.com.cn/',
  qrcodeUrl: 'https://hireminilink.ilinking.com.cn',
};

export const remoteImagesUrl = `${url}/Public/WxMiniWeb/images`

export const qqMapkey = '4GIBZ-HG4WO-OZ2WT-SH2NR-KHK75-FBFWP'

export default config
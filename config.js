const devUrl = `https://wxmini.ilinking.com.cn/index.php`
const porUrl = `https://wxapp.ilinking.com.cn/index.php`

const url = true ? devUrl : porUrl

const config = {
  baseUrl: `${url}/WxMini`,
  imgUrl: `https://wxapp.ilinking.com.cn/Public/`,
  imgUrls: 'https://wxapp.ilinking.com.cn/upload/',
  videoUrl: 'http://file.ilinking.com.cn/',
  qrcodeUrl: 'https://hireminilink.ilinking.com.cn'
};


export default config
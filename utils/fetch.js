/**
 *进行ajax请求
 *param url 请求地址
 *param 请求参数
 */
module.exports = (url, method = 'GET', params = {}) => {
    return new Promise(
        (resolve, reject) => {
            wx.request({
                url: url,
                data: Object.assign({}, params),
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method,
                success: resolve,
                fail: reject
            });
        }
    );
};
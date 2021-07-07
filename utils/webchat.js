let setStorage = (key, data) => {
    return new Promise(
        (resolve, reject) => {
            wx.setStorage({
                key,
                data,
                success: resolve,
                fail: reject
            });
        }
    );
};
let getStorage = key => {
    return new Promise(
        (resolve, reject) => {
            wx.getStorage({
                key,
                success: resolve,
                fail: reject
            });
        }
    );
};
let showToast = (msg, icon, duration = 1500) => {
    return new Promise(
        (resolve, reject) => {
            wx.showToast({
                title: msg,
                icon: icon,
                duration: duration,
                success: resolve,
                fail: reject
            })
        }
    );
};
let makePhoneCall = (phoneNumber) => {
    return new Promise(
        (resolve, reject) => {
            wx.makePhoneCall({
                phoneNumber: phoneNumber, //仅为示例，并非真实的电话号码,
                success:resolve,
                fail:reject
            })
        }
    );
}
module.exports = {
    setStorage,
    getStorage,
    showToast,
    makePhoneCall,
};
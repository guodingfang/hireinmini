import tool from './tool';
import fetch from './fetch';
import { Config } from './config';
let config = new Config();
let getVerification = (_this, url) => {
    let phone = _this.data.phone;
    let reguserid = wx.getStorageSync('userinfo').reguserid;
    if (tool.isEmpty(phone, '手机号不能为空')) {
        return;
    }
    let phonePreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let verification = _this.data.verification;
    if (tool.isPreg(phonePreg, phone, '手机号格式有误')) {
        return;
    }
    if (verification == '获取验证码') {
        _this.setData({ verification: 60 + 's' });
        tool.intervalDIY(_this);
        //开始请求
        fetch(url, 'POST', { phone, reguserid }).then(
            value => {
                if (value.data.code == 0) {
                    _this.setData({ verificationCode: value.data.smscode });
                } else {
                    tool.clearInterval();
                    config.modaljy(value.data.message);
                }
            }
        );
    }
};
let submit = (_this, e, callback) => {
    let { phone, verification } = e.detail.value;
    if (tool.isEmpty(phone, '手机号不能为空')) {
        return;
    }
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (tool.isPreg(phoneReg, phone, '手机号格式有误')) {
        return;
    }
    if (tool.isEmpty(verification, '验证码不能为空')) {
        return;
    }
    if (verification != _this.data.verificationCode) {
        config.modaljy('请输入正确验证码');
        return;
    }
    callback({phone,verification});
};
module.exports = {
    getVerification,
    submit,
}
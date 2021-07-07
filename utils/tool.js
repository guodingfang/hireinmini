import webchat from './webchat';
import { Config } from '../utils/config';
import PinYin from './pinYin';
let config = new Config();
//清除所有空格
let trim = (str, is_global) => {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
};
//提示框
let toast = msg => {
    wx.showToast({ title: msg, icon: 'none', image: '../../images/errors.png' });
};
// 定时器60s，可清除
let intervalDIY = (_this) => {
    var times = [];
    for (let i = 59; i >= 0; i--) {
        times.push(i);
    }
    webchat.setStorage('identity', true).then(
        setting => {
            times.reduce(
                (prev, current, index) => {
                    return prev.then(
                        value => {
                            return new Promise(
                                (resolve, reject) => {
                                    webchat.getStorage('identity').then(
                                        identity => {
                                            if (identity.data) {
                                                setTimeout(
                                                    () => {
                                                        _this.setData({ verification: current + 's' });
                                                        if (current === 0) {
                                                            _this.setData({ verification: '获取验证码' });
                                                        }
                                                        resolve();
                                                    }, 1000
                                                );
                                            } else {
                                                reject();
                                            }
                                        }
                                    );
                                }
                            ).catch(
                                err => {
                                    _this.setData({ verification: '获取验证码' });
                                    return;
                                }
                            );
                        }
                    );
                }, Promise.resolve()
            );
        }
    );
};
//无法清除的定时器
let interval = (_this) => {
    var times = [];
    for (let i = 59; i >= 0; i--) {
        times.push(i);
    }
    times.reduce(
        (prev, current, index) => {
            return prev.then(
                value => {
                    return new Promise(
                        (resolve, reject) => {
                            setTimeout(
                                () => {
                                    _this.setData({ verification: current + 's' });
                                    if (current === 0) {
                                        _this.setData({ verification: '获取验证码' });
                                    }
                                    resolve();
                                }, 1000
                            );
                        }
                    )
                }
            );
        }, Promise.resolve()
    );
}
//清除定时器
let clearInterval = () => {
    webchat.setStorage('identity', false);
}
/**
 验证为空
 */
let isEmpty = (str, msg) => {
    if (!str) {
        config.modaljy(msg);
        return true;
    }
}
/**
 验证正则
 */
let isPreg = (preg, str, msg) => {
    if (!preg.test(trim(str, 'g'))) {
        config.modaljy(msg);
        return true;
    }
}
/**
 编辑距离，模糊查询的简单算法
 @param search 查询的字符
 @param data 要匹配的数据
 */
let editDistanceAlgorithm = (search, data) => {
    let searchLength = search.length + 1;
    let dataLength = data.length + 1;
    let result = []; //结果数组
    let value; //返回结果
    //构成二维数组
    for (let i = 0; i < searchLength; i++) {
        result[i] = [i];
    }
    for (let j = 0; j < dataLength; j++) {
        result[0][j] = j;
    }
    for (let i = 1; i < searchLength; i++) {
        for (let j = 1; j < dataLength; j++) {
            // 判断上方和左方是否相等
            let temp = search[i - 1] == data[j - 1] ? 0 : 1;
            /*
                取以下三个值的最小值：
                如果最上方的字符等于最左方的字符，则为左上方的数字。否则为左上方的数字+1。
                左方数字+1
                上方数字+1
            */
            result[i][j] = Math.min(result[i - 1][j] + 1, result[i][j - 1] + 1, result[i - 1][j - 1] + temp);
            if (i == searchLength - 1 && j == dataLength - 1) {
                value = result[i][j];
            }
        }
    }
    // console.log(result)
    return value; //返回阈值
}
/*
重新封装数据
@param search 要查询的值
@param data Array 数据源
@param match 要匹配的值
*/
let editDistance = (search, data, match) => {
    let tempArr = [];
    data.forEach(
        (value, index) => {
            tempArr[index] = { ...value, editDistance: editDistanceAlgorithm(search, value[match]) };
        }
    );
    return tempArr;
}
/*
汉字转拼音
@param l1 要转换的拼音
*/
function convertPinyin(l1) {
    var l2 = l1.length;
    var I1 = "";
    var reg = new RegExp('[a-zA-Z0-9\- ]');
    for (var i = 0; i < l2; i++) {
        var val = l1.substr(i, 1);
        var name = arraySearch(val, PinYin);
        if (reg.test(val)) {
            I1 += val;
        } else if (name !== false) {
            I1 += name;
        }

    }
    I1 = I1.replace(/ /g, '-');
    while (I1.indexOf('--') > 0) {
        I1 = I1.replace('--', '-');
    }
    return I1;
}

function arraySearch(l1) {
    for (var name in PinYin) {
        if (PinYin[name].indexOf(l1) != -1) {
            return name;
            break;
        }
    }
    return false;
}


module.exports = {
    trim,
    toast,
    interval,
    intervalDIY,
    clearInterval,
    isEmpty,
    isPreg,
    editDistanceAlgorithm,
    editDistance,
    convertPinyin,
};
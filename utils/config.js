class Config {
    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };
    /**
     * 点击可输可选下拉列表某一项填充
     * @author  sh
     * @date 2017-11-29 14:48
     */
    full_input(val, param, that) {
        var jsonArray = {};
        jsonArray[param] = val;
        that.setData(jsonArray);
    };
    /**
     * 输入框右侧的删除按钮
     * @author  sh
     * @date 2017-12-13 17:55
     */
    delTextFunc(e, type, that) {
        var types = this.getDataSet(e, type);
        this.full_input("", types, that);
    };
    /**
     * 模态弹框校验
     */
    modaljy(content) {
        wx.showModal({
            content: content,
            showCancel: false,
            confirmText: "确定",
            success: function (e) {
                return;
            }
        })
    }
    /**
     * 模态框确定
     */
    modalqd(content, callback) {
        wx.showModal({
            title: '提示',
            content: content,
            success: function (res) {
                callback(res);
            }
        })
    }
    /**
     * 展开/收回
     */
    slideToggle(that) {
        var types = that.data.facilitytype;
        if (types == 1) {
            that.setData({
                hidden: 'equipment-info',
                facilitytype: 2,
                facilitname: '收起',
                faciliticon: '../../images/minus.png',
            })
        } else {
            that.setData({
                hidden: 'hide',
                facilitytype: 1,
                facilitname: '展开',
                faciliticon: '../../images/unfold.png',
            })
        }
    }
    /**
     * 数组的每一项是否包含一个字串  param1：主串，param2：字串,返回包含该字符串的新数组
     * @author  sh
     */
    getArraycontains(dataArray, param, str) {
        var newData = [];
        if (str != '') {
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i][param].indexOf(str) > -1) {

                    newData.push(dataArray[i]);
                }
            }
            return newData;
        } else {
            return dataArray;
        }
    }
    /**
     * 判断用户登录信息是否缓存
     */
    userLogin(callback) {
        var that = this;
        getApp().wxLogin(callback);return;
        wx.getStorage({
            key: 'logininfo',
            success: function (res) { //有登录缓存
                callback();
            },
            fail: function () { // 没有登录缓存
                getApp().wxLogin(callback);
            }
        })
    };

    /**
     * 权限控制 (无权限提示)
     */
    permission(url, callback) {
        var that = this;
        var url = url.split("/");
        var userinfo = wx.getStorageSync('userinfo');
        var userid = userinfo.userid ? userinfo.userid : 0;
        var employeeid = userinfo.employeeid ? userinfo.employeeid : 0;
        wx.request({
            url: Config.baseUrl + 'Base/checkFrontPower',
            data: { userid: userid, employeeid: employeeid, url: url[0] },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                if (res.data.result == true) {
                    callback(1);
                } else if (res.data.code == 1) {
                    callback(2);
                } else {
                    that.modaljy(res.data.msg);
                }
            }
        })
    };

    /**
     * 权限控制 (无权限回调)
     */
    permissionht(url, callback) {
        var that = this;
        var url = url.split("/");
        var userinfo = wx.getStorageSync('userinfo');
        var userid = userinfo.userid ? userinfo.userid : 0;
        var employeeid = userinfo.employeeid ? userinfo.employeeid : 0;
        wx.request({
            url: Config.baseUrl + 'Base/checkFrontPower',
            data: { userid: userid, employeeid: employeeid, url: url[0] },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'post',
            success: function (res) {
                callback(res);
            }
        })
    };

    /*去空格*/
    Trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    /*解析地址字符串*/
    parseUrl(url) {
        var result = [];
        var query = url.split("?")[1];
        var queryArr = query.split("*");
        queryArr.forEach(function (item) {
            var obj = {};
            var key = item.split("=")[0];
            var value = item.split("=")[1];
            obj[key] = value;
            result.push(obj);
        });
        return result;
    }
}
Config.baseUrl = 'https://wxapp.ilinking.com.cn/index.php/WxMini/';
Config.imgUrl = 'https://wxapp.ilinking.com.cn/Public/';
Config.imgUrls = 'https://wxapp.ilinking.com.cn/upload/';
Config.videoUrl = 'http://file.ilinking.com.cn/';
Config.qrcodeUrl = 'https://hireminilink.ilinking.com.cn';
export { Config };
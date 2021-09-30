// pages/userInfoDetail/userInfoDetail.js
import { Config } from '../../utils/config.js';
// var config = new Config();
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cityname: '', //城市
        citycode: '', //城市code
        userInfoList: {},
        genderList: [
            {
                "id": 1,
                "gender": "男"
            },
            {
                "id": 2,
                "gender": "女"
            }
        ],
        genderIndex: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getHeaderBlock();
        this.getUserInfo();
    },

    getHeaderBlock() {
		const { statusBarHeight, headerTopHeader } = app.globalData;
		this.setData({
			headerBlock: statusBarHeight + headerTopHeader - 2,
		})
	},


    // 获取个人信息
    getUserInfo(){
        var that = this;
        var userInfo = wx.getStorageSync('userinfo');
        wx.request({
            url: Config.baseUrl + 'User/getUserEditableInfo',
            data: {
                userid: userInfo.userid
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function(res) {
                that.setData({
                    userInfoList: res.data,
                    cityname: res.data.city,
                    genderIndex: Number(res.data.gender) - 1
                })
                console.log("res", res)
                console.log("res", Number(res.data.gender) - 1)
            }
        })
    },
    changeIpt(e){
        var that = this;
        console.log(e)
        var userInfoList = this.data.userInfoList;
        if(e.currentTarget.dataset.name == "nickname"){
            userInfoList.nickname = e.detail.value;
        }
        if(e.currentTarget.dataset.name == "remark"){
            userInfoList.remark = e.detail.value;
        }
        console.log("asdsd", userInfoList)
        this.setData({
            userInfoList: userInfoList
        })
        console.log("1111", this.data.userInfoList)
    },
    /*获取城市*/
    getPortid: function(e) {
        wx.navigateTo({
            url: '../citylist/citylist?rurl=release'
        })
    },
    // 选择照片
    choosePhoto(){
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
            success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                var userInfoList = that.data.userInfoList;
                userInfoList.userpic = tempFilePaths+'';
                that.setData({
                    userInfoList: userInfoList
                })
                that.uploadImg(tempFilePaths);
                console.log("选择的照片",that.data.userInfoList);
            }
        })
    },
    //图片上传
    uploadImg(path) {
        console.log("path", path)
        var that = this;
        var userInfoList = this.data.userInfoList;
        var userInfo = wx.getStorageSync('userinfo');
        if(path != ""){
            wx.showToast({
                icon: "loading",
                title: "正在上传"
            })
            wx.uploadFile({
                url: Config.baseUrl + 'User/changeUserHeadPic',  //接口处理
                filePath: path[0],
                name: 'file',
                header: { "Content-Type": "multipart/form-data" },
                formData: {
                    userid: userInfo.userid
                },
                success: function (res) {
                    var imgdata = JSON.parse(res.data);
                    console.log("res==", imgdata);
                    console.log("res==", imgdata.result);
                    if(imgdata.result == true){
                        console.log("成功",);
                        userInfoList.userpic = imgdata.userpic;
                        that.setData({
                            userInfoList: userInfoList
                        })
                    }else{
                        wx.showToast({
                            icon: 'none',
                            title: userInfoList.msg,
                        })
                    }
                },
                fail: function (e) {
                    console.log("失败", e)
                    wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                    })
                },
                complete: function () {
                    wx.hideToast();  //隐藏Toast
                }
            })
        }
    },
    // 选择性别
    selectGender(e){
        var index = e.detail.value;
        this.setData({
            genderIndex: index
        })
    },
    // 提交个人信息
    submitInfo(){
        var that = this;
        var citycode = this.data.citycode;
        var cityname = this.data.cityname;
        var genderIndex = Number(this.data.genderIndex) + 1;
        var userInfo = wx.getStorageSync('userinfo');
        var userInfoList = this.data.userInfoList;
        // var info = {
        //     userid: userInfo.userid,
        //     nicknam: userInfoList.nickname,
        //     remark: userInfoList.remark,
        //     gender: genderIndex,
        //     citycode: citycode,
        //     city: cityname
        // }
        // console.log("info", info)
        wx.request({
            url: Config.baseUrl + 'User/changeUserInfo',
            data: {
                userid: userInfo.userid,
                file: userInfoList.userpic,
                nickname: userInfoList.nickname,
                remark: userInfoList.remark,
                gender: genderIndex,
                citycode: citycode,
                city: cityname
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            success: function(res) {
                console.log("修改", res);
                if(res.data.result == true){
                    wx.showToast({
                      title: res.data.msg,
                    })
                    setTimeout(function(){
                        wx.navigateBack();
                    },2000)
                    
                }else{
                    wx.showToast({
                        icon: 'none',
                        title: res.data.msg,
                    })
                }
                
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
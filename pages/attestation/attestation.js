// pages/attestation/attestation.js
import {Config} from '../../utils/config.js';
import { fa, song } from '../../utils/pinYin.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fullname: '',
    phone: '',
    idnumber: '',
    othercontacter: '',
    contacter: '',
    companyname: '',
    imgList: [
      {
        "name": "idcard_front",
        "text": "身份证正面",
        "title": "点击上传身份证正面",
        "img": "",
        "type": false
      },
      {
        "name": "idcard_back",
        "text": "身份证反面",
        "title": "点击上传身份证反面",
        "img": "",
        "type": false
      },
      {
        "name": "holdidcardphoto",
        "text": "手持身份证",
        "title": "点击上传手持身份证",
        "img": "",
        "type": false
      },
      // {
      //   "name": "cardLicense",
      //   "text": "营业执照",
      //   "img": "/images/banner.png",
      //   "type": false
      // },
    ],
    cardLicense: {
      "name": "businesslicense",
      "text": "营业执照",
      "title": "点击上传营业执照",
      "img": "",
      "type": false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 输入信息
  inputVal(e){
    console.log("e==", e);
    console.log("e", e.currentTarget.dataset.model);
    var type = e.currentTarget.dataset.model;
    var value = e.detail.value;
    if(type == "fullname"){
      this.setData({
        fullname: value
      })
    }
    if(type == "phone"){
      this.setData({
        phone: value
      })
    }
    if(type == "idnumber"){
      this.setData({
        idnumber: value
      })
    }
    if(type == "othercontacter"){
      this.setData({
        othercontacter: value
      })
    }
    if(type == "contacter"){
      this.setData({
        contacter: value
      })
    }
    if(type == "companyname"){
      this.setData({
        companyname: value
      })
    }
  },
  // 选择图片
  choosePhoto(e){
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        if(0 == index){
          var tempFilePaths = res.tempFilePaths;
          var imgList = that.data.imgList;
          imgList[0].img = tempFilePaths+'';
          that.setData({
            imgList: imgList
          })
          that.upload(imgList, 0, 'idcard_front');
          // that.upLoadImg(tempFilePaths, 'cardFrount');
          console.log("选择的照片",that.data.imgList);
        }
        if(1 == index){
          var tempFilePaths = res.tempFilePaths;
          var imgList = that.data.imgList;
          imgList[1].img = tempFilePaths+'';
          that.setData({
            imgList: imgList
          })
          that.upload(imgList, 1, 'idcard_back');
          console.log("选择的照片",that.data.imgList);
        }
        if(2 == index){
          var tempFilePaths = res.tempFilePaths;
          var imgList = that.data.imgList;
          imgList[2].img = tempFilePaths+'';
          that.setData({
            imgList: imgList
          })
          that.upload(imgList, 2, 'holdidcardphoto');
          console.log("选择的照片",that.data.imgList);
        }
        if(3 == index){
          var tempFilePaths = res.tempFilePaths;
          var cardLicense = that.data.cardLicense;
          cardLicense.img = tempFilePaths+'';
          that.setData({
            cardLicense: cardLicense
          })
          that.upload(cardLicense, 3, 'businesslicense');
          console.log("选择的照片",that.data.cardLicense);
        }
      }
    })
  },
  //图片上传
  upload(path, index, name) {
    console.log("path", path)
    var that = this;
    var imgList = this.data.imgList;
    var cardLicense = this.data.cardLicense;
    var imgUrl;
    if(3 == index){
      imgUrl = path.img;
    }else{
      imgUrl = path[index].img;
    }
    var userinfo = wx.getStorageSync('userinfo');
    if(path != ""){
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        wx.uploadFile({
          url: Config.baseUrl + 'User/userAuthenticationImage',  //接口处理
          filePath: imgUrl,
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          formData: {
            // authid: authid,
            userid: userinfo.userid,
            imgfield: name
          },
          success: function (res) {
            // console.log("res=====", res);
            var imgdata = JSON.parse(res.data);
            console.log("res=====", imgdata);
            // console.log("res=====", imgdata.msg);
            if(imgdata.result == true){
              if(3 == index){
                cardLicense.type = true;
                cardLicense.img = Config.imgUrl + imgdata.businesslicense;
                that.setData({
                  cardLicense: cardLicense
                })
              }else{
                var img;
                if(0 == index){
                  img = Config.imgUrl + imgdata.idcard_front;
                }
                if(1 == index){
                  img = Config.imgUrl + imgdata.idcard_back;
                }
                if(2 == index){
                  img = Config.imgUrl + imgdata.holdidcardphoto;
                }
                imgList[index].img = img;
                imgList[index].type = true;
                that.setData({
                  imgList: imgList
                })
              }
              return;
            }else{
              wx.showModal({
                title: '提示',
                content: '请上传正确的照片',
                showCancel: false
              })
              if(3 == index){
                cardLicense.type = false;
                that.setData({
                  cardLicense: cardLicense
                })
              }else{
                imgList[index].type = false;
                that.setData({
                  imgList: imgList
                })
              }
              return;
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
  // 提交认证
  submitInfo(){
    if(this.data.fullname.length > 10 || this.data.fullname.length == 0){
      wx.showToast({
        icon: 'none',
        title: '请输入正确的姓名',
      })
      return;
    }
    if(this.data.phone.length != 11){
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号',
      })
      return;
    }
    if(this.data.idnumber.length != 18){
      wx.showToast({
        icon: 'none',
        title: '请输入正确的身份证号',
      })
      return;
    }
    var imgList = this.data.imgList;
    for(var i in imgList){
      if(imgList[i].img == ''){
        wx.showToast({
          icon: 'none',
          title: '请上传正确的身份照片',
        })
        return;
      }
    }
    var cardLicense = this.data.cardLicense;
    if(cardLicense.type == false){
      wx.showToast({
        icon: 'none',
        title: '请上传正确的营业执照',
      })
      return;
    }
    var userinfo = wx.getStorageSync('userinfo');
    var that = this;
      wx.request({
        url: Config.baseUrl + 'User/userAuthentication',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { 
          userid: userinfo.userid,
          fullname: that.data.fullname,
          phone: that.data.phone,
          idnumber: that.data.idnumber,
          othercontacter: that.data.othercontacter,
          contacter: that.data.contacter,
          companyname: that.data.companyname,
        },
        method: 'POST',
        success: function (res) {
            if(res.statusCode == 200){
              console.log("res=", res);
              // that.upLoadImg(res.data.pk);
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
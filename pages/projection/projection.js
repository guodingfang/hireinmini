// pages/projection/projection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenList: [
      {"screen": "4 : 3"},
      {"screen": "16 : 9"},
      {"screen": "16 : 10"}
    ],
    screenIndex: 0,  //选择屏幕比例
    heightVal: '',   //高度
    widthVal: '',    //宽度

    distanceText: {
      text1: "投影距离（米）",
      text2: "投射比（米）",
      change: false
    },
    // distanceText: '投影距离（米）',    //距离
    // projectionText: '投射比（米）',  //投射
    distanceVal: '',     //距离值
    projectionVal: '',   //投射比值
    
    distanceList: [
      {"title": "投影距离"},
      {"title": "画面尺寸"},
    ],
    distanceIndex: 0,

    screenSize: '',
    // inputDistanceVal: '',
    // inputProjectionVal: '',

    top: '',
    bottom: '',

    focalSmallVal: '',
    focalBigVal: '',
    chipSizeVal: '',
    ProjectionDistanceVal: '',
    viewSizeVal: '',
    viewSmallVal: '',   //最小画面
    viewBigVal: '',     //最大画面
    projectionRatioSmallVal: '',   //最小投射比
    projectionRatioBigVal: '',     //最大投射比

    viewSizeSmallVal: '',
    viewSizeBigVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var screenIndex = this.data.screenIndex;
    if(0 == screenIndex){
      this.setData({
        top: 4,
        bottom: 3
      })
    }
  },
  // 选择屏幕比例
  selectScreen(e){
    console.log("e=", e);
    var screenIndex = e.currentTarget.dataset.index;
    var top, bottom;
    if(0 == screenIndex){
      top = 4;
      bottom = 3;
    }
    if(1 == screenIndex){
      top = 16;
      bottom = 9;
    }
    if(2 == screenIndex){
      top = 16;
      bottom = 10;
    }
    this.setData({
      top: top,
      bottom: bottom,
      screenIndex: e.currentTarget.dataset.index
    })
    this.screenNum();
    this.inputDistance();
    this.inputProjection();
    this.count();
  },
  // 输入屏幕尺寸
  clickScreen(e){
    var screenSize = Number(e.detail.value);
    this.setData({
      screenSize: screenSize
    })
    this.screenNum();
  },
  // 计算高度，宽度
  screenNum(){
    // console.log("平方",Math.pow(4/3, 3))
    var top = this.data.top;
    var bottom = this.data.bottom;
    var screenSize = this.data.screenSize;
    // var screenIndex = this.data.screenIndex;
    
    // console.log("比例", screenSize, top, bottom);
    var heightValue = screenSize * 0.0254 * Math.sqrt(1/(1+Math.pow(top/bottom, 2)));
    var widthValue = screenSize * 0.0254 * Math.sqrt(1/(1+Math.pow(bottom/top, 2)));
    // 保留两位小数
    var heightVal = heightValue.toFixed(2);
    var widthVal = widthValue.toFixed(2);
    
    this.setData({
      heightVal: heightVal,
      widthVal: widthVal
    })
    console.log("高度", heightVal)
    console.log("宽度", widthVal)
  },
  // 输入投影距离
  clickInputDistance(e){
    console.log("投影距离", e);
    var distanceVal = e.detail.value;
    this.setData({
      distanceVal: distanceVal
    })
    this.inputDistance();
  },
  // 计算投射比
  inputDistance(){
    var distanceVal = this.data.distanceVal;
    var widthVal = this.data.widthVal;
    var projectionVal;
    if(widthVal != ''){
      var projectionValue = distanceVal / widthVal;
      projectionVal = projectionValue.toFixed(2);
    }
    this.setData({
      projectionVal: projectionVal
    })
    console.log("projectionVal==", projectionVal);
  },
  // 投影距离
  clickInputProjection(e){
    console.log("投射比", e);
    var projectionVal = e.detail.value;
    this.setData({
      projectionVal: projectionVal
    })
    this.inputProjection();
  },
  inputProjection(){
    var projectionVal = this.data.projectionVal;
    var widthVal = this.data.widthVal;
    var distanceVal;
    if(widthVal != ''){
      var distanceValue = projectionVal * widthVal;
      distanceVal = distanceValue.toFixed(2);
    }
    this.setData({
      distanceVal: distanceVal
    })
    console.log("distanceVal==", distanceVal);
  },
  // 投影距离，投射比切换
  changeText(){
    var distanceText = this.data.distanceText;
    var change = distanceText.change;
    if(change == true){
      distanceText.text1 = "投影距离（米）";
      distanceText.text2 = "投射比（米）";
      distanceText.change = false;
    }else if(change == false){
      distanceText.text1 = "投射比（米）";
      distanceText.text2 = "投影距离（米）";
      distanceText.change = true;
    }
    this.setData({
      distanceText: distanceText
    })
  },
  // 点击投影距离、画面尺寸
  clickDistance(){
    var distanceIndex = this.data.distanceIndex;
    if(0 == distanceIndex){
      distanceIndex = 1;
    }else if(1 == distanceIndex){
      distanceIndex = 0;
    }
    this.setData({
      distanceIndex: distanceIndex
    })
  },

  // 输入值
  focalSmall(e){
    var focalSmallVal = e.detail.value;
    this.setData({
      focalSmallVal:focalSmallVal
    })
    this.count();
  },
  focalBig(e){
    var focalBigVal = e.detail.value;
    this.setData({
      focalBigVal:focalBigVal
    })
    this.count();
  },
  chipSize(e){
    var chipSizeVal = e.detail.value;
    this.setData({
      chipSizeVal:chipSizeVal
    })
    this.count();
  },
  ProjectionDistance(e){
    var ProjectionDistanceVal = e.detail.value;
    this.setData({
      ProjectionDistanceVal:ProjectionDistanceVal
    })
    this.count();
  },
  viewSize(e){
    var viewSizeVal = e.detail.value;
    this.setData({
      viewSizeVal:viewSizeVal
    })
    this.count();
  },
  // 计算结果
  count(){
    var top = this.data.top;
    var bottom = this.data.bottom;
    var focalSmallVal = this.data.focalSmallVal / 1000;
    var focalBigVal = this.data.focalBigVal / 1000;
    var chipSizeVal = this.data.chipSizeVal;
    var viewSizeVal = this.data.viewSizeVal;
    var ProjectionDistanceVal = this.data.ProjectionDistanceVal;
    var viewBigVal, viewSmallVal, viewSizeSmallVal, viewSizeBigVal, projectionRatioSmallVal, projectionRatioBigVal;
    // 根据投影距离
    if(0 == this.data.distanceIndex){
      // 计算最小画面
      if(focalBigVal != '' && chipSizeVal != '' && ProjectionDistanceVal != ''){
        var viewSmallValue = ProjectionDistanceVal * chipSizeVal / focalBigVal;
        viewSmallVal = viewSmallValue.toFixed(2);
      }
      // 计算最大画面
      if(focalSmallVal != '' && chipSizeVal != '' && ProjectionDistanceVal != ''){
        var viewBigValue = ProjectionDistanceVal * chipSizeVal / focalSmallVal;
        viewBigVal = viewBigValue.toFixed(2);
      }
      console.log("画面大小", viewBigVal, viewSmallVal)
      // 计算最小投射比
      if(ProjectionDistanceVal != '' && viewBigVal != ''){
        var disViewWidthValBig = viewBigVal * 0.0254 * (Math.sqrt(1/(1+Math.pow(bottom/top, 2))));
        var newDisViewWidthValBig = disViewWidthValBig.toFixed(2);
        var projectionRatioSmallValue = ProjectionDistanceVal / newDisViewWidthValBig;
        projectionRatioSmallVal = projectionRatioSmallValue.toFixed(2);
      }
      // 计算最大投射比
      if(ProjectionDistanceVal != '' && viewSmallVal != ''){
        var disViewWidthValSma = viewSmallVal * 0.0254 * (Math.sqrt(1/(1+Math.pow(bottom/top, 2))));
        var newDisViewWidthValSma = disViewWidthValSma.toFixed(2);
        var projectionRatioBigValue = ProjectionDistanceVal / newDisViewWidthValSma;
        // console.log("aaaaaa",projectionRatioBigValue);
        projectionRatioBigVal = projectionRatioBigValue.toFixed(2);
      }
      this.setData({
        viewSmallVal: viewSmallVal,
        viewBigVal: viewBigVal,
        projectionRatioSmallVal: projectionRatioSmallVal,
        projectionRatioBigVal: projectionRatioBigVal
      })
      console.log("投射比", projectionRatioSmallVal, projectionRatioBigVal)
    }
    // 根据画面尺寸
    if(1 == this.data.distanceIndex){
      // 计算最小距离
      if(focalSmallVal != '' && chipSizeVal != '' && viewSizeVal != ''){
        var viewSizeSmallValue = focalSmallVal * viewSizeVal / chipSizeVal;
        viewSizeSmallVal = viewSizeSmallValue.toFixed(2);
      }
      // 计算最大距离
      if(focalBigVal != '' && chipSizeVal != '' && viewSizeVal != ''){
        var viewSizeBigValue = focalBigVal * viewSizeVal / chipSizeVal;
        viewSizeBigVal = viewSizeBigValue.toFixed(2);
      }
      // 计算最小投射比
      if(viewSizeSmallVal != '' && viewSizeVal != ''){
        var viewWidthValSma = viewSizeVal * 0.0254 * Math.sqrt(1/(1+Math.pow(bottom/top, 2)));
        var newViewWidthValSma = viewWidthValSma.toFixed(2);
        var projectionRatioSmallValue = viewSizeSmallVal / newViewWidthValSma;
        projectionRatioSmallVal = projectionRatioSmallValue.toFixed(2);
      }
      // 计算最大投射比
      if(viewSizeBigVal != '' && viewSizeVal != ''){
        var viewWidthValBig = viewSizeVal * 0.0254 * Math.sqrt(1/(1+Math.pow(bottom/top, 2)));
        var newViewWidthValBig = viewWidthValBig.toFixed(2);
        var projectionRatioBigValue = viewSizeBigVal / newViewWidthValBig;
        projectionRatioBigVal = projectionRatioBigValue.toFixed(2);
      }
      this.setData({
        viewSizeSmallVal: viewSizeSmallVal,
        viewSizeBigVal: viewSizeBigVal,
        projectionRatioSmallVal: projectionRatioSmallVal,
        projectionRatioBigVal: projectionRatioBigVal
      })
      console.log("画面距离", viewSizeSmallVal, viewSizeBigVal)
    }
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
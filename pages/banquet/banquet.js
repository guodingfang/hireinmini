// pages/banquet/banquet.js
import { Config } from '../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: "",
    month: "",
    dayArr: [],
    weekList: ["日","一", "二","三","四","五","六"],
    // monthList: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    yearsArr: [],
    yearsArrIndex: [0, 0],
    curNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curDate = new Date();
    // 获取年
    var year = curDate.getFullYear();
    // console.log("years=", years);
    /* 获取当前月份 */
    var month = curDate.getMonth() + 1;
    // month = 6;
    // console.log("获取当前月curMonth", curMonth);
    // 获取当天
    var days = curDate.getDate();
    // console.log("获取当天", days);
    this.getDayList(year,month,days);
    // 设置年月  
    this.selectData();
  },
  getDayList(year,month,days){          
    // 获取某年某月的天数
    var days = this.getDaysInMonth(year,month);
    // console.log("某年某月天数", days);
    // 获取某年上一个月的天数
    var prevDays = this.getDaysInMonth(year,month-1);
    // console.log("某年上一个月天数", prevDays);

    // 获取当月第一天星期几
    var firstDay = year + "/" + month + "/1";
    var weekDay = new Date(firstDay).getDay();
    // console.log("某月第一天星期几", weekDay);
    var dayArr = [];
    var prevDaysArr = [];
    for(var i=1; i<weekDay+1; i++){
      var prevNumList = {
        num: prevDays,
        clickDay: false
      }
      prevDaysArr.push(prevNumList);
      prevDays = prevDays - 1;
    }
    prevDaysArr.reverse();
    dayArr = prevDaysArr;
    for(var i=1; i<=days; i++){
      if(7 == i){
        var numList = { 
          num: i,
          clickDay: true,
          cur: true
        };
      }else{
        var numList = { 
          num: i,
          clickDay: true,
        };
      }
      dayArr.push(numList);
    }
    // console.log("dayArr=", dayArr)
    this.setData({
      years: year,
      month: month,
      dayArr: dayArr
    })
  },
  // 计算某年某月的天数
  getDaysInMonth(year,month){
      month = parseInt(month, 10);
      var temp = new Date(year, month ,0);
      return temp.getDate();
  },
  // 选择年月
  selectData(){
    var yearsArrIndex = [0];  //当前年月数组
    var month = this.data.month - 1;
    yearsArrIndex.push(month);

    var years = Number(this.data.years);
    var yearsList = [];
    var monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
    for(var i=0; i<10; i++){
      yearsList.push(years);
      years++;
    }
    var yearsArr = [];
    yearsArr.push(yearsList);
    yearsArr.push(monthList);
    this.setData({
      yearsArr: yearsArr,
      yearsArrIndex: yearsArrIndex
    })
    // console.log("年月", yearsList)
    // console.log("年月2", yearsArr)
  },
  // 选择日期
  selectDay(e){
    // console.log("e=", e);
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.item.num; //获取选择的日期
    var dayArr = this.data.dayArr;
    var curNum = 1;
    for(var i in dayArr){
      if(dayArr[i].cur){
        curNum = curNum + 1;
        if(curNum > 2){
          return;
        }
      }
    } 
    for(var j in dayArr){
      if(j == index){
        dayArr[j].cur = true;
      }
    } 
       
    this.setData({
      dayArr: dayArr
    })
  },
  // 取消日期
  cancelDay(e){
    var dayArr = this.data.dayArr;
    var index = e.currentTarget.dataset.index;
    for(var i in dayArr){
      if(i == index){
        delete dayArr[i].cur;
      }
    }
    this.setData({
      dayArr: dayArr
    })
  },
  // 修改年月
  bindMultiPickerChange(e){
    // console.log("e=", e);
    var yearsArr = this.data.yearsArr;
    var month = this.data.month;
    var value = e.detail.value;
    var yearIndex = value[0];
    var monthIndex = value[1];
    var year = yearsArr[0][yearIndex];
    var month = yearsArr[1][monthIndex];
    this.getDayList(year, month);
    this.setData({
      yearsArrIndex: value
    })
  },
  // 下一个月
  lastMonth(){
    var year = this.data.years;
    var yearsArrIndex = this.data.yearsArrIndex;
    var month = yearsArrIndex[1];
    if(month < 11){
      month = month + 1;
      yearsArrIndex[1] = month;
      this.setData({
        yearsArrIndex: yearsArrIndex
      })
      this.getDayList(year,month+1);
    }
    
  },
  // 上一个月
  prevMonth(){
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth() + 1;
    var year = this.data.years;
    var yearsArrIndex = this.data.yearsArrIndex;
    var month = yearsArrIndex[1];    
    if(month >= curMonth){

      month = month - 1;
      yearsArrIndex[1] = month;
      this.setData({
        yearsArrIndex: yearsArrIndex
      })
      this.getDayList(year,month+1);
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
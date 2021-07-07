'use strict';
import { Config } from '../../utils/config.js';
var config = new Config();

// 左右滑动日历所需变量
let time = 0; //时间记录，用于滑动时且时间小于1s则执行左右滑动
let touchDot = 0;//触摸时的原点
let interval = "";// 记录/清理 时间记录
let tmpFlag = true;// 不再执行滑动事件开关
/*获取日历循环列表数据*/
var getCalendarList = function (employeeid, userid, date_query, that, choosedDay, isexpand) {
    wx.request({
        url: Config.baseUrl + "Lease/mytaskDayTask",
        data: {
            employeeid: employeeid,
            userid: userid,
            date_query: date_query,
            choosedDay: choosedDay
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            var callength = res.data.length;
            addClassbylength(callength,isexpand,that);
            that.setData({
                days: res.data
            })
            if(isexpand == 1){
                that.clickShrink();
            }else{
                that.clickExpand();
            }
        }
    });
}
/*根据日历的天数给orderlist添加对应的class*/
var addClassbylength = function(length,isexpand,that){
    var margintopclass = "";
    /*收起状态*/
    if(isexpand == 1){
        margintopclass = "margintop-shou";
    }else{
        if(length == 42){
            margintopclass = "margintop-bottom";
        }else if(length == 28){
            margintopclass = "margintop-top";
        }else{
            margintopclass = "margintop-middle";
        }
    }
    that.setData({
        margintop:margintopclass
    })
}
/*根据日期获取任务列表*/
var getOrderlistByDate = function (employeeid, userid, date_query, that) {
    wx.request({
        url: Config.baseUrl + "Lease/mytask_bgo",
        data: {
            date_query: date_query,
            employeeid: employeeid,
            userid: userid
        },
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "post",
        success: function (res) {
            that.setData({
                orderlist: res.data
            })
        }
    });
}
let choose_year = null,
    choose_month = null;
const conf = {
    data: {
        hasEmptyGrid: false,
        showPicker: false,
        isExpand: true,
        orderlist: [],
        margintop:"margintop-shou"
    },
    onLoad() {
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const cur_date = date.getDate();
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        /*获取缓存信息*/
        var storageinfo = wx.getStorageSync('userinfo');
        var companyid = storageinfo.companyid ? storageinfo.companyid : 0;
        var employeeid = storageinfo.employeeid ? storageinfo.employeeid : 0;
        var userid = storageinfo.userid ? storageinfo.userid : 0;

        this.setData({
            cur_year,
            cur_month,
            cur_date,
            weeks_ch,
            companyid: companyid,
            employeeid: employeeid,
            userid: userid
        });
        this.calculateDays(cur_year, cur_month, cur_year+"-"+cur_month+"-"+cur_date, 0);//日历循环
        /*获取我的任务*/
        this.getOrderlistByDate(this.data.employeeid, this.data.userid, cur_year + "-" + cur_month + "-" + cur_date);
    },

    /*获取指定年月的最后一天 例如5月有31天，则返回31,11月有30天，则返回30*/
    getThisMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    },
    /*获取指定年月第一天星期几*/
    getFirstDayOfWeek(year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    /*获取当前年，月，日放到一个数组中*/
    getNowDay() {
        var dateArr = [];
        dateArr['year'] = new Date().getFullYear();
        dateArr['month'] = new Date().getMonth() + 1;
        dateArr['day'] = new Date().getDate();
        return dateArr;
    },
    /*点击日历左右两个按钮切换月份*/
    handleCalendar(e) {
        const handle = e.currentTarget.dataset.handle;
        /*前一个月*/
        if (handle === 'prev') {
            this.getSpecifiedCalendar("prev");
            /*后一个月*/
        } else {
            this.getSpecifiedCalendar("next");
        }
    },
    /*点击日历某一天的时间*/
    tapDayItem(e) {
        const idx = e.currentTarget.dataset.idx;
        const param_day = e.currentTarget.dataset.day;
        const param_fullday = e.currentTarget.dataset.fullday;
        const days = this.data.days;
        var cur_month = this.data.cur_month;
        var cur_year = this.data.cur_year;
        var fulldayArray = param_fullday.split("-");

        /*sh add start 先将所有的日历选中都清空*/
        for (var i = 0; i < days.length; i++) {
            days[i].choosed = false;
        }
        /*sh add end*/
        /*1是收缩，0是展开*/
        var isexpand = (this.data.isExpand)?0:1;
        /*如果点击的日期不是在当月，则要把整个日历切换成那个月的日历*/
        if (cur_month != parseInt(fulldayArray[1])) {
            this.calculateDays(parseInt(fulldayArray[0]), parseInt(fulldayArray[1]), param_fullday,isexpand);
        } else {
            days[idx].choosed = !days[idx].choosed;
            /*更新当前年月日*/
            this.setData({
                days
            });
        }
        this.setData({
            cur_date: parseInt(fulldayArray[2]),
            cur_year: parseInt(fulldayArray[0]),
            cur_month: parseInt(fulldayArray[1])
        });
        /*获取活动订单*/
        this.getOrderlistByDate(this.data.employeeid, this.data.userid, param_fullday);
    },
    /*点击年月，弹出年月的选择页面*/
    chooseYearAndMonth() {
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        let picker_year = [],
            picker_month = [];
        for (let i = 1900; i <= 2100; i++) {
            picker_year.push(i);
        }
        for (let i = 1; i <= 12; i++) {
            picker_month.push(i);
        }
        /*获取当前年月的索引*/
        const idx_year = picker_year.indexOf(parseInt(cur_year));
        const idx_month = picker_month.indexOf(parseInt(cur_month));
        this.setData({
            picker_value: [idx_year, idx_month],
            picker_year,
            picker_month,
            showPicker: true,
        });
    },
    /*切换年月*/
    pickerChange(e) {
        const val = e.detail.value;
        choose_year = this.data.picker_year[val[0]];
        choose_month = this.data.picker_month[val[1]];
    },
    /*点击切换年月页面的确定按钮*/
    tapPickerBtn(e) {
        const type = e.currentTarget.dataset.type;
        var choosed_day = this.data.cur_date; 
        /*1是收缩，0是展开*/
        var isexpand = (this.data.isExpand)?0:1;
        const o = {
            showPicker: false,
        };
        if (type === 'confirm') {
            o.cur_year = choose_year;
            o.cur_month = choose_month;
            this.calculateDays(choose_year, choose_month, choose_year+"-"+choose_month+"-"+choosed_day,isexpand);
            /*获取我的任务*/
            this.getOrderlistByDate(this.data.employeeid,this.data.userid, choose_year + "-" + choose_month + "-" + choosed_day);
        }

        this.setData(o);
    },
    /**
    * 点击进入任务订单详情、
    */
    taskdetail: function (event) {
        var url = config.getDataSet(event, 'url');
        config.permission(url, function () {
            wx.navigateTo({
                url: '../' + url,
            })
        })
    },
    /**
* 跳转到主页
*/
    returnindex: function (e) {
        config.permission('index/index', function () {
            wx.switchTab({
                url: '../index/index'
            })
        })
    },
    /*点击收缩*/
    clickShrink(e) {
        var cal_data = this.data.days;
        var choosed_year = this.data.cur_year;
        var choosed_month = this.data.cur_month;
        var choosed_day = this.data.cur_date;
        var showdates = this.getDayOfWeek(choosed_year, choosed_month, choosed_day, "yyyy-MM-dd");
        for (var i = 0; i < cal_data.length; i++) {
            if (!this.inArray(showdates, cal_data[i]['fullday'])) {
                cal_data[i].show = false;
            }
        }
        addClassbylength(cal_data.length,1,this);
        this.setData({
            days: cal_data,
            isExpand: false
        })
    },
    /*点击展开*/
    clickExpand(e) {
        var cal_data = this.data.days;
        var choosed_year = this.data.cur_year;
        var choosed_month = this.data.cur_month;
        var choosed_day = this.data.cur_date;
        for (var i = 0; i < cal_data.length; i++) {
            cal_data[i].show = true;
        }
        addClassbylength(cal_data.length,0,this);
        this.setData({
            days: cal_data,
            isExpand: true
        })
    },
    /*获取选中日期的一周日期*/
    getDayOfWeek(year, month, day, pattern) {
        var getNowWeek = this.getDaysSeven(year, month, day);
        var now = new Date(this.parserDate(year + "-" + month + "-" + day));
        var nowTime = now.getTime();
        var oneDayLong = 24 * 60 * 60 * 1000;
        var weekofday = [];
        for (var i = 0; i < 7; i++) {
            weekofday[i] = new Date(nowTime - (getNowWeek - i) * oneDayLong).pattern(pattern);
        }
        return weekofday;
    },
    /*获取指定年月日星期几*/
    getDaysSeven(year, month, day) {
        return new Date(Date.UTC(year, month - 1, day)).getDay();
    },
    /*循环日历*/
    calculateDays(year, month, choosedDay,isexpand) {
        var choosedParamsDay = "";
        var monthFirstDay = this.getDayOfWeek(year, month, 1, "yyyy-MM-dd")[0];

        var monthFirstDayArray = monthFirstDay.split("-");
        var getNowWeek = this.getDaysSeven(monthFirstDayArray[0], monthFirstDayArray[1], monthFirstDayArray[2]);
        var now = new Date(this.parserDate(monthFirstDayArray[0] + "-" + monthFirstDayArray[1] + "-" + monthFirstDayArray[2]));
        var nowTime = now.getTime();
        var oneDayLong = 24 * 60 * 60 * 1000;
        /*日历第一天*/
        var firstCalendarDay = new Date(nowTime - (getNowWeek - 0) * oneDayLong).pattern("yyyy-MM-dd");
        /*判断第三个参数是否有值*/
        choosedParamsDay = (arguments.length > 2) ? choosedDay : this.data.cur_year + "-" + this.data.cur_month + "-" + this.data.cur_date;
        isexpand = (isexpand == 1)?1:"";

        getCalendarList(this.data.employeeid, this.data.userid, firstCalendarDay, this, choosedParamsDay,isexpand);
    },
    /*获取某个值在某个数组中是否存在*/
    inArray(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] == obj) {
                return true;
            }
        }
        return false;
    },
    // 触摸开始事件
    touchStart: function (e) {
        // wx.showLoading({
        //     title: "正在加载中",
        //     mask: true
        // })
        touchDot = e.touches[0].pageX; // 获取触摸时的原点
        // 使用js计时器记录时间    
        interval = setInterval(function () {
            time++;
        }, 100);
    },
    // 触摸结束事件
    touchEnd: function (e) {
        wx.hideLoading();
        var touchMove = e.changedTouches[0].pageX;
        // 向左滑动   
        if (touchMove - touchDot <= -60 && time < 10 && tmpFlag) {
            tmpFlag = false;
            //执行切换页面的方法
            this.getSpecifiedCalendar("next");
        }
        // 向右滑动   
        if (touchMove - touchDot >= 60 && time < 10 && tmpFlag) {
            tmpFlag = false;
            //执行切换页面的方法
            this.getSpecifiedCalendar("prev");
        }
        clearInterval(interval); // 清除setInterval
        time = 0;
        tmpFlag = true;
    },
    /**
     * 上一个月下一个月封装方法
     */
    getSpecifiedCalendar: function (type) {
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        const cur_day = this.data.cur_date;
        /*1是收缩，0是展开*/
        var isexpand = (this.data.isExpand)?0:1;
        if (type == "next") {
            let newMonth = cur_month + 1;
            let newYear = cur_year;
            if (newMonth > 12) {
                newYear = cur_year + 1;
                newMonth = 1;
            }
            /*循环日历*/
            this.calculateDays(newYear, newMonth, newYear+"-"+newMonth+"-"+cur_day,isexpand);
            /*获取派单订单*/
            this.getOrderlistByDate(this.data.employeeid,this.data.userid, newYear+"-"+newMonth+"-"+cur_day);

            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            });
        } else {
            let newMonth = cur_month - 1;
            let newYear = cur_year;
            if (newMonth < 1) {
                newYear = cur_year - 1;
                newMonth = 12;
            }
            /*循环日历*/
            this.calculateDays(newYear, newMonth, newYear+"-"+newMonth+"-"+cur_day,isexpand);
            /*获取派单订单*/
            this.getOrderlistByDate(this.data.employeeid,this.data.userid, newYear+"-"+newMonth+"-"+cur_day);

            this.setData({
                cur_year: newYear,
                cur_month: newMonth
            });
        }
    },
    parserDate(date) {
        return new Date(date.replace(/-/g, "/"));
    },
    /*根据日期获取订单信息*/
    getOrderlistByDate(employeeid, userid, date_query) {
        getOrderlistByDate(employeeid,userid, date_query, this);
    },
    /*取消操作*/
    cancelFunc(e) {
        var orderid = config.getDataSet(e, "orderid");
        var index = config.getDataSet(e, "index");
        var that = this;
        wx.showModal({
            title: '取消订单',
            content: '确定要取消订单吗？',
            confirmText: "删除",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    /*删除请求后台*/
                    cancelOrder(orderid, index, that);
                    /*删除请求后台*/
                } else {
                    return;
                }
            }
        });
    }
};

Page(conf);

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份           
        "d+": this.getDate(), //日           
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时           
        "H+": this.getHours(), //小时           
        "m+": this.getMinutes(), //分           
        "s+": this.getSeconds(), //秒           
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度           
        "S": this.getMilliseconds() //毫秒           
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}  
import {
    Config
} from '../../utils/config.js';
var Util = require('../../utils/util.js');
var config = new Config();
var app = getApp();
var sliderWidth = 70; // 需要设置slider的宽度，用于计算中间位置
// 获取线径功率列表
var GetDiameterList = function(that) {
    wx.request({
        url: Config.baseUrl + 'Formula/diameter_electricity_Table',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                diameterlist: res.data
            })
        }
    })
}
// 获取间距像素列表
var GetSpacingList = function(that) {
    wx.request({
        url: Config.baseUrl + 'Formula/getSpacingList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                interval: res.data
            })
        }
    })
}
// 获取规格列表
var GetSpecList = function(that) {
    wx.request({
        url: Config.baseUrl + 'Formula/getSpecList',
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'post',
        success: function(res) {
            that.setData({
                speclist: res.data
            })
        }
    })
}
Page({
    data: {
        diameterlist: [], //线径功率列表
        tabs: ["功耗公式", "LED屏公式", "雷亚架计算公式"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        interval: [], //LED屏公式间距
        speclist: [] //LED屏公式规格
    },
    onLoad: function() {
        var that = this;
        let param = this.getNodeParam(this.data.activeIndex, (param) => {
            wx.getSystemInfo({
                success: function(res) {
                    that.setData({
                        // sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                        // sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                        sliderLeft: param.left,
                        sliderOffset: param.width / 2 - 46 / 2
                    });
                }
            });
        });
        // 获取线径功率列表
        GetDiameterList(that);
        // 获取间距像素列表
        GetSpacingList(that);
        // 获取规格列表
        GetSpecList(that);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return {
            title: '工具',
            imageUrl: '/images/foundparty.jpg'
        }        
    },
    /**
     * 顶部切换
     */
    tabClick: function(e) {
        let param = this.getNodeParam(e.currentTarget.dataset.id, (param) => {
            this.setData({
                // sliderOffset: e.currentTarget.offsetLeft,
                activeIndex: e.currentTarget.dataset.id,
                sliderLeft: param.left,
                sliderOffset: param.width / 2 - 46 / 2
            });
        });
    },
    /**
     * 选择元素属性
     */
    getNodeParam(id, callback) {
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select(`#nav${id}`).boundingClientRect();
        query.exec(function(res) {
            //取高度
            let param = res[0];
            callback(param);
        });
    },
    /**
     * 间距选择
     */
    selectInterval(event) {
        var that = this;
        let arr = that.data.interval;
        let key = config.getDataSet(event, 'id');
        let setArr = arr.map(
            (item, index) => {
                if (index == key) {
                    that.setData({
                        pointperunit: item.pointperunit,
                        width_spec: '',
                        height_spec: '',
                        width: '',
                        height: '',
                        area: '',
                        widthPoint: '',
                        heightPoint: '',
                        areaPoint: '',
                        widthBlock: '',
                        heightBlock: '',
                        sumBlock: ''
                    })
                    that.selectSpec();
                    return {
                        pointperunit: item.pointperunit,
                        pixeldensity: item.pixeldensity,
                        spacing: item.spacing,
                        isActive: true
                    };
                } else {
                    return {
                        pointperunit: item.pointperunit,
                        pixeldensity: item.pixeldensity,
                        spacing: item.spacing,
                        isActive: false
                    };
                }
            }
        );
        that.setData({
            interval: setArr
        });
    },
    /**
     * 规格选择
     */
    selectSpec(event) {
        var that = this;
        let pointperunit = that.data.pointperunit;
        let arr = that.data.speclist;
        let key = event ? config.getDataSet(event, 'id') : -1;
        that.setData({
            point: ''
        })
        let setArr = arr.map(
            (item, index) => {
                if (index == key) {
                    if (!pointperunit) {
                        config.modaljy('请先选择间距');
                        return {
                            width_spec: item.width_spec,
                            height_spec: item.height_spec,
                            specifications: item.specifications,
                            isActive: false
                        };
                    } else {
                        that.setData({
                            width_spec: item.width_spec,
                            height_spec: item.height_spec,
                            point: ((item.width_spec / 1000) * pointperunit) + '*' + ((item.height_spec / 1000) * pointperunit)
                        })
                        let width = that.data.width;
                        let height = that.data.height;
                        // 计算面积
                        getArea(that, width, height, pointperunit);
                        return {
                            width_spec: item.width_spec,
                            height_spec: item.height_spec,
                            specifications: item.specifications,
                            isActive: true
                        };
                    }
                } else {
                    return {
                        width_spec: item.width_spec,
                        height_spec: item.height_spec,
                        specifications: item.specifications,
                        isActive: false
                    };
                }
            }
        );
        that.setData({
            speclist: setArr
        });
    },
    /**
     * 获取面积的宽度
     */
    getWidth: function(e) {
        var that = this;
        let width = e.detail.value;
        let height = that.data.height;
        let pointperunit = that.data.pointperunit;
        if (!pointperunit) {
            config.modaljy('请先选择间距');
            return;
        } else {
            // 计算面积
            getArea(that, width, height, pointperunit)
            that.setData({
                width: width
            })
        }
    },
    /**
     * 获取面积的高度
     */
    getHeight: function(e) {
        var that = this;
        let width = that.data.width;
        let height = e.detail.value;
        let pointperunit = that.data.pointperunit;
        if (!pointperunit) {
            config.modaljy('请先选择间距');
            return;
        } else {
            // 计算面积
            getArea(that, width, height, pointperunit)
            that.setData({
                height: height
            })
        }
    },
    /**
     * 获取空开(电流),并算出功率(380V)
     */
    getElectricity3: function(e) {
        var that = this;
        var electricity = e.detail.value;
        var voltage = 380;
        if (electricity) {
            that.setData({
                power3: ((electricity * voltage * Math.sqrt(3) * 0.85) / 1000).toFixed(1)
            })
        } else {
            that.setData({
                power3: ''
            })
        }
    },
    /**
     * 获取空开(电流),并算出功率(220V)
     */
    getElectricity: function(e) {
        var that = this;
        var electricity = e.detail.value;
        var voltage = 220;
        if (electricity) {
            that.setData({
                power: (electricity * voltage / 1000).toFixed(1)
            })
        } else {
            that.setData({
                power: ''
            })
        }
    },
    /**
     * 获取功率,并算出空开(380V)
     */
    getPower3: function(e) {
        var that = this;
        var power = e.detail.value;
        if (power) {
            wx.request({
                url: Config.baseUrl + 'Formula/electricity_threePhase',
                data: {
                    power: power
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'post',
                success: function(res) {
                    that.setData({
                        electricity3: res.data.electricity,
                        diameter3: res.data.diameter
                    })
                }
            })
        } else {
            that.setData({
                electricity3: '',
                diameter3: ''
            })
        }
    },
    /**
     * 获取功率,并算出空开(220V)
     */
    getPower: function(e) {
        var that = this;
        var power = e.detail.value;
        if (power) {
            wx.request({
                url: Config.baseUrl + 'Formula/electricity_singlePhase',
                data: {
                    power: power
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'post',
                success: function(res) {
                    that.setData({
                        electricity: res.data.electricity,
                        diameter: res.data.diameter
                    })
                }
            })
        } else {
            that.setData({
                electricity: '',
                diameter: ''
            })
        }
    },
    /**
     * 获取线径(380V)
     */
    getDiameter3: function(e) {
        this.setData({
            diameter3Index: e.detail.value
        })
    },
    /**
     * 获取线径(220V)
     */
    getDiameter: function(e) {
        this.setData({
            diameterIndex: e.detail.value
        })
    },
    /**
     * 获取雷亚架宽度
     */
    getWidth1: function(e) {
        var that = this;
        that.setData({
            width1: e.detail.value
        })
        // 计算立柱、横杆、斜拉数量
        calculateNumber(that);
    },
    /**
     * 获取雷亚架厚度
     */
    getThickness: function(e) {
        var that = this;
        that.setData({
            thickness: e.detail.value
        })
        // 计算立柱、横杆、斜拉数量
        calculateNumber(that);
    },
    /**
     * 获取雷亚架高度
     */
    getHeight1: function(e) {
        var that = this;
        that.setData({
            height1: e.detail.value
        })
        // 计算立柱、横杆、斜拉数量
        calculateNumber(that);
    }
});
/**
 * 通过宽度,高度算出面积
 */
function getArea(that, width, height, pointperunit) {
    if (width && height) {
        let area = width * height;
        that.setData({
            widthPoint: width * pointperunit,
            heightPoint: height * pointperunit,
            areaPoint: (width * pointperunit) * (height * pointperunit),
            area: area
        })
        let width_spec = that.data.width_spec;
        let height_spec = that.data.height_spec;
        if (width_spec && height_spec) {
            that.setData({
                widthBlock: (width / (width_spec / 1000)).toFixed(2),
                heightBlock: (height / (height_spec / 1000)).toFixed(2),
                sumBlock: ((width / (width_spec / 1000)) * (height / (height_spec / 1000))).toFixed(2)
            })
        }
    }
}
/**
 * 计算雷亚架数量
 */
function calculateNumber(that) {
    let width = that.data.width1;
    let thickness = that.data.thickness;
    let height = that.data.height1;
    console.info(width);
    console.info(thickness);
    console.info(height);
    console.info(height / 2 * 4 / 3 + 1);
    console.info(Math.round(height / 2 * 4 / 3 + 1));
    if (width && thickness && height) {
        that.setData({
            number1: [(width / 2 + 1) * (thickness / 2 + 1)] * (height / 2),
            number2: [(width / 2 + 1) * thickness / 2 + width / 2 * (thickness / 2 + 1)] * (height / 2 + 1),
            number3: (width / 2 * height / 2 * (thickness / 2 + 1))+ (width / 2 + 1)*thickness / 2 * height / 2
        })
    }else {
        that.setData({
            number1: '',
            number2: '',
            number3: ''
        })
    }
}
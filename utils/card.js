export default class LastMayday {
    palette(that, baseurl) {
        var userpic = (that.data.userRequestInfo.userpic != '') ? (that.data.userRequestInfo.userpic) : '../images/img-header.png'; //用户头像
        var uname = that.data.userRequestInfo.username; //用户名
        var portname = "城市：" + that.data.userRequestInfo.cityname; //城市
        var companyname = (that.data.userRequestInfo.companyname == '' ? "公司：未填写" : that.data.userRequestInfo.companyname); //公司
        var phone = "手机号：" + that.data.userRequestInfo.phone; //电话
        var mainbusiness = "主营业务：" + ((that.data.userRequestInfo.businesslabel == '') ? '未填写' : that.data.userRequestInfo.businesslabel); //主营业务
        var qrcode = baseurl + 'Index/getWXAppQrcode?page=pages/recommend/recommend&scene=?userid=' + that.data.userid + '*companyid=' + that.data.companyid
        return ({
            width: '654rpx',
            height: '600rpx',
            background: '#ffffff',
            borderWidth: '2rpx',
            borderColor: '#d43d3d',
            borderRadius: '20rpx',
            top: '0rpx',
            views: [{
                    type: 'text',
                text: uname,
                    css: [{
                        top: `40rpx`,
                        align: 'left',
                        width: '400rpx',
                        maxLines: 1,
                    }, common, {
                        left: '40rpx'
                    }],
                },
                {
                    type: 'text',
                    text: portname,
                    css: [{
                        top: `100rpx`,
                        width: '400rpx',
                        maxLines: 1,
                        color: '#adadad',
                    }, common, {
                        left: '40rpx',
                        fontSize: '30rpx'
                    }],
                },
                {
                    type: 'image',
                    url: userpic,
                    css: {
                        top: '40rpx',
                        right: '40rpx',
                        borderRadius: '120rpx',
                        width: '100rpx',
                        height: '100rpx',
                    },
                },
                {
                    type: 'text',
                    text: companyname,
                    css: [{
                        top: `150rpx`,
                        width: '400rpx',
                        maxLines: 1,
                    }, common, {
                        left: '40rpx',
                        fontSize: '30rpx'
                    }],
                },
                {
                    type: 'text',
                    text: phone,
                    css: [{
                        top: `220rpx`,
                        width: '400rpx',
                        maxLines: 1,
                    }, common, {
                        left: '40rpx',
                        fontSize: '30rpx'
                    }],
                },
                {
                    type: 'text',
                    text: mainbusiness,
                    css: [{
                        top: `265rpx`,
                        width: '560rpx',
                        maxLines: '2',
                    }, common, {
                        left: '40rpx',
                        fontSize: '30rpx',
                        lineHeight: '36rpx'
                    }],
                },
                {
                    type: 'rect',
                    css: {
                        top: '0rpx',
                        color: '#d43d3d',
                        width: '654rpx',
                        height: '20rpx',
                        borderRadius: '20rpx',
                    },
                },
                {
                    type: 'rect',
                    css: {
                        top: '0rpx',
                        left: '0rpx',
                        color: '#d43d3d',
                        width: '20rpx',
                        height: '380rpx',
                    },
                },
                {
                    type: 'rect',
                    css: {
                        bottom: '220rpx',
                        color: '#d43d3d',
                        width: '654rpx',
                        height: '20rpx',
                    },
                },
                {
                    type: 'rect',
                    css: {
                        top: '0rpx',
                        right: '0rpx',
                        color: '#d43d3d',
                        width: '20rpx',
                        height: '380rpx',
                    },
                },
                {
                    type: 'text',
                    text: '您好，这是我的名片请惠存',
                    css: [{
                        bottom: `100rpx`,
                        width: '300rpx',
                        lineHeight: '40rpx',
                    }, common, {
                        left: '40rpx',
                        fontSize: '30rpx'
                    }],
                },
                {
                    type: 'text',
                    text: '长按或扫描进去，查看更多信息',
                    css: [{
                        bottom: `70rpx`,
                        width: '400rpx',
                        color: '#adadad',
                    }, common, {
                        left: '40rpx',
                        fontSize: '26rpx'
                    }],
                },
                {
                    type: 'image',
                    url: qrcode,
                    css: {
                        bottom: '40rpx',
                        right: '40rpx',
                        width: '160rpx',
                        height: '160rpx',
                    },
                },
            ],
        });
    }
}

const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
    left: `${startLeft}rpx`,
    fontSize: '40rpx',
};

function _textDecoration(decoration, index, color) {
    return ({
        type: 'text',
        text: decoration,
        css: [{
            top: `${startTop + index * gapSize}rpx`,
            color: color,
            textDecoration: decoration,
        }, common],
    });
}

function _image(index, rotate, borderRadius) {
    return ({
        type: 'image',
        url: '/images/logo.png',
        css: {
            top: `${startTop + 8.5 * gapSize}rpx`,
            left: `${startLeft + 160 * index}rpx`,
            width: '120rpx',
            height: '120rpx',
            rotate: rotate,
            borderRadius: borderRadius,
        },
    });
}

function _des(index, content) {
    const des = {
        type: 'text',
        text: content,
        css: {
            fontSize: '22rpx',
            top: `${startTop + 8.5 * gapSize + 140}rpx`,
        },
    };
    if (index === 3) {
        des.css.right = '60rpx';
    } else {
        des.css.left = `${startLeft + 120 * index + 30}rpx`;
    }
    return des;
}
App({
	onLaunch: function () {},
	globalData: {
		userInfo: null,
		// 运行环境
		workInfo: null,
		// 获取顶部状态栏的高度：rpx
		statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'] * (750 / wx.getSystemInfoSync()['windowWidth']),
		// 设置全局header-top高度：rpx
		headerTopHeader: 88,
		// 设置全局header搜索框高度：rpx
		headerSearchHeader: 100,
	},

	onShow(options) {
    // 判断运行环境
		this.judgeWork(options);
  },

	judgeWork(options) {
		const workInfo = wx.getSystemInfoSync();
		console.log('环境', workInfo);
		const { screenWidth } = workInfo
		this.ratio = 667/375
		this.globalData.workInfo = workInfo;
	},
})
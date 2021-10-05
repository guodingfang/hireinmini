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
	/**
	 * 获取微信code
	 */
	getWxCode: function () {
		wx.login({
			success: function (res) {
				var date = new Date;
				wx.setStorageSync('wxcode', res);
			}
		})
	},

	onShow(options) {
    // 判断运行环境
		this.judgeWork(options);
  },

	judgeWork(options) {
		const workInfo = wx.getSystemInfoSync();
		console.log('环境', workInfo);
		this.globalData.workInfo = workInfo;
	},
})
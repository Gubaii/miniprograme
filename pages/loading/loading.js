Page({
  data: {
    imagePath: '',
    remainingTime: 40,
    timer: null
  },

  onLoad(options) {
    if (options.path) {
      this.setData({
        imagePath: decodeURIComponent(options.path)
      });
      this.startCountdown();
    }
  },

  onUnload() {
    // 清除定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 开始倒计时
  startCountdown() {
    const timer = setInterval(() => {
      if (this.data.remainingTime <= 1) {
        clearInterval(timer);
        // 处理完成后更新历史记录状态
        this.updateHistoryStatus();
      }
      this.setData({
        remainingTime: this.data.remainingTime - 1
      });
    }, 1000);

    this.setData({ timer });
  },

  // 更新历史记录状态
  updateHistoryStatus() {
    const pages = getCurrentPages();
    const indexPage = pages.find(page => page.route === 'pages/index/index');
    if (indexPage) {
      // 获取历史记录
      let history = wx.getStorageSync('image_history') || [];
      if (history.length > 0) {
        // 更新最新记录的状态
        history[0].status = 'done';
        wx.setStorageSync('image_history', history);
      }
    }
  },

  // 返回首页
  goBack() {
    wx.navigateBack({
      delta: 2  // 返回两层，回到首页
    });
  },

  // 查看记录
  checkHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    });
  }
}); 
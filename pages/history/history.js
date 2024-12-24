Page({
  data: {
    historyList: [],
    statusMap: {
      'waiting': '等待中',
      'processing': '处理中',
      'error': '出错了',
      'done': '完成'
    }
  },

  onLoad() {
    this.loadHistoryData();
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadHistoryData();
  },

  // 加载历史记录数据
  loadHistoryData() {
    const timestamp = new Date().getTime();
    const oneDayAgo = timestamp - 24 * 60 * 60 * 1000;
    
    // 获取本地存储的历史记录
    let history = wx.getStorageSync('image_history') || [];
    
    // 过滤24小时内的记录
    history = history.filter(item => item.createTime > oneDayAgo);
    
    // 更新显示
    this.setData({
      historyList: history
    });
  },

  // 重试处理
  handleRetry(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    // 更新状态为等待中
    const historyList = this.data.historyList;
    historyList[index].status = 'waiting';
    this.setData({ historyList });
    
    // 保存到存储
    wx.setStorageSync('image_history', historyList);
    
    // 模拟重新处理
    this.processImage(index);
  },

  // 处理图片
  processImage(index) {
    // 更新状态为处理中
    const historyList = this.data.historyList;
    historyList[index].status = 'processing';
    this.setData({ historyList });
    
    // 模拟处理过程
    setTimeout(() => {
      historyList[index].status = Math.random() > 0.5 ? 'done' : 'error';
      this.setData({ historyList });
      wx.setStorageSync('image_history', historyList);
    }, 2000);
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
      current: url
    });
  },

  // 删除记录
  deleteHistory(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const historyList = this.data.historyList;
          historyList.splice(index, 1);
          this.setData({ historyList });
          wx.setStorageSync('image_history', historyList);
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadHistoryData();
    wx.stopPullDownRefresh();
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '图片处理记录',
      path: '/pages/history/history'
    };
  }
}); 
App({
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
    // 图片处理相关配置
    imageConfig: {
      maxSize: 10 * 1024 * 1024, // 最大10MB
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif'],
      maxWidth: 4096,
      maxHeight: 4096
    },
    // 积分系统配置
    pointsConfig: {
      initialPoints: 23,
      costPerProcess: 1
    }
  },

  onLaunch() {
    // 初始化用户信息
    this.initUserInfo();
    // 初始化积分系统
    this.initPointsSystem();
    // 检查更新
    this.checkUpdate();
  },

  // 初始化用户信息
  initUserInfo() {
    if (wx.getUserProfile) {
      this.globalData.canIUseGetUserProfile = true;
    }
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.hasUserInfo = true;
    }
  },

  // 初始化积分系统
  initPointsSystem() {
    let points = wx.getStorageSync('user_points');
    if (!points && points !== 0) {
      points = this.globalData.pointsConfig.initialPoints;
      wx.setStorageSync('user_points', points);
    }
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败，请检查网络后重试'
            });
          });
        }
      });
    }
  },

  // 检查图片是否符合要求
  checkImage(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.getFileInfo({
        filePath: tempFilePath,
        success: (res) => {
          if (res.size > this.globalData.imageConfig.maxSize) {
            reject('图片大小不能超过10MB');
            return;
          }
          wx.getImageInfo({
            src: tempFilePath,
            success: (imageInfo) => {
              if (imageInfo.width > this.globalData.imageConfig.maxWidth ||
                  imageInfo.height > this.globalData.imageConfig.maxHeight) {
                reject('图片尺寸过大');
                return;
              }
              resolve(true);
            },
            fail: () => reject('获取图片信息失败')
          });
        },
        fail: () => reject('获取文件信息失败')
      });
    });
  },

  // 扣除积分
  deductPoints(points) {
    return new Promise((resolve, reject) => {
      let currentPoints = wx.getStorageSync('user_points') || 0;
      if (currentPoints < points) {
        reject('积分不足');
        return;
      }
      currentPoints -= points;
      wx.setStorageSync('user_points', currentPoints);
      resolve(currentPoints);
    });
  },

  // 添加积分
  addPoints(points) {
    let currentPoints = wx.getStorageSync('user_points') || 0;
    currentPoints += points;
    wx.setStorageSync('user_points', currentPoints);
    return currentPoints;
  }
}); 
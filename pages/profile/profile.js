Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '不知名的某个用户名'
    },
    points: 23
  },

  onLoad() {
    // 获取用户信息
    this.getUserProfile();
    // 获取积分
    this.getPoints();
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.userInfo.avatarUrl,
          'userInfo.nickName': res.userInfo.nickName
        });
        // 保存用户信息
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: () => {
        // 如果用户拒绝授权，使用本地存储的信息
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          this.setData({
            userInfo: userInfo
          });
        }
      }
    });
  },

  // 获取积分
  getPoints() {
    // 从本地存储获取积分
    const points = wx.getStorageSync('user_points') || 23;
    this.setData({
      points: points
    });
  },

  // 购买积分
  buyPoints() {
    wx.showModal({
      title: '购买积分',
      content: '确定要购买积分吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 实现积分购买逻辑
          wx.showToast({
            title: '购买成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看用户协议
  showUserAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 查看关于我们
  showAboutUs() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  // 更新用户头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    });
    // 保存到本地存储
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.avatarUrl = avatarUrl;
    wx.setStorageSync('userInfo', userInfo);
  },

  // 更新用户昵称
  onUpdateNickname(e) {
    const nickName = e.detail.value;
    this.setData({
      'userInfo.nickName': nickName
    });
    // 保存到本地存储
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.nickName = nickName;
    wx.setStorageSync('userInfo', userInfo);
  },

  onShareAppMessage() {
    return {
      title: '图片处理工具',
      path: '/pages/index/index'
    };
  }
}); 
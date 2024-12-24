Page({
  data: {
    tools: [
      { id: 'enlarge', icon: '/assets/icons/tools/scale', name: '图片无损放大' },
      { id: 'colorize', icon: '/assets/icons/tools/palette', name: '黑白照片上色' },
      { id: 'idphoto', icon: '/assets/icons/tools/id-card', name: '证件照生成' },
      { id: 'collage', icon: '/assets/icons/tools/grid', name: '朋友圈拼图' },
      { id: 'resize', icon: '/assets/icons/tools/resize', name: '图片改尺寸' },
      { id: 'watermark', icon: '/assets/icons/tools/watermark', name: '图片加水印' }
    ],
    bannerImages: [
      '/assets/images/banner1.jpg',
      '/assets/images/banner2.jpg',
      '/assets/images/banner3.jpg'
    ],
    currentSlide: 0,
    uploadedImage: ''  // 用于存储用户上传的图片
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 选择图片
  chooseImage() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选取', '从聊天记录选取'],
      success: (res) => {
        let sourceType = ['camera', 'album', 'message'][res.tapIndex];
        if (sourceType === 'message') {
          // 从聊天记录选择
          wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success: (res) => {
              console.log('选择聊天文件成功：', res.tempFiles[0]);
              this.handleImageSelected(res.tempFiles[0].path);
            },
            fail: (error) => {
              console.error('选择聊天文件失败：', error);
              wx.showToast({
                title: '选择图片失败',
                icon: 'none'
              });
            }
          });
        } else {
          // 从相机或相册选择
          wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: [sourceType],
            success: (res) => {
              console.log('选择媒体成功：', res.tempFiles[0]);
              this.handleImageSelected(res.tempFiles[0].tempFilePath);
            },
            fail: (error) => {
              console.error('选择媒体失败：', error);
              wx.showToast({
                title: '选择图片失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 处理选中的图片
  handleImageSelected(imagePath) {
    console.log('处理选中的图片：', imagePath);
    
    // 显示加载中
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    // 使用文件系统管理器
    const fs = wx.getFileSystemManager();
    
    try {
      // 读取原始图片
      const buffer = fs.readFileSync(imagePath);
      
      // 生成一个新的临时文件路径
      const fileName = `temp_${Date.now()}.jpg`;
      const newTempPath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      console.log('准备写入文件路径：', newTempPath);
      
      // 写入新文件
      fs.writeFileSync(newTempPath, buffer);
      console.log('保存文件成功，新路径：', newTempPath);
      
      // 构造wxfile协议的路径
      const wxFilePath = newTempPath;
      console.log('最终文件路径：', wxFilePath);

      this.setData({
        uploadedImage: wxFilePath
      }, () => {
        wx.hideLoading();
        wx.navigateTo({
          url: `/pages/edit/edit?path=${encodeURIComponent(wxFilePath)}`,
          fail: (error) => {
            console.error('跳转编辑页面失败：', error);
            wx.showToast({
              title: '跳转失败',
              icon: 'none'
            });
          }
        });
      });
    } catch (error) {
      console.error('文件处理失败：', error);
      wx.hideLoading();
      wx.showToast({
        title: '图片处理失败',
        icon: 'none'
      });
    }
  },

  // 保存到历史记录
  saveToHistory(imagePath) {
    const timestamp = new Date().getTime();
    const historyItem = {
      id: timestamp,
      image: imagePath,
      status: 'waiting',
      type: '图片高清修复',
      createTime: timestamp
    };
    
    // 获取现有历史记录
    let history = wx.getStorageSync('image_history') || [];
    // 只保留24小时内的记录
    const oneDayAgo = timestamp - 24 * 60 * 60 * 1000;
    history = history.filter(item => item.createTime > oneDayAgo);
    // 添加新记录
    history.unshift(historyItem);
    // 保存更新后的���史记录
    wx.setStorageSync('image_history', history);
  },

  // 处理工具点击
  handleToolClick(e) {
    const toolId = e.currentTarget.dataset.id;
    if (!this.data.uploadedImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    // 根据工具类型处理图片
    switch (toolId) {
      case 'enlarge':
        this.handleEnlarge();
        break;
      case 'colorize':
        this.handleColorize();
        break;
      case 'idphoto':
        this.handleIdPhoto();
        break;
      case 'collage':
        this.handleCollage();
        break;
      case 'resize':
        this.handleResize();
        break;
      case 'watermark':
        this.handleWatermark();
        break;
    }
  },

  // 图片无损放大
  handleEnlarge() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现图片放大逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 黑白照片上色
  handleColorize() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现照片上色逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 证件照生成
  handleIdPhoto() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现证件照生成逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 朋友圈拼图
  handleCollage() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现拼图逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 图片改尺寸
  handleResize() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现改尺寸逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 图片加水印
  handleWatermark() {
    wx.showLoading({ title: '处理中' });
    // TODO: 实现加水印逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '处理完成' });
    }, 2000);
  },

  // 轮播图切换事件
  onSlideChange(e) {
    this.setData({
      currentSlide: e.detail.current
    });
  }
}); 
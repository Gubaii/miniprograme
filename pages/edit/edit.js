Page({
  data: {
    imagePath: '',
    rotation: 0
  },

  onLoad(options) {
    if (options.path) {
      const path = decodeURIComponent(options.path);
      console.log('编辑页面接收到的图片路径：', path);
      
      // 使用文件系统管理器检查文件
      const fs = wx.getFileSystemManager();
      
      try {
        // 检查文件是否存在
        fs.accessSync(path);
        console.log('文件存在，可以访问');
        
        // 获取文件信息
        const fileInfo = fs.statSync(path);
        console.log('文件信息：', fileInfo);
        
        // 设置图片路径
        this.setData({
          imagePath: path
        });
      } catch (error) {
        console.error('文件访问失败：', error);
        wx.showToast({
          title: '图片加载失败',
          icon: 'none'
        });
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } else {
      wx.showToast({
        title: '未选择图片',
        icon: 'none'
      });
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onUnload() {
    // 页面卸载时清理临时文件
    if (this.data.imagePath && this.data.imagePath.includes('temp_')) {
      const fs = wx.getFileSystemManager();
      try {
        fs.unlinkSync(this.data.imagePath);
        console.log('清理临时文件成功');
      } catch (error) {
        console.error('清理临时文件失败：', error);
      }
    }
  },

  // 裁剪图片
  cropImage() {
    const that = this;
    wx.cropImage({
      src: this.data.imagePath,
      success(res) {
        console.log('裁剪成功，新路径：', res.tempFilePath);
        // 将裁剪后的图片保存到应用空间
        const fs = wx.getFileSystemManager();
        const fileName = `temp_crop_${Date.now()}.jpg`;
        const newPath = `${wx.env.USER_DATA_PATH}/${fileName}`;
        
        try {
          // 读取裁剪后的临时文件
          const buffer = fs.readFileSync(res.tempFilePath);
          // 写入新文件
          fs.writeFileSync(newPath, buffer);
          
          that.setData({
            imagePath: newPath
          });
        } catch (error) {
          console.error('保存裁剪图片失败：', error);
          wx.showToast({
            title: '裁剪失败',
            icon: 'none'
          });
        }
      },
      fail(error) {
        console.error('裁剪失败：', error);
        wx.showToast({
          title: '裁剪失败',
          icon: 'none'
        });
      }
    });
  },

  // 旋转图片
  rotateImage() {
    let newRotation = (this.data.rotation + 90) % 360;
    wx.editImage({
      src: this.data.imagePath,
      rotate: newRotation,
      success: (res) => {
        console.log('旋转成功，新路径：', res.tempFilePath);
        // 将旋转后的图片保存到应用空间
        const fs = wx.getFileSystemManager();
        const fileName = `temp_rotate_${Date.now()}.jpg`;
        const newPath = `${wx.env.USER_DATA_PATH}/${fileName}`;
        
        try {
          // 读取旋转后的临时文件
          const buffer = fs.readFileSync(res.tempFilePath);
          // 写入新文件
          fs.writeFileSync(newPath, buffer);
          
          this.setData({
            imagePath: newPath,
            rotation: newRotation
          });
        } catch (error) {
          console.error('保存旋转图片失败：', error);
          wx.showToast({
            title: '旋转失败',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('旋转失败：', error);
        wx.showToast({
          title: '旋转失败',
          icon: 'none'
        });
      }
    });
  },

  // 开始处理
  startProcess() {
    // 显示加载动画
    wx.showLoading({
      title: '处理中',
      mask: true
    });

    // 保存到历史记录
    const pages = getCurrentPages();
    const indexPage = pages.find(page => page.route === 'pages/index/index');
    if (indexPage) {
      indexPage.saveToHistory(this.data.imagePath);
    }

    // 延迟后跳转到处理页面
    setTimeout(() => {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/loading/loading?path=${encodeURIComponent(this.data.imagePath)}`
      });
    }, 1000);
  }
}); 
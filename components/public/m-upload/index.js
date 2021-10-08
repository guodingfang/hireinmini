import { promisic } from '../../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    uploadType: {
      type: String,
      value: 'img'
    },
    images: {
      type: Array,
      value: [],
      observer(val) {
        this.setData({
          showImages: val
        })
      } 
    },
    maxCount: {
      type: String,
      value: '4',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 上传图片
    showImages: [],
    uploadImages: [],

    // 上传视频
    uploadVideo: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 图片上传
    async onChooseImage(event) {
      const { maxCount } = this.properties;
      const { showImages, uploadImages } = this.data

      const { tempFilePaths = [] } = await promisic(wx.chooseImage)({
        count: maxCount - showImages.length,
        sourceType: ['album', 'camera'],
      });
      const _showImages = [...showImages, ...tempFilePaths]
      const _uploadImages = [...uploadImages, ...tempFilePaths]
      this.setData({
        showImages: _showImages,
        uploadImages: _uploadImages
      })
      this.triggerEvent('complete', {
        type: 'img',
        uploadImages: _uploadImages,
      }, {})
    },

    async onChooseVideo() {
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 3000
      })
      const res = await promisic(wx.chooseVideo)({
        sourceType: ['album', 'camera'],
      });
      wx.hideToast()
      const { tempFilePath } = res
      this.setData({
        uploadVideo: tempFilePath,
      })
      this.triggerEvent('complete', {
        type: 'video',
        uploadVideo: tempFilePath,
        formDataParams: {
          duration: res.duration,
          width: res.width,
          height: res.height,
          videotime: res.duration,
          imgsign: 1,
        }
      }, {})
    },

    onShowImage(event) {
      const { idx } = event.currentTarget.dataset;
      const { showImages } = this.data;
      promisic(wx.previewImage)({
        current: showImages[idx],  // 当前显示图片的http链接
        urls: showImages         // 需要预览的图片http链接列表
      })
    },

    // 关闭删除图片
    onCloseImage(event) {
      let { showImages, uploadImages } = this.data;
      const { idx } = event.currentTarget.dataset;
      const deleteItem =  showImages.splice(idx, 1)
      uploadImages.splice(idx, 1)
      this.setData({
        showImages,
        uploadImages,
      })
      this.triggerEvent('delete', {
        item: deleteItem
      }, {})
    },
  }
})

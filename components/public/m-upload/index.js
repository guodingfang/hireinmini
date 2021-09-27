import { promisic } from '../../../utils/util.js'
import config from '../../../config'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    uploadType: {
      type: String,
      value: 'img'
    },
    prefixUri: String,
    productcode: String,
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
      type: Number,
      value: 4
    },
    triggerUpload: {
      type: Boolean,
      value: false,
      observer(val) {
        this.uploadContent()
      }
    },
    uploadId: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploadUrl: `${config.baseUrl}/Release/addMsgPicture`,
    imagesIngos: [],
    showImages: [],
    uploadImages: [],

    // 上传视频
    showVideo: '',
    uploadVideo: '',
    formDataParams: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 图片上传
    async onChooseImage(event) {
      const { maxCount, images } = this.properties;
      const { tempFilePaths = [] } = await promisic(wx.chooseImage)({
        count: maxCount - images.length,
        sourceType: ['album', 'camera'],
      });
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 1000
      }).then(() => {
        this.setData({
          showImages: [...this.data.showImages, ...tempFilePaths],
          uploadImages: [...this.data.uploadImages, ...tempFilePaths]
        })
        this.triggerEvent('isUpload', {
          upload: true,
          type: 'img'
        }, {})
      })
    },

    onShowImage(event) {
      const { idx } = event.currentTarget.dataset;
      const { showImages } = this.data;
      promisic(wx.previewImage)({
        current: showImages[idx],  // 当前显示图片的http链接
        urls: showImages         // 需要预览的图片http链接列表
      })
    },

    // 上传内容
    async uploadContent() {
      const { triggerUpload, uploadType } = this.properties
      const { uploadImages, uploadVideo } = this.data
      if (!triggerUpload) return
      console.log('uploadType', uploadType)
      if (uploadType === 'img') {
        for (let [index, value] of uploadImages.entries()) {
          await this._upload(value)
        }
      } else if (uploadType === 'video') {
        await this._upload(uploadVideo)
      }

      this.triggerEvent('uploadComplete', {}, {})
    },

    // 上传
    async _upload(file) {
      console.log('file', file)
      const { uploadId } = this.properties
      const { uploadUrl, formDataParams } = this.data
      await promisic(wx.uploadFile)({
        url: uploadUrl,
        filePath: file,
        name: 'file',
        formData: {
          msgid: uploadId,
          ...formDataParams,
        },
        header: {
          'content-type': 'multipart/form-data'
        }
      })
    },

    // 关闭删除图片
    onCloseImage(event) {
      const { showImages, uploadImages } = this.data;
      const { uploadId } = this.properties
      if(!uploadId) {
        const { idx } = event.currentTarget.dataset;
        this.setData({
          showImages: showImages.splice(idx, 1),
          uploadImages: uploadImages.splice(idx, 1),
        })
      }
    },

    async onChooseVideo() {
      const res = await promisic(wx.chooseVideo)({
        sourceType: ['album', 'camera'],
      });
      console.log('res', res)
      const { tempFilePath, thumbTempFilePath, size } = res
      this.setData({
        showVideo: thumbTempFilePath,
        uploadVideo: tempFilePath,
        formDataParams: {
          duration: res.duration,
          width: res.width,
          height: res.height,
          videotime: res.duration,
          imgsign: 1,
        }
      })
      this.triggerEvent('isUpload', {
        upload: true,
        type: 'video'
      }, {})
    }
  }
})

// components/public/parse/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    html: {
      type: String,
      value: '',
      observer: function() {
        this.getParseHtml();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getParseHtml() {
      const { html } = this.properties; 
      if (!html) return;
      this.setData({
        parseHtml: html.replace(/\<img/gi, '<img style="width:calc(100% - 32px);margin:0 16px;height:auto"'),
      })
    }
  }
})

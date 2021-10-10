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
      let parseHtml = html.replace(/\<img/gi, '<img style="width:100%;height:auto"')
      this.setData({
        parseHtml,
      })
    }
  }
})

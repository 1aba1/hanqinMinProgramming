// component/article/article.js
var app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:String,
    author:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight,  //滚动页面高度
    tarbarHeight:app.globalData.tarbarHeight //底部tarbar高度
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

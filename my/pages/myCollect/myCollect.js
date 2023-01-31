// pages/myCollect/myCollect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "Pagechange":1,
    "isAppreFlag":false,
    "searching":false, //正在搜索
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight,  //滚动页面高度
    tarbarHeight:app.globalData.tarbarHeight, //底部tarbar高度
    searchContent:"", //搜索内容
    page:1 ,//当前页数
    pageSize:1, //每页数量
  },
 
  changePage(e){ //改变展示页面
    if(e.detail.Pagechange){
      this.setData({
        Pagechange:2
      })
    }else{
      this.setData({
        Pagechange:1
      })
    }
  },
  changAppre(){ //改变历史或故事页面的收藏
    this.setData({
      isAppreFlag:!this.data.isAppreFlag
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
// pages/idiomGame/idiomGame.js
var app=getApp();
Page({
  back(){
    wx.navigateBack();
  },
  /**
   * 页面的初始数据
   */
  data: {
    userAnswer:["今日始发“孤”字"],
    robotAnswer:[
      { poetry:"孤舟蓑笠翁，独钓寒江雪。",
        name:"江雪 柳宗元"
      },
      { poetry:"孤舟蓑笠翁，独钓寒江雪。",
        name:"江雪 柳宗元"
      },
    ],
    blankContent:'',
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight , //滚动页面高度
  },
  submitContent(e){
    var userAnswer=this.data.userAnswer
    userAnswer.push(e.detail.value.content)
    this.setData({
      blankContent:"",
      userAnswer:userAnswer
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
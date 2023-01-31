// pages/discover/discover.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAnimate:false,
    gameId:0,  /* 1--成语  2--飞花  3--诗词*/
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight , //滚动页面高度
  },
  intoGame(e){ /* 改变gamId*/ 
    if(this.data.isAnimate){  /*节流处理*/ 
      return
    }
    this.setData({
      isAnimate:true
    })
    var that=this;
    this.setData({
      gameId:e.currentTarget.dataset.gameid
    })
    setTimeout(()=>{
      if(that.data.gameId==1){
        wx.navigateTo({
          url: '/game/pages/idiomGame/idiomGame',
        })
      }
      if(that.data.gameId==2){
        wx.navigateTo({
          url: '/game/pages/feihuaGame/feihuaGame',
        })
      }
      if(that.data.gameId==3){
        wx.navigateTo({
          url: '/game/pages/poetryGame/poetryGame',
        })
      }
      this.setData({
        isAnimate:false,
        gameId:0
      })
    },1500)
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
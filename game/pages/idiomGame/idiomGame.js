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
    userAnswer:["今日始发“柳”字"],
    robotAnswer:["柳暗花明","傍花随柳","宠柳娇花","残花败柳","分花约柳","分花拂柳",
    "花衢柳陌","花明柳媚","花街柳市","花街柳陌",
    "花遮柳掩","花明柳暗","花街柳巷","花遮柳隐",
    "花红柳绿","柳骨颜筋","柳啼花怨",
    "柳莺花燕","柳营花市","柳夭桃艳","柳腰莲脸",
    "柳腰花态","柳巷花街","柳下借阴","柳圣花神",
    "柳弱花娇","柳衢花市","柳暖花春","柳陌花衢",
    "柳陌花街","柳陌花丛","柳门竹巷","柳眉踢竖",
    "柳眉剔竖","柳眉倒竖","柳街花巷","柳娇花媚",
    "柳昏花螟","柳亸莺娇","柳亸花娇","柳宠花迷",
    "柳暗花遮","路柳墙花","柳絮才高"],
    blankContent:'',
    remindPopover:false,
    popIshidden:true,
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight , //滚动页面高度
  },
  // e.detail.value.content
  submitContent(e){
    var idiom=e.detail.value.content //判断成语是否含有关键词
    if(idiom.indexOf("柳") != -1){
      var userAnswer=this.data.userAnswer
      userAnswer.push(e.detail.value.content)
      this.setData({
        userAnswer:userAnswer
      })
    }else{
      this.setData({
        popIshidden:false
      })
      let that=this;
      console.log(this.data.popIshidden)
      setTimeout(()=>{
        that.setData({
          popIshidden:true
        })
      },1500);
      console.log(this.data.popIshidden)
    }
    this.setData({
      blankContent:"",
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
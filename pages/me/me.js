// pages/me/me.js



const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCommitPopovar:false, //展示弹窗
    "changeUserName":false, //是否在改变用户名
     username:"", //用户姓名
    "pageCategory":0,  //1--收藏页面 2--创作页面 3--历史记录
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight,  //滚动页面高度
    "srcI": "", //头像图片本地存放的地址
    "DMSsrcI": "", //头像图片数据库存放的地址
     avatarUrl:"", //头像图片base64码
  },
  changePage(e){ //进行页面导航
    const pageCategory=e.currentTarget.dataset.pagecategory
    if(pageCategory==1){
      wx.navigateTo({
        url: '/my/pages/myCollect/myCollect',
      })
    }
    if(pageCategory==2){
      wx.navigateTo({
        url: '/my/pages/myCreation/myCreation',
      })
    }
    if(pageCategory==3){
      wx.navigateTo({
        url: '/my/pages/myHistory/myHistory',
      })
    }
  },
  bindUserName(e){ //与输入框内容实时绑定
    this.setData({
      username:e.detail.value
    })
  },
  inputUserName(e){ //唤醒输入框
    this.setData({
      changeUserName:true
    })
  },
  stopInput(){ //结束输入
    this.setData({
      changeUserName:false
    })
  },
  async sendUserName(e){ //重新设置姓名
    await this.sendUseMessage(); //发送用户更改信息
    await this.getUseMessage();  //重新获取用户信息
    this.setData({
      changeUserName:false
    })
  },
  //设置头像功能
  async uploadImg(){
    await this.chooseImg(); //选择图片
    await this.sendImg();//发送图片
    await this.sendUseMessage(); //发送用户更改信息
    await this.getUseMessage();  //重新获取用户信息
    await this.requestAvaPicture(); //获取用户图片
  },
  // 上传图片
  async sendImg(){
    let res= await wx.p.uploadFile({
      url: "http://43.139.223.241:8083/picture/upload",
      method: 'POST',
      filePath: this.data.srcI,
      name: 'file',
    });
    console.log("上传图片：获得数据库地址",res)
    this.setData({
      DMSsrcI:res.data.split("\"")[9]
    })
  },
  // 选择图片
  async chooseImg(){
    let res= await wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
    });
    this.setData({
      srcI:res.tempFiles[0].tempFilePath
    })
    console.log("选择图片： 获得本地地址",res)
  },
  // 请求头像图片
  async requestAvaPicture(){
    const res =await wx.p.request({
      url: 'http://43.139.223.241:8083/picture/download',
      method:"GET",
      data:{
        name:this.data.DMSsrcI
      },
      header:{
        'token':app.globalData.token
      },
      responseType: 'arraybuffer',
    })
    console.log("请求头像图片",res)
    this.setData({
      avatarUrl :wx.arrayBufferToBase64(res.data)
    })
  },
  // 获取用户信息
  async getUseMessage(){
    let {data:res}= await wx.p.request({
      url: 'http://43.139.223.241:8083/user/me',
      method:"GET",
      data:{
      }, 
      header:{
        'token':app.globalData.token,
      },
    })
    this.setData({
        username:res.data.nickname||"游客",
        DMSsrcI:res.data.avatar
    })
    console.log("返回用户数据：",res);
  },
  // 上传用户信息
  async sendUseMessage(){
    let res= await wx.p.request({
      url: 'http://43.139.223.241:8083/user/update',
      method:"POST",
      data:{
        "nickname": this.data.username,
        "avatar":this.data.DMSsrcI
      },
      header:{
        'token':app.globalData.token,
      },
    })
    console.log("已上传用户的更新信息",res);
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this.getUseMessage(); //获取用户信息
    this.requestAvaPicture(); //获取用户头像
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
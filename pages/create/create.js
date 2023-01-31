// pages/create/create.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      "Pagechange":1,//主页面切换 1--展示创作 2--开始创作
      "createTitle":'' , //用户写作的标题
      "createContent":'', //用户写作的内容
      "showExitPopovar":false, //展示退出弹窗
      "showCommitPopovar":false, //展示创作提交弹窗
      "h":app.globalData.h,  //胶囊高度
      "s":app.globalData.s,  //状态栏高度
      'n':app.globalData.n, //导航栏高度
      "pageHeight":app.globalData.pageHeight , //滚动页面高度
      "srcI": "", //创作图片本地存放的地址
      "DMSsrcI": "", //创作图片数据库存放的地址
      "creations":[], //后台返回数据
      "totalCreaNumber":5, //总数据条数
      "page":0, //当前为第几页
      "pageSize":5 ,//每页数量
      "totalPage":0,  //总页数
      "isTotal":false,
      "isLoading":false, //下拉状态
      "isUpLoading":false, //正在上拉状态
  },
  // 上传图片功能
  async uploadImg(){
    await this.chooseImg();
    await this.sendImg();
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
  // 改变主页面
  resetPagechange(e){
    this.setData({
      Pagechange:e.target.dataset.pagechange,
      showExitPopovar:false
    })
  },
  // 弹出提醒保存弹窗
  remindUnsave(){
    // if(this.data.createTitle||this.data.createContent){//用户有创作内容
    //   this.setData({
    //     showExitPopovar:true
    //   })
    // }else
    { //用户没有创作内容
      this.setData({
        Pagechange:1
      })
    }
  },
  // 关闭提醒保存弹窗
  closeRemindUnsave(){
    this.setData({
      showExitPopovar:false
    })
  },
  // 提交创造+弹出已经提交弹窗+重新请求数据
  async submitCreate(){
    await this.sendCreation();
    console.log("1页数是 ",this.data.page)
    await this.setData({
      showCommitPopovar:true,
      page:1,
      creations:[]
    })
    const that=this
    await setTimeout(function(){
      that.setData({
        showCommitPopovar:false,
        "srcI": "", //创作图片存放的数组
        "createTitle":'' , //用户写作的标题
        "createContent":'', //用户写作的内容
      })
    },1000)
    console.log("页数是 ",this.data.page)
    await this.requestCreations(); //重新请求数据
  },
  // 获取用户输入标题
  bindTitle(e){
    // console.log(e.detail.value)
    this.setData({
      createTitle:e.detail.value
    })
  },
  // 获取用户输入文本
  bindText(e){
    this.setData({
      createContent:e.detail.value
    })
  },
  async sendCreation(){ // 提交创造到数据库
    var {data:res}=await wx.p.request({  
      url: 'http://43.139.223.241:8083/literary/upload',
      method:"POST",
      data:{
        "content": this.data.createContent,
        "pictureUrl": this.data.DMSsrcI,
        "title": this.data.createTitle,
      },
      header:{
        'token':app.globalData.token
      },
    })
    console.log("提交创作到数据库",res)
  },
  // 下拉刷新
  async onRefresh(){
    // console.log(222)
    if(this.data.isLoading){ //节流处理
      return
    }
    await this.setData({
      isLoading:true,
      page:Math.ceil(Math.random()*this.data.totalPage/2)
    })
    await wx.request({
      url: 'http://43.139.223.241:8083/literary/allLiterary',
      data:{
        name:"",
        page:this.data.page,
        pageSize:this.data.pageSize
      },
      method:'GET',
      success:(e)=>{
        console.log(e)
        this.setData({
          creations:[...e.data.data.list]
        })
        // console.log(e);
      },
      fail:(e)=>{
        // console.log(e);
      },
      complete:()=>{
        // console.log(this)
        // console.log("@"+this.data.isTotal)
        this.data.isTotal=(this.data.totalCreaNumber<this.data.pageSize*this.data.page)
        this.data.isLoading=false
      }
    })
    await setTimeout(()=>{
      this.setData({
        isLoading:false
      })
    },500)
  },
  // 触底加载
  async reLoad(){
    if(this.data.isTotal||this.data.isUpLoading){ //数据库所有数据请求完或正在请求
      return
    }
   await this.setData({  //页数加一,显示正在加载
     page:this.data.page+1,
     isUpLoading:true
    })
    await this.requestCreations()
    await this.setData({   //关闭正在加载
     isUpLoading:false
    })
  },
  // 请求后台创造数据  
  async requestCreations(){
    let {data:res}= await wx.p.request({
      url: 'http://43.139.223.241:8083/literary/allLiterary',
      data:{
        name:"",
        page:this.data.page,
        pageSize:this.data.pageSize
      },
      method:'GET',
      header:{
        'token':app.globalData.token
      },
    })
    await this.setData({
      creations:[...this.data.creations,...res.data.list],
      totalCreaNumber:res.data.total,
      totalPage:Math.ceil(res.data.total/this.data.pageSize),
      isTotal:this.data.totalCreaNumber<this.data.pageSize*this.data.page
    })
    await this.setData({
      isTotal:this.data.totalCreaNumber<this.data.pageSize*this.data.page
    })
    console.log("请求后台增加创造数据",res)
    console.log("请求后台增加创造数据 当前页数",this.data.page)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.reLoad();
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
    console.log(222);
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
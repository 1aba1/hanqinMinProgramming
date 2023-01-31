// pages/create/create.js
const computedBehavior = require('miniprogram-computed'). behavior
Component({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    "Pagechange":1,//主页面切换 1--展示创作 2--开始创作
    "srcI": "", //图片存放的数组
    "createTitle":'' , //用户写作的标题
    "createContent":'', //用户写作的内容
    "showExitPopovar":false, //展示退出弹窗
    "showCommitPopovar":false, //展示创作提交弹窗
    "isLoading":false, //下拉状态
    "page":1,
    "pageSize":10,
    "creations":[], //后台返回数据
    "totalCreaNumber":5, //总数据条数
    "page":1, //当前为第几页
    "pageSize":2 ,//每页数量
    "totalPage":1, 
  },
  computed:{
    istotal(data){
      return data.totalCreaNumber<data.pageSize*page
    }
  },
  methods:{
     // 测试上图片功能
  uploadImg(){
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: res=>{
          console.log(res)
          this.setData({
            srcI:res.tempFiles[0].tempFilePath
          })
          console.log(this.data.srcI)
        console.log(res.tempFiles[0].tempFilePath)
      }
    })
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
   // 弹出已经提交弹窗 
  submitCreate(){
    this.setData({
      showCommitPopovar:true
    })
    const that=this
    setTimeout(function(){
      that.setData({
        showCommitPopovar:false
      })
    },1500)
  },
  // 获取用户输入标题
  bindTitle(e){
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
  // 下拉刷新
  onRefresh(){
    if(this.data.isLoading){ //节流处理
      return
    }
    this.setData({
      isLoading:true
    })
    setTimeout(()=>{
      this.setData({
        isLoading:false
      })
    },500)
  },
  // 触底加载
  reLoad(){
     // 请求后台数据
     this.setData({  //页数加一
      page:this.data.page+1,
     })
     wx.request({
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
          creations:[...this.data.creations,...e.data.data.list]
        })
        // console.log(e);
      },
      fail:(e)=>{
        // console.log(e);
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求后台数据
    wx.request({
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
          creations:e.data.data.list
        })
        // console.log(e);
      },
      fail:(e)=>{
        // console.log(e);
      },
    })
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
  }
})

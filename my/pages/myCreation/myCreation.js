// pages/myCollect/myCollect.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "Pagechange":1,
    "isAppreFlag":false,
    "createTitle":"" , //用户写作的标题
    "createContent":"", //用户写作的内容
    "showExitPopovar":false, //展示退出弹窗
    "showCommitPopovar":false, //展示创作提交弹窗
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight,  //滚动页面高度
    tarbarHeight:app.globalData.tarbarHeight, //底部tarbar高度
    "srcI": "", //创作图片本地存放的地址
    "DMSsrcI": "", //创作图片数据库存放的地址
    pictureUrl:"",//创作图片64码
    "isLoading":false, //下拉状态
    "isUpLoading":false, //正在上拉状态
    "creations":[], //后台返回数据
    "totalCreaNumber":5, //总数据条数
    "page":0, //当前为第几页
    "pageSize":5 ,//每页数量
    "totalPage":0,  //总页数
    "isTotal":false, //数据是否全部请求完毕
    "searchContent":"" ,//搜索内容
    "litId":0 ,//修改的创作的ID
  },
  backToMe(){ //返回主页面
    wx.navigateBack();
  },
  // 改变主页面
   resetPagechange(e){
    this.setData({
      Pagechange:e.target.dataset.pagechange,
      showExitPopovar:false
    })
  },
  async changePage(e){ //改变展示页面
    if(e.detail.Pagechange){
      await this.setData({
        litId:e.detail.litId
      })  
      await this.requestACreations()
      await this.requestCrePicture();
      await this.setData({
        Pagechange:2
      })
    }else{
      this.setData({
        Pagechange:1
      })
    }
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
          Pagechange:1,
          createContent:"",
          createTitle:"",
          pictureUrl:""
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
      // await console.log("1页数是 ",this.data.page)
      await this.setData({
        showCommitPopovar:true,
        page:1,
        creations:[],
      })
      const that=this
      await setTimeout(function(){
        that.setData({
          showCommitPopovar:false,
          litId:"",
          "srcI": "", //创作图片存放的数组
          "createTitle":'' , //用户写作的标题
          "createContent":'', //用户写作的内容,
          "pictureUrl":"",
        })
      },1000)
      // await console.log("1 ",this.data.creations)
      await this.requestCreations(); //重新请求数据
      // await console.log("2 ",this.data.creations)
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
    async sendCreation(){ // 提交修改创造到数据库
      var {data:res}=await wx.p.request({  
        url: 'http://43.139.223.241:8083/literary/upload',
        method:"POST",
        data:{
          "litId":this.data.litId,
          "content": this.data.createContent,
          "pictureUrl": this.data.DMSsrcI,
          "title": this.data.createTitle,
        },
        header:{
          'token':app.globalData.token
        },
      })
      console.log("litId ",this.data.litId)
      console.log("提交创作到数据库",res)
    },
    // 下拉刷新
    async onRefresh(){
     if(this.data.isLoading){ //节流处理
        return
      }
      await this.setData({
        isLoading:true,
        page:Math.ceil(Math.random()*this.data.totalPage/2)
      })
      await this.requestNewCreations(this.data.value)
      setTimeout(()=>{
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
    // 请求后台增加创造数据
    async requestCreations(){
      console.log("搜索数据是 ",this.data.searchContent)
      let {data:res}= await wx.p.request({
        url: 'http://43.139.223.241:8083/user/myLiterary',
        data:{
          name:this.data.searchContent||"",
          page:this.data.page,
          pageSize:this.data.pageSize
        },
        method:'GET',
        header:{
          'token':app.globalData.token
        },
      })
      this.setData({
        creations:[...this.data.creations,...res.data.list],
        totalCreaNumber:res.data.total,
        totalPage:Math.ceil(res.data.total/this.data.pageSize),
        isTotal:this.data.totalCreaNumber<this.data.pageSize*this.data.page
      })
      console.log("请求后台增加创造数据",res)
    },
    // 重新请求后台数据，覆盖原本数据  --下拉刷新 --搜索
    async requestNewCreations(){
      let {data:res}= await wx.p.request({
        url: 'http://43.139.223.241:8083/user/myLiterary',
        data:{
          name:this.data.searchContent||"",
          page:this.data.page,
          pageSize:this.data.pageSize
        },
        method:'GET',
        header:{
          'token':app.globalData.token
        },
      })
      this.setData({
        creations:[...res.data.list],  //不加上原来的数据
        totalCreaNumber:res.data.total,
        totalPage:Math.ceil( res.data.total/this.data.pageSize),
        isTotal:this.data.totalCreaNumber<this.data.pageSize*this.data.page
      })
      console.log("刷新请求后台数据成功",res)
    },
    // 按输入内容搜索
    async searchCreation(e){
      if(this.data.isUpLoading){ //数据库所有数据请求完或正在请求
        return
      }
      await console.log("1 ",this.data.isUpLoading)
      await this.setData({  //显示正在加载 页数置一 搜索内容更新
        isUpLoading:true,
        searchContent:e.detail.searchContent,
        page:1,
        creations:[]
       })
      await console.log("2 ",this.data.isUpLoading)
      await this.requestNewCreations(e.detail.searchContent)
      await this.setData({   //关闭正在加载
        isUpLoading:false
       },2000)
      await console.log("3 ",this.data.isUpLoading)
    },
    // 取消搜索，重新加载数据
    async stopSearch(){
      console.log("取消搜索，重新加载数据")
      await this.setData({
        searchContent:"",
        page:0,
        creations:"",
        isTotal:false,
      })
      await this.reLoad();
    },
    // 请求单条创作数据
    async requestACreations(){
      let {data:res}= await wx.p.request({
        url: 'http://43.139.223.241:8083/user/myLiterary',
        data:{
          litId:this.data.litId,
          name:"",
          page:1,
          pageSize:1
        },
        method:'GET',
        header:{
          'token':app.globalData.token
        },
      })
      this.setData({
        "DMSsrcI": res.data.list[0].pictureUrl, //图片数据库存放的地址
        "createTitle":res.data.list[0].title , //用户写作的标题
        "createContent":res.data.list[0].content, //用户写作的内容
      })
      // console.log(this.data.createTitle)
      console.log("请求单条数据成功",res)
    },
    // 请求创作图片
    async requestCrePicture(){
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
      console.log("请求创作图片",res)
      if(this.data.DMSsrcI){
        this.setData({
          pictureUrl :wx.arrayBufferToBase64(res.data)
        })
      }
    },
    // 删除创作功能
    async deleCreationModule(e){
      console.log("删除创作功能")
      await this.deleteCreation(e.detail.litId)
      await this.setData({
        page:1,
        creations:[],
      })
      await this.requestCreations(); //重新请求数据
    },
    // 删除创作函数
    async deleteCreation(litId){
      var res = await wx.p.request({
        url: 'http://43.139.223.241:8083/literary/delete'+litId,
        method:"DELETE",
        header:{
          'token':app.globalData.token
        },
      })
      console.log("删除创作",res)
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
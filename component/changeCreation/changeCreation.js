// component/creation/creation.js
var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    creation:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    creation:{},
    avatarUrl:"",
    pictureUrl:"",
    isLike:true,
    isCollectFlag:true,
    likeNumber:0,
    collectNumber:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async changeLike(){ //改变是否展示点赞
      await this.setData({
        isLike:this.data.isLike
      })
      await this.sendchangedlike(); //上传更改后的点赞 
      await this.requestLike(); //请求是否点赞
      await this.requireLikeAndCollectNumber(); //请求点赞数量
    },
    changePage(){ //进入修改页面
      this.triggerEvent('changePage',
      {
        Pagechange:2,
        litId:this.properties.creation.litId
      })
    },
    deleteCreaion(){ //删除创作
      this.triggerEvent('deleteCreaion',
      {
        litId:this.properties.creation.litId
      })
      console.log("删除")
    },
    async changeCollect(){ //改变是否展示收藏
      await this.setData({
        isCollectFlag:!this.data.isCollectFlag
      })
      await this.sendchangedCollect();  //上传更改后的收藏
      await this.requestCollect(); //请求是否收藏
      await this.requireLikeAndCollectNumber(); //请求收藏数量
    },
    //上传更改后的点赞
    async sendchangedlike(){
      const {data:res}=await wx.p.request({
        url: 'http://43.139.223.241:8083/literary/like/'+this.data.creation.litId,
        method:"PUT",
        data:{
        },
        header:{
          'token':app.globalData.token
        },
      })
      console.log("上传更改后的点赞",res)
    },
    // 请求是否点赞
    async requestLike(){
       const {data:res} = await  wx.p.request({
        url: 'http://43.139.223.241:8083/literary/isLike'+this.data.creation.litId,
        method:"GET",
        data:{
          // litId:
        },
        header:{
          'token':app.globalData.token
        },
      })
      // console.log("请求是否点赞",res)
      this.setData({
        isLike:res.data
      })
    },
    //请求点赞与收藏数量
    async requireLikeAndCollectNumber(){
      const {data:res} = await wx.p.request({
        url: 'http://43.139.223.241:8083/literary/likeNumber/'+this.data.creation.litId,
        method:"GET",
        data:{
          // litId:
        },
        header:{
          'token':app.globalData.token
        },
      })
      // console.log("请求点赞与收藏数量",res)
      this.setData({
        likeNumber:res.data.likeNumber,
        collectNumber:res.data.collectNumber
      })
    },
    //上传更改后的收藏
    async sendchangedCollect(){
      const {data:res}=await wx.p.request({
        url: 'http://43.139.223.241:8083/literary/collect/'+this.data.creation.litId,
        method:"PUT",
        data:{
        },
        header:{
          'token':app.globalData.token
        },
      })
      // console.log("上传更改后的收藏",res)
    },
    // 请求是否收藏
    async requestCollect(){
      const {data:res}=await wx.p.request({
        url: 'http://43.139.223.241:8083/literary/isCollect/'+this.data.creation.litId,
        method:"GET",
        data:{
          // litId:
        },
        header:{
          'token':app.globalData.token
        },
      })
      // console.log("请求是否收藏",res)
      this.setData({
        isCollectFlag:res.data
      })
    },
    // 请求头像图片
    async requestAvaPicture(){
      const res =await wx.p.request({
        url: 'http://43.139.223.241:8083/picture/download',
        method:"GET",
        data:{
          name:this.properties.creation.avatarUrl
        },
        header:{
          'token':app.globalData.token
        },
        responseType: 'arraybuffer',
      })
      // console.log("请求头像图片",res)
      this.setData({
        avatarUrl :wx.arrayBufferToBase64(res.data)
      })
    },
    // 请求创作图片
    async requestCrePicture(){
      const res =await wx.p.request({
        url: 'http://43.139.223.241:8083/picture/download',
        method:"GET",
        data:{
          name:this.properties.creation.pictureUrl
        },
        header:{
          'token':app.globalData.token
        },
        responseType: 'arraybuffer',
      })
      // console.log("请求创作图片",res)
      if(this.properties.creation.pictureUrl){
        this.setData({
          pictureUrl :wx.arrayBufferToBase64(res.data)
        })
      }
    },
  },
  attached(){
    this.requestLike();
    this.requireLikeAndCollectNumber();
    this.requestCollect();
    this.requestAvaPicture();
    this.requestCrePicture();
    this.setData({
      creation:this.properties.creation
    })
    
  }
})

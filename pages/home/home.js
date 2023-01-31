// pages/home/home.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "barChoice":1, //导航栏选择 1--诗词 2--历史 3--故事
    "Pagechange":1 , //主页面切换 1--导航 2--历史文章 3--故事文章
    "scroll_height": 0,
    "h":app.globalData.h,  //胶囊高度
    "s":app.globalData.s,  //状态栏高度
    'n':app.globalData.n, //导航栏高度
    "pageHeight":app.globalData.pageHeight , //滚动页面高度
    "marginTop":0, //页面上外边距

    "searching":false, //已打开搜索框
    "isSearching":false, //正使用API搜索
    "searchContent":"",
    isUpLoading:false ,//上拉触底状态
    "isLoading":false, //下拉状态
    "poetrys":[], //后台返回诗词数据
    "historys":[], //后台返回历史数据
    "storys":[], //后台返回故事数据
    "poetrysTotalNumber":0, //诗歌总数据条数
    "historysTotalNumber":0, //历史总数据条数
    "storysTotalNumber":0, //故事总数据条数
    "poetrysPage":0, //诗歌当前为第几页
    "historysPage":0, //历史当前为第几页
    "storysPage":0, //故事当前为第几页
    "pageSize":1 ,//每页数量
    "poetrysIsTotal":false,  //诗歌已达总数
    "historysIsTotal":false, //历史已达总数
    "storysIsTotal":false,  //故事已达总数
    "article":0 //一篇完整展示文章
  },
  changeBer(e){ //改变导航栏
    this.setData({
      barChoice:e.target.dataset.bar
    })
  },
  changePage(e){//改变主页面
    console.log("改变主页面",e);
    if(e.detail.value){ //返回home
      this.setData({
        Pagechange:1,
        "marginTop":0
     })
    }else{ //跳转文章页面
      this.setData({
        Pagechange:2,
        "marginTop":this.data.s+this.data.n,
        article:e.detail.history
     })
    }

  },
  showSearch(){//改变搜索框
    this.setData({
      searching:true
    })
  },
  async hideSearch(){ //隐藏搜索框 刷新页面
    await this.setData({
      searching:false,
      searchContent:"",
      isSearching:false,

      poetrysPage:1,
      poetrys:[],
      poetrysIsTotal:false,
      historysPage:1,
      historys:[],
      historysIsTotal:false,
      storysPage:1,
      storys:[],
      storysIsTotal:false
    })
    await this.getMorePoetry();
    await this.getMoreHistory();
    await this.getMoreStory();
  },
  inputSearch(e){ //传入输入内容
    this.setData({
      searchContent:e.detail.value
    })
  },
  clearSearchContent(e){ //清空输入内容
    // console.log(e)
    this.setData({
      searchContent:""
    })
  },
  async startSearch(){ //按内容搜索
    if(!this.data.searchContent||this.data.isSearching){ //节流
      console.log("isSearching ",this.data.isSearching)
      return
    }
    await this.setData({
      isSearching:true,
      poetrysPage:1,
      historysPage:1,
      storys:1,
    })
    // 搜索诗词
    var data1={
      keyWord:this.data.searchContent||"",
      page:1,
      type:1,
    }
    var res= await this.getAllArticle(data1);
    console.log("诗歌按内容搜索功能",res)
    await this.setData({
      poetrys:[...res.data.list],
      poetrysTotalNumber:res.data.totalCount,
    })
    await this.setData({
      poetrysIsTotal:this.data.poetrysTotalNumber <this.data.pageSize*this.data.poetrysPage,
    })
    // 搜索历史
    var data2={
      keyWord:this.data.searchContent||"",
      page:1,
      type:2,
    },
    res= await this.getAllArticle(data2);
    console.log("历史按内容搜索功能",res)
    await this.setData({
      historys:[...res.data.list],
      historysTotalNumber:res.data.totalCount,
    })
    await this.setData({
      historysIsTotal:this.data.historysTotalNumber <this.data.pageSize*this.data.historysPage,
    })
    // 搜索故事
    var data3={
      keyWord:this.data.searchContent||"",
      page:1,
      type:3,
    },
    res= await this.getAllArticle(data3);
    console.log("故事按内容搜索功能",res)
    await this.setData({
      storys:[...res.data.list],
      storysTotalNumber:res.data.totalCount,
    })
    await this.setData({
      storysIsTotal:this.data.storysTotalNumber <this.data.pageSize*this.data.storysPage,
    })
  },
  async getMorePoetry(){ // 初始 与 上拉加载 诗歌数据加载功能
    if(this.data.poetrysIsTotal||this.data.isUpLoading){ //节流
      console.log("poetrysIsTotal isUpLoading",this.data.poetrysIsTotal,this.data.isUpLoading)
      return
    }
    await this.setData({
      isUpLoading:true,
      poetrysPage:this.data.poetrysPage+1,
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.poetrysPage,
      type:1,
    }
    var res= await this.getAllArticle(data);
    // console.log("初始与下拉诗歌数据功能",res)
    await this.setData({
      poetrys:[...this.data.poetrys,...res.data.list],
      poetrysTotalNumber:res.data.totalCount,
      isUpLoading:false
    })
    await this.setData({
      poetrysIsTotal:this.data.poetrysTotalNumber <this.data.pageSize*this.data.poetrysPage,
    })
  },
  async refreshPoetry(){ // 刷新诗歌数据功能
    if(this.data.isLoading){ //节流
      console.log("isLoading",this.data.isLoading)
      return
    }
    await this.setData({
      isLoading:true,
      poetrysPage:Math.ceil((Math.random()*this.data.poetrysTotalNumber/this.data.pageSize))
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.poetrysPage,
      type:1,
    }
    var res= await this.getAllArticle(data);
    console.log("刷新诗歌数据功能",res)
    await this.setData({
      poetrys:[...res.data.list],
      poetrysTotalNumber:res.data.totalCount,
      isLoading:false
    })
    await this.setData({
      poetrysIsTotal:this.data.poetrysTotalNumber <this.data.pageSize*this.data.poetrysPage,
    })
  },
  async getMoreHistory(){ // 初始 与 上拉加载 历史数据加载功能
    if(this.data.historysIsTotal||this.data.isUpLoading){ //节流
      console.log("historysIsTotal isUpLoading",this.data.historysIsTotal,this.data.isUpLoading)
      return
    }
    await this.setData({
      isUpLoading:true,
      historysPage:this.data.historysPage+1,
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.historysPage,
      type:2,
    }
    var res= await this.getAllArticle(data);
    // console.log("初始与下拉历史数据加载功能",res)
    await this.setData({
      historys:[...this.data.historys,...res.data.list],
      historysTotalNumber:res.data.totalCount,
      isUpLoading:false
    })
    await this.setData({
      historysIsTotal:this.data.historysTotalNumber <this.data.pageSize*this.data.historysPage,
    })
  },
  async refreshHistory(){ // 刷新历史数据功能
    if(this.data.isLoading){ //节流
      console.log("isLoading",this.data.isLoading)
      return
    }
    await this.setData({
      isLoading:true,
      historysPage:Math.ceil((Math.random()*this.data.historysTotalNumber/2/this.data.pageSize))
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.historysPage,
      type:1,
    }
    var res= await this.getAllArticle(data);
    console.log("刷新历史数据功能",res)
    await this.setData({
      historys:[...res.data.list],
      historysTotalNumber:res.data.totalCount,
      isLoading:false
    })
    await this.setData({
      historysIsTotal:this.data.historysTotalNumber <this.data.pageSize*this.data.historysPage,
    })
  },
  async getMoreStory(){ // 初始 与 上拉加载 故事数据加载功能
    if(this.data.storysIsTotal||this.data.isUpLoading){ //节流
      console.log("storysIsTotal isUpLoading",this.data.storysIsTotal,this.data.isUpLoading)
      return
    }
    await this.setData({
      isUpLoading:true,
      storysPage:this.data.storysPage+1,
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.storysPage,
      type:3,
    }
    var res= await this.getAllArticle(data);
    // console.log("初始与下拉故事数据加载功能",res)
    await this.setData({
      storys:[...this.data.storys,...res.data.list],
      storysTotalNumber:res.data.totalCount,
      isUpLoading:false
    })
    await this.setData({
      storysIsTotal:this.data.storysTotalNumber <this.data.pageSize*this.data.storysPage,
    })
  },
  async refreshStory(){ // 刷新故事数据功能
    if(this.data.isLoading){ //节流
      console.log("isLoading",this.data.isLoading)
      return
    }
    await this.setData({
      isLoading:true,
      storysPage:Math.ceil((Math.random()*this.data.storysTotalNumber/2/this.data.pageSize))
    })
    var data={
      keyWord:this.data.searchContent||"",
      page:this.data.storysPage,
      type:1,
    }
    var res= await this.getAllArticle(data);
    console.log("刷新故事数据功能",res)
    await this.setData({
      storys:[...res.data.list],
      storysTotalNumber:res.data.totalCount,
      isLoading:false
    })
    await this.setData({
      storysIsTotal:this.data.storysTotalNumber <this.data.pageSize*this.data.storysPage,
    })
  },
  async getAllArticle(data){ //请求所有文本数据函数
    var {data:res} =await wx.p.request({
      url: 'http://43.139.223.241:8083/article/getAllArticle',
      data: {
        keyWord:data.keyWord||"",
        page:data.page,
        pageSize:this.data.pageSize,
        type:data.type,
      },
      method: "GET",
    })
    // console.log("请求所有文本数据函数",res)
    return res
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if(!app.globalData.token){
      await app.WXlogin();
    }else{
      console.log("已有token")
    }
    await this.getMorePoetry();
    await this.getMoreHistory();
    await this.getMoreStory();
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 30
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
// component/articleTopBar/articleTopBar.js
var app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    artId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    "isCollectFlag":false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changePage(){
      this.triggerEvent('changePage',{value:1})
    },
    async changeCollect(){ //改变是否展示收藏
      await this.collectArticle();
      await this.isCollectArticle();
    },
    //改变收藏API
    async collectArticle(){
      console.log("文章ID",this.properties.artId)
      var {data:res} = await wx.p.request({
        url: 'http://43.139.223.241:8083/article/collectArticle/'+this.properties.artId,
        header:{
          'token':app.globalData.token,
        },
        method:"PUT",
      })
      console.log("改变收藏API",res)
    },
    //查询收藏API
    async isCollectArticle(){
      var {data:res} = await wx.p.request({
        url: 'http://43.139.223.241:8083/article/isCollectArticle/'+this.properties.artId,
        methods:"GET",
        header:{
          'token':app.globalData.token,
        },
      })
      console.log("查询收藏API",res)
      this.setData({
        isCollectFlag:res.data
      })
    }
  },
  attached(){
    this.isCollectArticle();
  }

  
})

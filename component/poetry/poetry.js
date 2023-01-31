// component/poetry/poetry.js
var app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    poetry:Object
  },
 

  /**
   * 组件的初始数据
   */
  data: {
    "isAppreFlag":false,
    "isCollectFlag":false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeAppre(){ //改变是否展示赏析
      this.setData({
        isAppreFlag:!this.data.isAppreFlag
      })
    },
    async changeCollect(){ //改变是否展示收藏
      await this.collectArticle();
      await this.isCollectArticle();
    },
    //改变收藏API
    async collectArticle(){
      console.log("this.properties.poetry.artId",this.properties.poetry.artId)
      var {data:res} = await wx.p.request({
        url: 'http://43.139.223.241:8083/article/collectArticle/'+this.properties.poetry.artId,
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
        url: 'http://43.139.223.241:8083/article/isCollectArticle/'+this.properties.poetry.artId,
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

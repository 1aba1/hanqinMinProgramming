// app.js
import {createStoreBindings} from "mobx-miniprogram-bindings"
import {store} from "./store/store"
import {promisifyAll} from 'miniprogram-api-promise'
const wxp=wx.p={}
promisifyAll(wx,wxp)
App({
  onLaunch() {
    let that=this
    setInterval(function(){
      wx.login({
        success:(res)=>{
            wx.request({
              url:'http://43.139.223.241:8083/user/wxLogin/'+res.code,
              method:'POST',
              data:{
              },
              success:(e)=>{
                that.globalData.token=e.data.data
                console.log(that.globalData.token)
                wx.setStorage({
                  key:'token',
                  data:that.globalData.token
                })
              }
          })
        }
      })
    },1500000)
    //获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.system = res
      }
    })
    //获取胶囊信息
    this.menu = wx.getMenuButtonBoundingClientRect()
    //打印数据
    // console.log('系统信息', this.system)
    // console.log('胶囊信息', this.menu)
    this.globalData.s= this.system.statusBarHeight //状态栏高度
    this.globalData.n= (this.menu.top - this.system.statusBarHeight) * 2 + this.menu.height, //导航栏高度
    this.globalData.h= this.menu.height //胶囊高度
    this.globalData.tarbarHeight=this.system.screenHeight-this.system.windowHeight
    this.globalData.pageHeight=this.system.screenHeight-this.globalData.tarbarHeight-this.globalData.s-this.globalData.n
 },
  async WXlogin(){
    var code=  await  this.getCode();
    await this.getToken(code);
  },
  // 获取code
  async getCode(){
    var res=  await wx.p.login({})
    await console.log("获取code成功",res)
    return res.code
  },
  // 获取token
  async getToken(code){
    var {data:res} =await wx.p.request({
       url:'http://43.139.223.241:8083/user/wxLogin/'+code,
       method:'POST',
    })
    await console.log("获取token成功",res.data)
    this.globalData.token=res.data
  },
  globalData: {
    token:"",
    s:0, //状态栏高度
    n:0, //导航栏高度
    h:0, //胶囊高度
    tarbarHeight:0,
    pageHeight:0
  },
  onShow(){
    wx.loadFontFace({//加载字体
      global:true,
      family: '古风',
      source: 'url("https://static.heytea.com/taro_trial/v1/font/WenYue-XinQingNianTi-NC-W8_1.otf")',
      success: res => {
        // console.log('font load success11111', res)
      },
      fail: err => {
        // console.log('font load fail11', err)
      },
    })
  },
})

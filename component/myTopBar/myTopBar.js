// component/myTopBar/myTopBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  // options: {
  //   multipleSlots: true // 复数插槽: 是
  // },
  /**
   * 组件的初始数据
   */
  data: {
    "searching":false, //正在搜索
    "searchContent":""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showSearch(){//改变搜索框
      this.setData({
        searching:true
      })
    },
    hideSearch(){//隐藏搜索框
      // console.log("11searching:false");
      this.clearSearchContent();
      this.triggerEvent("stopSearch");
      this.setData({
        searching:false
      })
    },
    backToMe(){ //返回主页面
      wx.navigateBack();
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
    startSearch(){ //组件输出搜索内容
      // console.log("组件startSearch")
      this.triggerEvent("searchCreation",{searchContent:this.data.searchContent})
    }
  }
})

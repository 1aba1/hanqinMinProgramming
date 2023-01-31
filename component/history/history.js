// component/history/history.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    history:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changePage(){
      this.triggerEvent('changePage',{Pagechange:2,history:this.properties.history})
    }
  }
})

// 创建store对象
import {observable,action} from "mobx-miniprogram"

export  const store =observable({
  token:"hhh",
  numA:111,
  numB:2,
  // 计算属性 get修饰符只读
  get sum(){
    return this.numA+this.numB
  },
  // action 方法，修改store数据
  updateToken:action(
    function(token){
      this.token=token
    }
  ),
  updateNum1:action(
    function(step){
      this.numA+=step
    }
  ),
  updateNum2:action(
    function(step){
      this.numB+=step
    }
  )
})
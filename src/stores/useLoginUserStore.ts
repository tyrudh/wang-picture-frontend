import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

//存储登陆信息的状态
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser: Ref<any, any> = ref<any>({
    userName: '未登录',
  })

  //获取远程用户登录信息的
  async function fetchLoginUser() {
    //假登录
    setTimeout( () => {
      loginUser.value = {userName: "测试登录", id: 1};
    },3000)
  }

  //设置登录用户
  function setLoginUser(newloginUser: any) {
    loginUser.value = newloginUser
  }



  //返回
  return { loginUser, fetchLoginUser, setLoginUser }
})

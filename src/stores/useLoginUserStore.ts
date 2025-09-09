import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/userController.ts'

//存储登陆信息的状态
export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVo>({
    userName: '未登录',
  })

  //获取远程用户登录信息的
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data
    }
  }

  //设置登录用户
  function setLoginUser(newloginUser: any) {
    loginUser.value = newloginUser
  }



  //返回
  return { loginUser, fetchLoginUser, setLoginUser }
})

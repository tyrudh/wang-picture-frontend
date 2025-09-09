import router from '@/router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
//是否为首次用户登录
let firstFetchLoginUser = true

/*全局权限校验
* */

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore();
  let loginUser = loginUserStore.loginUser;
  //确保

  if (firstFetchLoginUser){

    await loginUserStore.fetchLoginUser();
    loginUser = loginUserStore.loginUser;
    firstFetchLoginUser = false;
  }

  const toUrl = to.path;

  if (toUrl.startsWith('/admin')) {
    if(!loginUser || loginUser.userRole !== "admin"){
      message.error("您没有权限");
      next(`/user/login?redirect=${to.fullPath}`);
      return
    }
    // 登录验证
  }
  next();
})

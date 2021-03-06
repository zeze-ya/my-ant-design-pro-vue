import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from "@/utils/util"

NProgress.configure({ showSpinner: true })

const whiteList = ['/user/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({ path: '/dashboard/Analysis' })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
          const menuData = res.data.menu;
          if (menuData === null || menuData === "" || menuData === undefined) {
            return;
          }

          let constRoutes = [];
          constRoutes = generateIndexRouter(menuData);
          // 添加主界面路由
          store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
            // 根据roles权限生成可访问的路由表
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            const redirect = decodeURIComponent(from.query.redirect || to.path)
            if (to.path === redirect) {
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
        }).catch(() => {
            console.log('请求用户信息失败，请重试！！！')
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

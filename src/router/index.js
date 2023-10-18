import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/info',
    component: Layout,
    children: [
      {
        path: 'info',
        name: 'Form',
        component: () => import('@/views/Info.vue'),
        meta: { title: 'U 本位数据', icon: 'tree' }
      }
    ]
  },


  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/Form.vue'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: 'binance-link',
    component: Layout,
    children: [
      {
        path: 'https://www.binancezh.top/zh-CN/futures/BTCUSDT',
        meta: { title: '币安合约', icon: 'binance' }
      }
    ]
  },

  {
    path: '/doc',
    component: Layout,
    name: 'Doc',
    meta: { title: '文档', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'https://binance-docs.github.io/apidocs/futures/cn/#185368440e',
        meta: { title: 'U本位文档', icon: 'binance' }
      },
      {
        path: 'https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/style.html',
        meta: { title: '前端文档', icon: 'form' }
      },
      {
        path: 'https://element.eleme.cn/#/zh-CN/component/layout',
        meta: { title: '饿了么文档', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

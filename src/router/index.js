/**
 * 路由配置
 * 统一管理应用路由及导航守卫
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ==================== 常量定义 ====================

/**
 * 无需登录的页面路径
 */
const PUBLIC_PAGES = [
  '/login',
  '/register',
  '/forget-password',
  '/'
]

// ==================== 路由配置 ====================

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomePage.vue'),
      meta: { requiresAuth: false, title: '首页' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false, title: '登录' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false, title: '注册' }
    },
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      component: () => import('@/views/ForgetPassword.vue'),
      meta: { requiresAuth: false, title: '找回密码' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true, title: '控制台' },
      redirect: '/dashboard/overview',
      children: [
        {
          path: 'overview',
          name: 'Overview',
          component: () => import('@/views/Overview.vue'),
          meta: { title: '商户主页' }
        },
        {
          path: 'site-manage',
          name: 'SiteManage',
          component: () => import('@/views/SiteManage.vue'),
          meta: { title: '站点管理' }
        },
        {
          path: 'revenue',
          name: 'Revenue',
          component: () => import('@/views/Revenue.vue'),
          meta: { title: '营收明细' }
        },
        {
          path: 'distribution',
          name: 'Distribution',
          component: () => import('@/views/Distribution.vue'),
          meta: { title: '分销明细' }
        },
        {
          path: 'site-setup',
          name: 'SiteSetup',
          component: () => import('@/views/SiteSetup.vue'),
          meta: { title: '站点设置', requiresSetup: true }
        }
      ]
    }
  ]
})

// ==================== 路由守卫 ====================

let authInitialized = false

/**
 * 检查站点设置是否有效（异步）
 * @param {Object} authStore - 认证 store 实例
 * @returns {Promise<boolean>} 是否已完成站点设置
 */
async function checkSiteSetup(authStore) {
  // 如果 siteSetup 为 null，需要从接口检查
  if (authStore.siteSetup === null) {
    try {
      const siteApi = await import('@/api/site')
      const res = await siteApi.getSiteConfigList({ pageSize: 1, current: 1 })
      const responseData = res.data || res
      const list = responseData.list || []

      if (list.length > 0) {
        const configItem = list[0]
        authStore.completeSetup({
          merchantId: configItem.merchantId,
          siteNameEn: configItem.siteNameEn,
          siteNameCn: configItem.siteNameCn || '',
          siteUrl: configItem.siteUrl,
          memberPrice: configItem.minPriceUsd
        })
        return true
      } else {
        // 没有站点设置，确保 siteSetup 为 null
        authStore.siteSetup = null
        localStorage.removeItem('siteSetup')
        return false
      }
    } catch (error) {
      console.error('检查站点设置失败:', error)
      return false
    }
  }
  return authStore.hasCompletedSetup
}

/**
 * 全局前置路由守卫
 * - 检查登录状态
 * - 检查站点设置状态
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 初始化 auth 状态（只执行一次）
  if (!authInitialized) {
    const hasToken = localStorage.getItem('token')
    const hasAuth = authStore.restoreAuth()
    authInitialized = true

    // 如果有 token，获取用户信息并检查站点设置
    if (hasAuth) {
      try {
        await authStore.fetchUserInfo()
      } catch (e) {
        console.log('获取用户信息失败')
      }
      // 检查站点设置状态
      await checkSiteSetup(authStore)
    }
  }

  const isAuthenticated = authStore.isAuthenticated
  const hasCompletedSetup = authStore.hasCompletedSetup

  // 检查是否需要登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // 检查是否已完成站点设置（除了站点设置页面本身）
  if (to.meta.requiresAuth && to.name !== 'SiteSetup' && !hasCompletedSetup) {
    next('/dashboard/site-setup')
    return
  }

  // 已登录且已完成设置的用户访问站点设置页面，重定向到首页
  if (to.name === 'SiteSetup' && isAuthenticated && hasCompletedSetup) {
    next('/dashboard/overview')
    return
  }

  // 已登录用户访问登录/注册页面，重定向到控制台
  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard/overview')
    return
  }

  next()
})

// ==================== 导出 ====================

export default router

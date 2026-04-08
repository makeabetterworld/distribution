/**
 * 用户认证 Store
 * 管理用户登录状态、token、站点设置等信息
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo as getUserInfoApi } from '@/api/auth'

// ==================== 常量定义 ====================

const STORAGE_KEY = {
  USER: 'user',
  TOKEN: 'token',
  TOKEN_EXPIRE: 'tokenExpireTime',
  SITE_SETUP: 'siteSetup'
}

// ==================== Store 定义 ====================

export const useAuthStore = defineStore('auth', () => {
  // ==================== 状态 ====================

  const user = ref(JSON.parse(localStorage.getItem(STORAGE_KEY.USER) || 'null'))
  const token = ref(localStorage.getItem(STORAGE_KEY.TOKEN) || '')
  const tokenExpireTime = ref(Number(localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRE) || '0'))
  const siteSetup = ref(JSON.parse(localStorage.getItem(STORAGE_KEY.SITE_SETUP) || 'null'))

  // ==================== 计算属性 ====================

  /**
   * 是否已认证
   */
  const isAuthenticated = computed(() => !!token.value)

  /**
   * 是否已完成站点设置
   */
  const hasCompletedSetup = computed(() => !!siteSetup.value)

  /**
   * token 是否已过期
   */
  const isTokenExpired = computed(() => {
    if (!tokenExpireTime.value) return false // 没有过期时间，认为永不过期
    return Date.now() >= tokenExpireTime.value
  })

  // ==================== 方法 ====================

  /**
   * 登录并保存用户信息
   * @param {Object} userData - 用户数据
   * @param {string} userData.token - token
   * @param {number} userData.tokenExpireTime - token 过期时间戳
   */
  function login(userData) {
    // 清除旧的站点设置缓存，避免使用上一个用户的状态
    siteSetup.value = null
    localStorage.removeItem(STORAGE_KEY.SITE_SETUP)

    const tokenValue = userData.token || ''
    const expireTime = userData.tokenExpireTime || 0

    token.value = tokenValue
    tokenExpireTime.value = expireTime

    // 先保存 localStorage
    if (tokenValue) {
      localStorage.setItem(STORAGE_KEY.TOKEN, tokenValue)
    }
    if (expireTime) {
      localStorage.setItem(STORAGE_KEY.TOKEN_EXPIRE, String(expireTime))
    }

    // 保存用户数据（确保至少有 token 信息）
    const userDataToSave = {
      token: tokenValue,
      tokenExpireTime: expireTime,
      ...userData
    }
    user.value = userDataToSave
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(userDataToSave))
  }

  /**
   * 从 localStorage 恢复登录状态
   * @returns {boolean} 是否恢复成功
   */
  function restoreAuth() {
    const savedToken = localStorage.getItem(STORAGE_KEY.TOKEN)
    const savedUser = localStorage.getItem(STORAGE_KEY.USER)
    const savedExpireTime = localStorage.getItem(STORAGE_KEY.TOKEN_EXPIRE)
    const savedSiteSetup = localStorage.getItem(STORAGE_KEY.SITE_SETUP)

    // 只要有 token 就认为已登录
    if (savedToken) {
      // 检查 token 是否过期
      const expireTime = savedExpireTime ? Number(savedExpireTime) : 0
      if (expireTime && Date.now() >= expireTime) {
        // token 已过期，清除
        logout()
        return false
      }

      // 直接修改 ref 值
      token.value = savedToken
      tokenExpireTime.value = expireTime

      // 恢复站点设置状态（用于页面刷新时保持状态）
      if (savedSiteSetup) {
        try {
          siteSetup.value = JSON.parse(savedSiteSetup)
        } catch (e) {
          console.error('解析站点设置失败:', e)
          siteSetup.value = null
        }
      } else {
        siteSetup.value = null
      }

      // 恢复用户数据
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
        } catch (e) {
          console.error('解析用户数据失败:', e)
          user.value = { token: savedToken }
        }
      } else {
        user.value = { token: savedToken }
      }

      return true
    }

    return false
  }

  /**
   * 获取用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async function fetchUserInfo() {
    try {
      const res = await getUserInfoApi()
      // 后端返回格式：{ code: 0, data: { id, username, email, isVip } }
      const userData = res.data || res

      if (userData) {
        // 合并现有用户数据和 token 信息
        user.value = {
          ...user.value,
          ...userData
        }
        localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user.value))
        return userData
      }
      return null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    user.value = null
    token.value = ''
    tokenExpireTime.value = 0
    siteSetup.value = null
    localStorage.removeItem(STORAGE_KEY.USER)
    localStorage.removeItem(STORAGE_KEY.TOKEN)
    localStorage.removeItem(STORAGE_KEY.TOKEN_EXPIRE)
    localStorage.removeItem(STORAGE_KEY.SITE_SETUP)
  }

  /**
   * 完成站点设置
   * @param {Object} siteData - 站点数据
   */
  function completeSetup(siteData) {
    siteSetup.value = siteData
    localStorage.setItem(STORAGE_KEY.SITE_SETUP, JSON.stringify(siteData))
  }

  /**
   * 更新站点设置
   * @param {Object} siteData - 站点数据
   */
  function updateSiteSetup(siteData) {
    siteSetup.value = { ...siteSetup.value, ...siteData }
    localStorage.setItem(STORAGE_KEY.SITE_SETUP, JSON.stringify(siteSetup.value))
  }

  // ==================== 导出 ====================

  return {
    user,
    token,
    tokenExpireTime,
    siteSetup,
    isAuthenticated,
    hasCompletedSetup,
    isTokenExpired,
    login,
    logout,
    restoreAuth,
    fetchUserInfo,
    completeSetup,
    updateSiteSetup
  }
})

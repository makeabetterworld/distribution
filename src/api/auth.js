/**
 * 认证 API 模块
 * 负责用户登录、注册、验证码等相关接口
 */

import request from '@/utils/request'
import { http } from '@/utils/request'

// ==================== 常量定义 ====================

const API = {
  CAPTCHA: '/captcha',
  LOGIN: '/login',
  REGISTER: '/front/user/reg',
  USER_INFO: '/sys/user/info',
  SECURITY_QUESTIONS: '/front/question/list',
  USER_QUESTIONS: '/front/user/question',
  RESET_PASSWORD: '/front/password/question/reset',
  LOGOUT: '/logout'
}

// ==================== API 方法 ====================

/**
 * 获取验证码
 * @param {string} uuid - 唯一标识
 * @returns {Promise<Blob>} 验证码图片 blob
 */
export const getCaptcha = (uuid) => {
  return request.get(API.CAPTCHA, {
    params: { uuid },
    responseType: 'blob'
  })
}

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.captcha - 验证码
 * @param {string} data.uuid - 唯一标识
 * @returns {Promise} 登录响应
 */
export const login = (data) => {
  return http.post(API.LOGIN, data)
}

/**
 * 用户注册
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.voucherCode - 注册码
 * @returns {Promise} 注册响应
 */
export const register = (data) => {
  return http.post(API.REGISTER, data)
}

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
  return http.get(API.USER_INFO, {
    params: { _t: Date.now() }
  })
}

/**
 * 获取密保问题列表
 * @returns {Promise} 密保问题列表
 */
export const getSecurityQuestions = () => {
  return http.get(API.SECURITY_QUESTIONS)
}

/**
 * 根据邮箱获取用户的密保问题
 * @param {string} email - 用户邮箱
 * @returns {Promise} 密保问题列表
 */
export const getUserQuestions = (email) => {
  return http.get(API.USER_QUESTIONS, { data: { email } })
}

/**
 * 通过密保问题重置密码
 * @param {Object} data - 重置密码数据
 * @param {string} data.email - 邮箱
 * @param {number} data.questionId - 问题 ID
 * @param {string} data.answer - 答案
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 重置结果
 */
export const resetPasswordByQuestion = (data) => {
  return http.post(API.RESET_PASSWORD, data)
}

/**
 * 退出登录
 * @returns {Promise} 退出结果
 */
export const logout = () => {
  return http.post(API.LOGOUT)
}

// ==================== 导出 ====================

export default {
  getCaptcha,
  login,
  register,
  getUserInfo,
  logout,
  getSecurityQuestions,
  getUserQuestions,
  resetPasswordByQuestion
}

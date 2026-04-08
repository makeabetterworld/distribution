/**
 * API 请求工具
 * 基于 axios 封装，统一处理请求响应
 */

import axios from 'axios'
import { config, log, getApiUrl } from '@/config'
import { message } from 'ant-design-vue'

// ==================== 常量定义 ====================

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

const ERROR_MESSAGE = {
  [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
  [HTTP_STATUS.UNAUTHORIZED]: '未授权，请重新登录',
  [HTTP_STATUS.FORBIDDEN]: '拒绝访问',
  [HTTP_STATUS.NOT_FOUND]: '请求资源不存在',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [HTTP_STATUS.BAD_GATEWAY]: '网关错误',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务不可用',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: '网关超时'
}

const DEFAULT_TIMEOUT = 30000
const CONTENT_TYPE_JSON = 'application/json'
const CONTENT_TYPE_MULTIPART = 'multipart/form-data'

// ==================== 创建实例 ====================

/**
 * 创建 axios 实例
 */
const request = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': CONTENT_TYPE_JSON
  }
})

// ==================== 请求拦截器 ====================

/**
 * 请求拦截器
 * - 添加 token
 * - 添加请求时间戳（开发环境）
 * - 处理验证码请求
 */
request.interceptors.request.use(
  (config) => {
    log.debug('请求配置:', config)

    // 添加 token
    const token = localStorage.getItem('token')
    log.debug('当前 token:', token ? token.substring(0, 10) + '...' : 'null')
    if (token) {
      config.headers.set('token', token)
    }

    // 添加请求时间戳（开发环境）
    if (config.isDevelopment) {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 如果是获取验证码，确保 responseType 为 blob
    if (config.url?.includes('/captcha')) {
      log.debug('验证码请求，设置 responseType 为 blob')
      config.responseType = 'blob'
    }

    return config
  },
  (error) => {
    log.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================

/**
 * 响应拦截器
 * - 处理 blob 类型响应
 * - 统一处理业务状态码
 * - 处理 HTTP 错误状态
 */
request.interceptors.response.use(
  (response) => {
    const { data, status, config, headers } = response

    // 如果是图片类型（验证码），直接返回 blob
    if (config.responseType === 'blob' || headers['content-type']?.startsWith('image/')) {
      return data
    }

    // 根据业务状态码处理（项目返回结构：code=0 表示成功）
    if (data?.code === 0) {
      return data
    } else if (data?.code === HTTP_STATUS.UNAUTHORIZED) {
      // 未授权，跳转登录
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error('未授权'))
    } else {
      message.error(data?.msg || '请求失败')
      return Promise.reject(new Error(data?.msg || '请求失败'))
    }
  },
  (error) => {
    log.error('响应异常:', error)

    const { response } = error
    let errorMsg = '网络异常，请稍后重试'

    if (response) {
      // 根据 HTTP 状态码设置错误消息
      errorMsg = ERROR_MESSAGE[response.status] || `连接错误 ${response.status}`

      // 未授权需要清除本地 token
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } else if (error.message.includes('timeout')) {
      errorMsg = '请求超时，请稍后重试'
    } else if (error.message.includes('Network')) {
      errorMsg = '网络连接失败，请检查网络'
    }

    message.error(errorMsg)
    return Promise.reject(error)
  }
)

// ==================== 封装 HTTP 方法 ====================

/**
 * HTTP 请求方法封装
 */
export const http = {
  /**
   * GET 请求
   * @param {string} url - 请求地址
   * @param {Object} [params] - 查询参数
   * @param {Object} [config] - 其他配置
   */
  get: (url, params, config = {}) => request.get(url, { params, ...config }),

  /**
   * POST 请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求体数据
   * @param {Object} [config] - 其他配置
   */
  post: (url, data, config = {}) => request.post(url, data, config),

  /**
   * PUT 请求
   * @param {string} url - 请求地址
   * @param {Object} [data] - 请求体数据
   * @param {Object} [config] - 其他配置
   */
  put: (url, data, config = {}) => request.put(url, data, config),

  /**
   * DELETE 请求
   * @param {string} url - 请求地址
   * @param {Object} [config] - 其他配置
   */
  delete: (url, config = {}) => request.delete(url, config),

  /**
   * 上传文件
   * @param {string} url - 请求地址
   * @param {FormData} formData - 表单数据
   */
  upload: (url, formData) =>
    request.post(url, formData, {
      headers: {
        'Content-Type': CONTENT_TYPE_MULTIPART
      }
    })
}

// ==================== 导出 ====================

/**
 * 获取 Mock 开关
 * @returns {boolean} 是否启用 Mock
 */
export const useMock = () => config.enableMock

export default request

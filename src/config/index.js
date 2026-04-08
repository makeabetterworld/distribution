/**
 * 应用配置工具
 * 统一管理开发环境和生产环境的配置
 */

// ==================== 配置对象 ====================

const config = {
  // API 基础 URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',

  // 是否启用 Mock 数据
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',

  // 应用标题
  appTitle: import.meta.env.VITE_APP_TITLE || '分销系统',

  // 版本号
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // 日志级别
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',

  // 是否使用 CDN
  useCdn: import.meta.env.VITE_USE_CDN === 'true',

  // 资源公共路径
  base: import.meta.env.VITE_BASE || '/',

  // 当前环境
  env: import.meta.env.MODE || 'development',

  // 是否为生产环境
  isProduction: import.meta.env.MODE === 'production',

  // 是否为开发环境
  isDevelopment: import.meta.env.MODE === 'development',

  // 站点域名配置
  siteDomain: import.meta.env.VITE_SITE_DOMAIN || '502502001.xyz'
}

// ==================== 日志工具 ====================

/**
 * 日志工具
 * 根据配置的日志级别输出相应级别的日志
 */
const log = {
  /**
   * Debug 级别日志
   * 仅在开发环境且日志级别为 debug 时输出
   */
  debug: (...args) => {
    if (config.logLevel === 'debug' && config.isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },

  /**
   * Info 级别日志
   * 在日志级别为 debug 或 info 时输出
   */
  info: (...args) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      console.log('[INFO]', ...args)
    }
  },

  /**
   * Warn 级别日志
   * 在非生产环境或日志级别不为 error 时输出
   */
  warn: (...args) => {
    if (!config.isProduction || config.logLevel !== 'error') {
      console.warn('[WARN]', ...args)
    }
  },

  /**
   * Error 级别日志
   * 始终输出
   */
  error: (...args) => {
    console.error('[ERROR]', ...args)
  }
}

// ==================== 工具方法 ====================

/**
 * 获取 API 完整 URL
 * @param {string} path - API 路径
 * @returns {string} 完整 URL
 */
const getApiUrl = (path) => {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return `${baseUrl}/${cleanPath}`
}

// ==================== 导出 ====================

export { config, log, getApiUrl }
export default config

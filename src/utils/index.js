/**
 * 工具函数模块
 * 提供通用工具方法
 */

// ==================== UUID 生成 ====================

/**
 * 生成 UUID v4
 * @returns {string} UUID 字符串（格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx）
 */
export const generateUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ==================== 导出 ====================

export default {
  generateUuid
}

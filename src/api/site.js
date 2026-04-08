/**
 * 站点设置 API 模块
 * 负责站点配置、提现设置、商户信息等接口
 */

import { http } from '@/utils/request'

// ==================== 常量定义 ====================

const API = {
  SITE_CONFIG: '/merchant/site-config',
  WITHDRAW_SETTING: '/merchant/withdraw-setting',
  WITHDRAW_REQUEST: '/hub/merchantwithdrawrequest',
  HUB_CONFIG: '/hub/merchantsiteconfig',
  MERCHANT_INFO: '/hub/merchantinfo',
  ANNOUNCEMENT: '/hub/merchantannouncement',
  REVENUE: '/hub/merchantrevenuedetail',
  DISTRIBUTION: '/hub/merchantdistributiondetail'
}

// ==================== 提现相关 ====================

/**
 * 提交提现申请
 * @param {Object} data - 提现申请数据
 * @param {string} data.requestNo - 请求编号
 * @param {number} data.amount - 提现金额
 * @returns {Promise} 提现结果
 */
export const submitWithdraw = (data) => {
  return http.post(`${API.WITHDRAW_REQUEST}/submit`, data)
}

// ==================== 商户信息相关 ====================

/**
 * 获取用户商户信息（资产信息）
 * @returns {Promise} 商户资产信息
 */
export const getMerchantUserInfo = () => {
  return http.get(`${API.MERCHANT_INFO}/user/info`)
}

/**
 * 获取用户站点配置（商户端）
 * @returns {Promise} 站点配置信息
 */
export const getUserSiteConfig = () => {
  return http.get(`${API.HUB_CONFIG}/user/config`)
}

// ==================== 站点配置相关 ====================

/**
 * 获取站点配置列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 站点配置列表
 */
export const getSiteConfigList = (params) => {
  return http.get(`${API.SITE_CONFIG}/list`, params)
}

/**
 * 获取站点配置详情
 * @param {number} id - 主键 ID
 * @returns {Promise} 站点配置详情
 */
export const getSiteConfigDetail = (id) => {
  return http.get(`${API.SITE_CONFIG}/${id}`)
}

/**
 * 新增站点配置
 * @param {Object} data - 站点配置信息
 * @returns {Promise} 新增结果
 */
export const addSiteConfig = (data) => {
  return http.post(API.SITE_CONFIG, data)
}

/**
 * 修改站点配置
 * @param {Object} data - 站点配置信息（需包含 id）
 * @returns {Promise} 修改结果
 */
export const updateSiteConfig = (data) => {
  return http.put(API.SITE_CONFIG, data)
}

/**
 * 删除站点配置
 * @param {number} id - 主键 ID
 * @returns {Promise} 删除结果
 */
export const deleteSiteConfig = (id) => {
  return http.delete(`${API.SITE_CONFIG}/${id}`)
}

// ==================== 提现设置相关 ====================

/**
 * 获取提现设置
 * @param {number} [merchantId] - 商户 ID（可选）
 * @returns {Promise} 提现设置信息
 */
export const getWithdrawSetting = (merchantId) => {
  return http.get(`${API.WITHDRAW_SETTING}/get`, { merchantId })
}

/**
 * 新增提现设置
 * @param {Object} data - 提现设置信息
 * @returns {Promise} 新增结果
 */
export const addWithdrawSetting = (data) => {
  return http.post(API.WITHDRAW_SETTING, data)
}

/**
 * 修改提现设置
 * @param {Object} data - 提现设置信息（需包含 id）
 * @returns {Promise} 修改结果
 */
export const updateWithdrawSetting = (data) => {
  return http.put(API.WITHDRAW_SETTING, data)
}

/**
 * 删除提现设置
 * @param {number} id - 主键 ID
 * @returns {Promise} 删除结果
 */
export const deleteWithdrawSetting = (id) => {
  return http.delete(`${API.WITHDRAW_SETTING}/${id}`)
}

// ==================== 商户公告相关 ====================

/**
 * 获取商户公告列表（分页）
 * @param {Object} params - 分页参数
 * @returns {Promise} 公告列表
 */
export const getMerchantAnnouncements = (params) => {
  return http.get(`${API.ANNOUNCEMENT}/page`, params)
}

// ==================== 提现记录相关 ====================

/**
 * 获取商户提现申请记录列表（分页）
 * @param {Object} params - 分页参数
 * @returns {Promise} 提现记录列表
 */
export const getWithdrawRequests = (params) => {
  return http.get(`${API.WITHDRAW_REQUEST}/page`, params)
}

// ==================== 营收明细相关 ====================

/**
 * 获取商户营收明细列表（分页）
 * @param {Object} params - 分页参数
 * @returns {Promise} 营收明细列表
 */
export const getRevenueDetails = (params) => {
  return http.get(`${API.REVENUE}/user/page`, params)
}

// ==================== 分销明细相关 ====================

/**
 * 获取商户分销明细列表（分页）
 * @param {Object} params - 分页参数
 * @returns {Promise} 分销明细列表
 */
export const getDistributionDetails = (params) => {
  return http.get(`${API.DISTRIBUTION}/user/page`, params)
}

// ==================== 导出 ====================

export default {
  submitWithdraw,
  getMerchantUserInfo,
  getUserSiteConfig,
  getSiteConfigList,
  getSiteConfigDetail,
  addSiteConfig,
  updateSiteConfig,
  deleteSiteConfig,
  getWithdrawSetting,
  addWithdrawSetting,
  updateWithdrawSetting,
  deleteWithdrawSetting,
  getMerchantAnnouncements,
  getWithdrawRequests,
  getRevenueDetails,
  getDistributionDetails
}

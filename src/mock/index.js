/**
 * Mock 数据配置
 * 基于 mockjs 模拟后端接口数据
 */

import Mock from 'mockjs'

// ==================== 常量定义 ====================

const RESPONSE_SUCCESS = { code: 0 }
const RESPONSE_UNAUTHORIZED = { code: 401, msg: '未授权' }

// ==================== 认证相关 ====================

/**
 * 获取验证码
 */
Mock.mock(/\/captcha/, 'get', () => {
  // 生成随机验证码图片（实际项目中应该返回真实验证码图片）
  return new Blob(['mock-captcha-image'], { type: 'image/gif' })
})

/**
 * 用户登录
 */
Mock.mock(/\/login/, 'post', (options) => {
  const data = JSON.parse(options.body)
  if (data.username && data.password) {
    return {
      code: 0,
      msg: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        expire: 315360000 // 10 年
      }
    }
  }
  return { code: 1, msg: '账号或密码错误' }
})

/**
 * 用户注册
 */
Mock.mock(/\/front\/user\/reg/, 'post', () => {
  return {
    code: 0,
    msg: '注册成功',
    data: null
  }
})

/**
 * 获取用户信息
 */
Mock.mock(/\/sys\/user\/info/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      id: Mock.Random.guid(),
      username: Mock.Random.cname(),
      email: Mock.Random.email(),
      isVip: true
    }
  }
})

/**
 * 获取密保问题列表
 */
Mock.mock(/\/front\/question\/list/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: [
      { id: 1, question: '您的小学名称是什么？' },
      { id: 2, question: '您最喜欢的颜色是什么？' },
      { id: 3, question: '您的生日是哪一天？' }
    ]
  }
})

/**
 * 根据邮箱获取用户的密保问题
 */
Mock.mock(/\/front\/user\/question/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: [
      { id: 1, question: '您的小学名称是什么？' },
      { id: 2, question: '您最喜欢的颜色是什么？' }
    ]
  }
})

/**
 * 通过密保问题重置密码
 */
Mock.mock(/\/front\/password\/question\/reset/, 'post', () => {
  return {
    code: 0,
    msg: '密码重置成功',
    data: null
  }
})

/**
 * 退出登录
 */
Mock.mock(/\/logout/, 'post', () => {
  return {
    code: 0,
    msg: '退出成功',
    data: null
  }
})

// ==================== 商户资产相关 ====================

/**
 * 获取商户资产信息
 */
Mock.mock(/\/hub\/merchantinfo\/user\/info/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      merchantId: 'M' + Mock.Random.guid(),
      availableBalance: Mock.Random.float(10, 100, 2, 2),
      frozenBalance: Mock.Random.float(0, 20, 2, 2),
      totalBalance: Mock.Random.float(50, 150, 2, 2),
      turnover30d: Mock.Random.float(20, 80, 2, 2),
      distributionAmount30d: Mock.Random.float(2, 10, 2, 2),
      commissionRate: 0.6,
      parentCommission: 0.06,
      grandfatherCommission: 0.04
    }
  }
})

// ==================== 站点配置相关 ====================

/**
 * 获取用户站点配置
 */
Mock.mock(/\/hub\/merchantsiteconfig\/user\/config/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      merchantId: 'M' + Mock.Random.guid(),
      siteNameEn: 'myshop',
      siteNameCn: '我的店铺',
      siteUrl: 'myshop.' + Mock.Random.domain(),
      minPriceUsd: 19.99,
      isActive: 1
    }
  }
})

/**
 * 获取站点配置列表
 */
Mock.mock(/\/merchant\/site-config\/list/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      list: [
        {
          id: 1,
          merchantId: 'M' + Mock.Random.guid(),
          siteNameEn: 'myshop',
          siteNameCn: '我的店铺',
          siteUrl: 'myshop.502502001.xyz',
          minPriceUsd: 19.99,
          isActive: 1,
          createDate: Mock.Random.date()
        }
      ],
      total: 1
    }
  }
})

/**
 * 新增站点配置
 */
Mock.mock(/\/merchant\/site-config/, 'post', () => {
  return {
    code: 0,
    msg: '新增成功',
    data: Mock.Random.id()
  }
})

/**
 * 修改站点配置
 */
Mock.mock(/\/merchant\/site-config/, 'put', () => {
  return {
    code: 0,
    msg: '修改成功',
    data: null
  }
})

/**
 * 删除站点配置
 */
Mock.mock(/\/merchant\/site-config\/\d+/, 'delete', () => {
  return {
    code: 0,
    msg: '删除成功',
    data: null
  }
})

// ==================== 提现设置相关 ====================

/**
 * 获取提现设置
 */
Mock.mock(/\/merchant\/withdraw-setting\/get/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      id: 1,
      alipayPhone: '138****8888',
      firstNamePinyin: 'San',
      lastNamePinyin: 'Zhang',
      remark: '测试账户'
    }
  }
})

/**
 * 新增提现设置
 */
Mock.mock(/\/merchant\/withdraw-setting/, 'post', () => {
  return {
    code: 0,
    msg: '新增成功',
    data: 1
  }
})

/**
 * 修改提现设置
 */
Mock.mock(/\/merchant\/withdraw-setting/, 'put', () => {
  return {
    code: 0,
    msg: '修改成功',
    data: null
  }
})

/**
 * 删除提现设置
 */
Mock.mock(/\/merchant\/withdraw-setting\/\d+/, 'delete', () => {
  return {
    code: 0,
    msg: '删除成功',
    data: null
  }
})

// ==================== 提现申请相关 ====================

/**
 * 提交提现申请
 */
Mock.mock(/\/hub\/merchantwithdrawrequest\/submit/, 'post', () => {
  return {
    code: 0,
    msg: '提现申请已提交',
    data: {
      requestNo: 'WR' + Date.now()
    }
  }
})

/**
 * 获取提现申请记录列表
 */
Mock.mock(/\/hub\/merchantwithdrawrequest\/page/, 'get', () => {
  const list = []
  const statuses = [1, 2, 3, 4, 5]
  const statusNames = { 1: '待审核', 2: '打款中', 3: '打款成功', 4: '打款失败', 5: '审核拒绝' }

  for (let i = 0; i < 10; i++) {
    list.push({
      id: i + 1,
      amount: Mock.Random.float(30, 200, 2, 2),
      status: statuses[Mock.Random.integer(0, 4)],
      statusName: statusNames[statuses[Mock.Random.integer(0, 4)]],
      alipayAccountSnapshot: '138****8888',
      createDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    })
  }

  return {
    code: 0,
    msg: '获取成功',
    data: {
      list,
      total: list.length
    }
  }
})

// ==================== 商户公告相关 ====================

/**
 * 获取商户公告列表
 */
Mock.mock(/\/hub\/merchantannouncement\/page/, 'get', () => {
  return {
    code: 0,
    msg: '获取成功',
    data: {
      list: [
        {
          id: 1,
          title: '系统维护通知',
          content: '本周六凌晨 2 点进行系统维护，届时可能影响部分功能使用',
          createDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
        },
        {
          id: 2,
          title: '新功能上线',
          content: '三级分销功能已上线，快来体验吧！',
          createDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
        },
        {
          id: 3,
          title: '提现规则更新',
          content: '最低提现金额调整为 30USD',
          createDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
        }
      ],
      total: 3
    }
  }
})

// ==================== 营收明细相关 ====================

/**
 * 获取营收明细列表
 */
Mock.mock(/\/hub\/merchantrevenuedetail\/user\/page/, 'get', () => {
  const list = []
  const statuses = ['DONE', 'NEW', 'REFUND', 'EXPIRED']
  const statusNames = { DONE: '已完成', NEW: '新订单', REFUND: '已退款', EXPIRED: '已过期' }

  for (let i = 0; i < 20; i++) {
    const price = Mock.Random.float(10, 50, 2, 2)
    const gatewayFee = (price * 0.1).toFixed(2)
    const platformFee = (price * 0.03).toFixed(2)
    const serviceFee = (price * 0.02).toFixed(2)
    const netIncome = (price - gatewayFee - platformFee - serviceFee).toFixed(2)

    list.push({
      id: 'ORD' + Mock.Random.guid().substring(0, 8).toUpperCase(),
      orderNo: 'ORD' + Date.now() + Mock.Random.integer(1000, 9999),
      productName: '会员订阅 - ' + Mock.Random.cword(2, 4) + '个月',
      quantity: Mock.Random.integer(1, 5),
      totalPrice: price.toFixed(2),
      gatewayFee,
      platformFee,
      serviceFee,
      netIncome,
      status: statuses[Mock.Random.integer(0, 3)],
      statusName: statusNames[statuses[Mock.Random.integer(0, 3)]],
      tradeDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    })
  }

  return {
    code: 0,
    msg: '获取成功',
    data: {
      list,
      total: list.length
    }
  }
})

// ==================== 分销明细相关 ====================

/**
 * 获取分销明细列表
 */
Mock.mock(/\/hub\/merchantdistributiondetail\/user\/page/, 'get', () => {
  const list = []
  const statuses = ['DONE', 'NEW', 'REFUND', 'EXPIRED']
  const levels = [1, 2, 3]
  const levelNames = { 1: '一级', 2: '二级', 3: '三级' }
  const commissionRates = { 1: 0.6, 2: 0.06, 3: 0.04 }

  for (let i = 0; i < 20; i++) {
    const price = Mock.Random.float(10, 50, 2, 2)
    const level = levels[Mock.Random.integer(0, 2)]
    const commission = (price * commissionRates[level]).toFixed(2)

    list.push({
      id: 'DIS' + Mock.Random.guid().substring(0, 8).toUpperCase(),
      orderNo: 'DIS' + Date.now() + Mock.Random.integer(1000, 9999),
      productName: '会员订阅 - ' + Mock.Random.cword(2, 4) + '个月',
      quantity: Mock.Random.integer(1, 5),
      totalPrice: price.toFixed(2),
      netIncome: (price * 0.85).toFixed(2),
      commissionAmount: commission,
      commissionRate: commissionRates[level],
      distributionLevel: level,
      status: statuses[Mock.Random.integer(0, 3)],
      tradeDate: Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    })
  }

  return {
    code: 0,
    msg: '获取成功',
    data: {
      list,
      total: list.length
    }
  }
})

// ==================== 导出 ====================

export default Mock

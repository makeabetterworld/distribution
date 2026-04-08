<template>
  <div class="overview">
    <!-- 余额卡片 -->
    <div class="balance-section">
      <div class="balance-card">
        <div class="balance-main">
          <div class="balance-label">可提现余额</div>
          <div class="balance-amount">$ {{ balance.withdrawableBalance.toFixed(2) }}</div>
        </div>
        <a-button type="primary" @click="showWithdrawModal = true">
          提现
        </a-button>
      </div>

      <div class="balance-info">
        <div class="info-item">
          <div class="info-label">冻结余额</div>
          <div class="info-value">$ {{ balance.frozenBalance.toFixed(2) }}</div>
        </div>
        <div class="info-divider" v-if="!isMobile"></div>
        <div class="info-item">
          <div class="info-label">商户余额</div>
          <div class="info-value">$ {{ balance.totalBalance.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="stats-row" :class="{ 'mobile-stack': isMobile }">
      <a-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e6f7ed;">
            <DollarOutlined style="color: #07c160;" />
          </div>
          <div class="stat-content">
            <div class="stat-label">近 30 天营业额</div>
            <div class="stat-value">$ {{ balance.last30DaysRevenue.toFixed(2) }}</div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fff7e6;">
            <TeamOutlined style="color: #fa8c16;" />
          </div>
          <div class="stat-content">
            <div class="stat-label">近 30 天分销额</div>
            <div class="stat-value">$ {{ balance.last30DaysDistribution.toFixed(2) }}</div>
          </div>
        </div>
      </a-col>
<!--      <a-col :xs="24" :sm="8">-->
<!--        <div class="stat-card">-->
<!--          <div class="stat-icon" style="background: #f0f5ff;">-->
<!--            <BarChartOutlined style="color: #1890ff;" />-->
<!--          </div>-->
<!--          <div class="stat-content">-->
<!--            <div class="stat-label">本月收益</div>-->
<!--            <div class="stat-value">$ {{ currentMonthRevenue.toFixed(2) }}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </a-col>-->
    </a-row>

    <!-- 佣金比例卡片 -->
    <a-row :gutter="[16, 16]" class="stats-row" :class="{ 'mobile-stack': isMobile }">
      <a-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: #ffe6f6;">
            <GiftOutlined style="color: #eb2f96;" />
          </div>
          <div class="stat-content">
            <div class="stat-label">一级佣金比例</div>
            <div class="stat-value">{{ (commission.commissionRate * 100).toFixed(2) }}%</div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e6f7ff;">
            <GiftOutlined style="color: #1890ff;" />
          </div>
          <div class="stat-content">
            <div class="stat-label">二级佣金比例</div>
            <div class="stat-value">{{ (commission.parentCommission * 100).toFixed(2) }}%</div>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fff7e6;">
            <GiftOutlined style="color: #faad14;" />
          </div>
          <div class="stat-content">
            <div class="stat-label">三级佣金比例</div>
            <div class="stat-value">{{ (commission.grandfatherCommission * 100).toFixed(2) }}%</div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 公告 -->
    <a-row :gutter="[16, 16]" class="chart-row" :class="{ 'mobile-stack': isMobile }">
      <a-col :xs="24">
        <div class="card">
          <div class="card-header">
            <h3>商户公告</h3>
          </div>
          <a-list :data-source="announcements" class="announcement-list">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.title" :description="item.content">
                  <template #description>
                    <div class="announcement-content">
                      <span>{{ item.content }}</span>
                      <span class="announcement-date">{{ item.date }}</span>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-col>
    </a-row>

    <!-- 站点配置信息 -->
    <div class="card" v-if="siteConfig.isActive === 1">
      <div class="card-header">
        <h3>站点配置</h3>
      </div>
      <a-descriptions bordered :column="{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="站点名称">
          <span v-if="siteConfig.siteNameCn">{{ siteConfig.siteNameCn }}</span>
          <span v-else>{{ siteConfig.siteNameEn }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="站点英文名">{{ siteConfig.siteNameEn }}</a-descriptions-item>
        <a-descriptions-item label="站点链接">
          <a :href="formatSiteUrl(siteConfig.siteUrl)" target="_blank" rel="noopener" v-if="siteConfig.siteUrl">
            {{ siteConfig.siteUrl }}
          </a>
          <span v-else>未设置</span>
        </a-descriptions-item>
        <a-descriptions-item label="最低定价 (USD)">${{ siteConfig.minPriceUsd }}</a-descriptions-item>
<!--        <a-descriptions-item label="商品 ID">{{ siteConfig.productId || '未设置' }}</a-descriptions-item>-->
<!--        <a-descriptions-item label="定价计划 ID">{{ siteConfig.pricingId || '未设置' }}</a-descriptions-item>-->
      </a-descriptions>
    </div>

    <!-- 提现历史 -->
    <div class="card">
      <div class="card-header">
        <h3>提现历史明细</h3>
      </div>
      <div class="table-responsive">
        <a-table :columns="withdrawColumns" :data-source="withdrawHistory" :pagination="false" size="small" :scroll="{ x: 300 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              <span class="amount">$ {{ parseFloat(record.amount).toFixed(2) }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- 提现弹窗 -->
    <a-modal v-model:open="showWithdrawModal" title="申请提现" @ok="handleWithdraw" :confirmLoading="submitting" :centered="true">
      <a-form ref="formRef" :model="withdrawForm" layout="vertical">
        <a-form-item label="可提现金额">
          <div class="withdrawable-amount">$ {{ balance.withdrawableBalance.toFixed(2) }}</div>
        </a-form-item>
        <a-form-item
          label="提现金额"
          name="amount"
          :rules="[
            { required: true, message: '请输入提现金额' },
            { type: 'number', min: 30, message: '最低提现金额为$30' },
            { validator: validateAmount }
          ]"
        >
          <a-input-number v-model:value="withdrawForm.amount" :min="30" :max="balance.withdrawableBalance" :step="0.01" style="width: 100%" placeholder="最低$30">
            <template #addonAfter>$</template>
          </a-input-number>
        </a-form-item>
        <a-form-item label="提现账户">
          <div>{{ withdrawAccount }}</div>
        </a-form-item>
        <a-alert v-if="!withdrawSetting.alipayPhone" message="请先设置提现账户" type="warning" show-icon />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { DollarOutlined, TeamOutlined, GiftOutlined } from '@ant-design/icons-vue'
import { getUserSiteConfig, getMerchantUserInfo, submitWithdraw, getWithdrawSetting, getMerchantAnnouncements, getWithdrawRequests } from '@/api/site'
import { generateUuid } from '@/utils'

const balance = ref({
  withdrawableBalance: 0,
  frozenBalance: 0,
  totalBalance: 0,
  last30DaysRevenue: 0,
  last30DaysDistribution: 0
})

const commission = ref({
  commissionRate: 0,
  parentCommission: 0,
  grandfatherCommission: 0
})

const currentMonthRevenue = ref(0)
const isMobile = ref(false)
const loading = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // 获取商户资产信息、站点配置和提现设置
  fetchMerchantInfo()
  fetchSiteConfig()
  fetchWithdrawSetting()
  fetchAnnouncements()
  fetchWithdrawHistory()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const announcements = ref([])

const withdrawHistory = ref([])

const withdrawColumns = [
  { title: '提现金额', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '提现账户', dataIndex: 'account', key: 'account' },
  { title: '申请日期', dataIndex: 'date', key: 'date' }
]

const submitting = ref(false)
const showWithdrawModal = ref(false)
const withdrawForm = reactive({
  amount: null
})
const withdrawAccount = ref('支付宝 - 未设置')
const formRef = ref(null)

// 提现设置
const withdrawSetting = ref({
  alipayPhone: '',
  firstNamePinyin: '',
  lastNamePinyin: '',
  remark: ''
})

// 站点配置
const siteConfig = ref({
  siteNameEn: '',
  siteNameCn: '',
  siteUrl: '',
  minPriceUsd: 14.00,
  isActive: 1,
  productId: '',
  pricingId: ''
})

// 获取站点配置
const fetchSiteConfig = async () => {
  try {
    const response = await getUserSiteConfig()
    if (response && response.data) {
      siteConfig.value = {
        siteNameEn: response.data.siteNameEn || '',
        siteNameCn: response.data.siteNameCn || '',
        siteUrl: response.data.siteUrl || '',
        minPriceUsd: response.data.minPriceUsd || 14.00,
        isActive: response.data.isActive,
        productId: response.data.productId || '',
        pricingId: response.data.pricingId || ''
      }
    }
  } catch (error) {
    console.error('获取站点配置失败', error)
  }
}

// 获取商户资产信息
const fetchMerchantInfo = async () => {
  try {
    loading.value = true
    const response = await getMerchantUserInfo()
    if (response && response.data) {
      const data = response.data
      balance.value = {
        withdrawableBalance: parseFloat(data.availableBalance) || 0,
        frozenBalance: parseFloat(data.frozenBalance) || 0,
        totalBalance: parseFloat(data.totalBalance) || 0,
        last30DaysRevenue: parseFloat(data.turnover30d) || 0,
        last30DaysDistribution: parseFloat(data.distributionAmount30d) || 0
      }
      // 佣金比例
      commission.value = {
        commissionRate: parseFloat(data.commissionRate) || 0,
        parentCommission: parseFloat(data.parentCommission) || 0,
        grandfatherCommission: parseFloat(data.grandfatherCommission) || 0
      }
    }
  } catch (error) {
    console.error('获取商户信息失败', error)
  } finally {
    loading.value = false
  }
}

// 获取提现设置
const fetchWithdrawSetting = async () => {
  try {
    const response = await getWithdrawSetting()
    if (response && response.data) {
      const data = response.data
      withdrawSetting.value = {
        alipayPhone: data.alipayPhone || '',
        firstNamePinyin: data.firstNamePinyin || '',
        lastNamePinyin: data.lastNamePinyin || '',
        remark: data.remark || ''
      }
      // 更新提现账户显示：姓名 + 支付宝账号
      if (data.alipayPhone) {
        const name = data.firstNamePinyin && data.lastNamePinyin
          ? `${data.lastNamePinyin} ${data.firstNamePinyin}`.toUpperCase()
          : '未设置'
        withdrawAccount.value = `支付宝 - ${name} (${data.alipayPhone})`
      }
    }
  } catch (error) {
    console.error('获取提现设置失败', error)
  }
}

// 获取商户公告
const fetchAnnouncements = async () => {
  try {
    const response = await getMerchantAnnouncements({
      page: 1,
      limit: 10,
      orderField: 'sort_order',
      order: 'desc'
    })
    if (response && response.data && response.data.list) {
      announcements.value = response.data.list.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        date: item.createDate ? new Date(item.createDate).toLocaleDateString('zh-CN') : ''
      }))
    }
  } catch (error) {
    console.error('获取公告列表失败', error)
  }
}

// 获取提现历史记录
const fetchWithdrawHistory = async () => {
  try {
    const response = await getWithdrawRequests({
      page: 1,
      limit: 10,
      orderField: 'create_date',
      order: 'desc'
    })
    if (response && response.data && response.data.list) {
      withdrawHistory.value = response.data.list.map(item => ({
        id: item.id,
        amount: item.amount,
        status: item.status,
        date: item.createDate ? new Date(item.createDate).toLocaleDateString('zh-CN') : '',
        account: item.alipayAccountSnapshot ? `支付宝 (${item.alipayAccountSnapshot})` : '支付宝'
      }))
    }
  } catch (error) {
    console.error('获取提现历史失败', error)
  }
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colorMap = {
    1: 'warning',      // 待审核
    2: 'processing',   // 打款中
    3: 'success',      // 打款成功
    4: 'error',        // 打款失败
    5: 'error',        // 审核拒绝
    9: 'default'       // 系统异常
  }
  return colorMap[status] || 'processing'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    1: '待审核',
    2: '打款中',
    3: '打款成功',
    4: '打款失败',
    5: '审核拒绝',
    9: '系统异常'
  }
  return textMap[status] || '未知'
}

const validateAmount = async () => {
  if (withdrawForm.amount > balance.value.withdrawableBalance) {
    throw new Error('提现金额不能超过可提现余额')
  }
}

const handleWithdraw = async () => {
  try {
    // 检查是否有提现设置
    if (!withdrawSetting.value.alipayPhone) {
      message.warning('请先设置提现账户')
      return
    }

    // 表单验证
    await formRef.value?.validate()

    submitting.value = true

    // 生成请求号（用于幂等校验）
    const requestNo = generateUuid()

    // 调用提现接口
    const response = await submitWithdraw({
      requestNo: requestNo,
      amount: withdrawForm.amount
    })

    if (response && response.data) {
      message.success('提现申请已提交，审核通过后 24 小时内到账')
      showWithdrawModal.value = false
      withdrawForm.amount = null
      // 刷新余额信息
      await fetchMerchantInfo()
    }
  } catch (error) {
    if (error.message && !error.message.includes('validate')) {
      message.error('提现失败，请重试')
    }
    console.error('提现失败:', error)
  } finally {
    submitting.value = false
  }
}

// 格式化站点链接，确保带有协议
const formatSiteUrl = (url) => {
  if (!url) return ''
  // 如果已经包含协议，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 默认添加 https://
  return `https://${url}`
}
</script>

<style scoped>
.overview {
  max-width: 1200px;
}

.balance-section {
  margin-bottom: 24px;
}

.balance-card {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.3);
}

.balance-main {
  flex: 1;
}

.balance-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.balance-amount {
  font-size: 36px;
  font-weight: 700;
}

.balance-card :deep(.ant-btn-primary) {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  height: 36px;
  padding: 0 16px;
}

.balance-card :deep(.ant-btn-primary:hover) {
  background: rgba(255, 255, 255, 0.3);
}

.balance-info {
  display: flex;
  gap: 48px;
  margin-top: 16px;
  align-items: center;
}

.balance-info .info-item {
  text-align: center;
}

.balance-info .info-label {
  font-size: 13px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.balance-info .info-value {
  font-size: 20px;
  font-weight: 600;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.stats-row {
  margin-bottom: 16px;
}

.stats-row.mobile-stack :deep(.ant-col) {
  display: flex;
  margin-bottom: 0 !important;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  font-size: 22px;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #111;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-row.mobile-stack :deep(.ant-col) {
  display: flex;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.card-header {
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: #111;
  word-break: break-word;
}

.announcement-list :deep(.ant-list-item) {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.announcement-list :deep(.ant-list-item:last-child) {
  border-bottom: none;
}

.announcement-list :deep(.ant-list-item-meta-title) {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.announcement-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  gap: 8px;
}

.announcement-date {
  color: #999;
  font-size: 11px;
  white-space: nowrap;
}

.table-responsive {
  overflow-x: auto;
}

.amount {
  font-weight: 600;
  color: #07c160;
}

.withdrawable-amount {
  font-size: 20px;
  font-weight: 700;
  color: #07c160;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .overview {
    max-width: 100%;
  }

  .balance-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }

  .balance-amount {
    font-size: 28px;
  }

  .balance-info {
    gap: 24px;
  }

  .info-divider {
    display: none;
  }

  .stat-label {
    font-size: 11px;
  }

  .stat-value {
    font-size: 18px;
  }

  .chart-row {
    margin-bottom: 12px;
  }

  .chart-row :deep(.ant-col) {
    width: 100% !important;
    flex: 0 0 100%;
    max-width: 100%;
  }

  .card {
    padding: 12px;
  }

  .card-header h3 {
    font-size: 14px;
    line-height: 1.3;
  }

  .announcement-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .announcement-list {
    width: 100%;
  }

  .announcement-list :deep(.ant-list-item-meta-content) {
    flex: 1;
    min-width: 0;
  }

  .announcement-list :deep(.ant-list-item-meta-title) {
    font-size: 13px;
    line-height: 1.3;
  }

  .announcement-list :deep(.ant-list-item-meta-description) {
    width: 100%;
  }
}
</style>

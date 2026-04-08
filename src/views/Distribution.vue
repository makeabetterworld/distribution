<template>
  <div class="distribution">
    <!-- 分销级别说明 -->
    <div class="distribution-info">
      <h4>分销级别说明</h4>
      <div class="info-grid">
        <div class="info-card level-1">
          <div class="info-title">一级分销</div>
          <div class="info-rate">{{ (userCommission.commissionRate * 100).toFixed(2) }}% 佣金</div>
          <div class="info-desc">直接邀请的好友消费，您获得 {{ (userCommission.commissionRate * 100).toFixed(2) }}% 佣金</div>
        </div>
        <div class="info-card level-2">
          <div class="info-title">二级分销</div>
          <div class="info-rate">{{ (userCommission.parentCommission * 100).toFixed(2) }}% 佣金</div>
          <div class="info-desc">好友邀请的好友消费，您获得 {{ (userCommission.parentCommission * 100).toFixed(2) }}% 佣金</div>
        </div>
        <div class="info-card level-3">
          <div class="info-title">三级分销</div>
          <div class="info-rate">{{ (userCommission.grandfatherCommission * 100).toFixed(2) }}% 佣金</div>
          <div class="info-desc">第三层好友消费，您获得 {{ (userCommission.grandfatherCommission * 100).toFixed(2) }}% 佣金</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>分销明细</h3>
      </div>

      <!-- 筛选条件 -->
      <div class="filter-section">
        <a-form layout="inline">
          <a-form-item label="分销级别">
            <a-select v-model:value="filters.level" placeholder="全部级别" style="width: 120px" allowClear>
              <a-select-option value="1">一级</a-select-option>
              <a-select-option value="2">二级</a-select-option>
              <a-select-option value="3">三级</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model:value="filters.status" placeholder="全部状态" style="width: 120px" allowClear>
              <a-select-option value="DONE">已完成</a-select-option>
              <a-select-option value="NEW">新订单</a-select-option>
              <a-select-option value="REFUND">已退款</a-select-option>
              <a-select-option value="EXPIRED">已过期</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="日期">
            <a-range-picker v-model:value="filters.dateRange" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 桌面端表格 -->
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" @change="handleTableChange" size="middle" class="desktop-table" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'totalPrice'">
            <span class="price">$ {{ parseFloat(record.totalPrice || 0).toFixed(2) }}</span>
          </template>
          <template v-if="column.key === 'netIncome'">
            <span class="price">$ {{ parseFloat(record.netIncome || 0).toFixed(2) }}</span>
          </template>

          <template v-if="column.key === 'details'">
            <a-popover title="费用明细" trigger="click">
              <template #content>
                <div class="detail-popover">
                  <div class="detail-item">
                    <span>订单总价:</span>
                    <span>$ {{ parseFloat(record.totalPrice || 0).toFixed(2) }}</span>
                  </div>
                  <div class="detail-item">
                    <span>订单净收入:</span>
                    <span>$ {{ parseFloat(record.netIncome || 0).toFixed(2) }}</span>
                  </div>
<!--                  <div class="detail-item">-->
<!--                    <span>净收入:</span>-->
<!--                    <span>$ {{ parseFloat(record.netIncome || 0).toFixed(2) }}</span>-->
<!--                  </div>-->
                  <div class="detail-item total">
                    <span>分销佣金:</span>
                    <span class="commission">+ $ {{ parseFloat(record.commissionAmount || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </template>
              <a class="details-link">查看明细</a>
            </a-popover>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusName(record.status) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'commissionRate'">
            <span class="commission-rate">{{ (parseFloat(record.commissionRate || 0) * 100).toFixed(2) }}%</span>
          </template>

          <template v-if="column.key === 'level'">
            <a-tag :color="getLevelColor(record.distributionLevel)">
              {{ getLevelName(record.distributionLevel) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'commissionAmount'">
            <span class="commission">$ {{ parseFloat(record.commissionAmount || 0).toFixed(2) }}</span>
          </template>

          <template v-if="column.key === 'tradeDate'">
            {{ record.tradeDate ? formatDate(record.tradeDate) : '' }}
          </template>
        </template>
      </a-table>

      <!-- 移动端卡片列表 -->
      <div class="mobile-list">
        <div v-for="(record, index) in dataSource" :key="record.id" class="order-card">
          <div class="order-header">
            <div class="order-id">{{ record.orderNo }}</div>
            <div class="header-tags">
              <a-tag :color="getStatusColor(record.status)">{{ getStatusName(record.status) }}</a-tag>
              <a-tag :color="getLevelColor(record.distributionLevel)">{{ getLevelName(record.distributionLevel) }}</a-tag>
            </div>
          </div>
          <div class="order-body">
            <div class="order-row">
              <span class="label">商品</span>
              <span class="value">{{ record.productName }}</span>
            </div>
            <div class="order-row">
              <span class="label">数量</span>
              <span class="value">x{{ record.quantity }}</span>
            </div>
            <div class="order-row">
              <span class="label">订单价</span>
              <span class="value price">$ {{ parseFloat(record.totalPrice || 0).toFixed(2) }}</span>
            </div>
            <div class="order-row">
              <span class="label">订单净收入</span>
              <span class="value price">$ {{ parseFloat(record.netIncome || 0).toFixed(2) }}</span>
            </div>
            <div class="order-row">
              <span class="label">佣金比例</span>
              <span class="value commission-rate">{{ (parseFloat(record.commissionRate || 0) * 100).toFixed(2) }}%</span>
            </div>
            <div class="order-row">
              <span class="label">佣金</span>
              <span class="value commission">$ {{ parseFloat(record.commissionAmount || 0).toFixed(2) }}</span>
            </div>
            <div class="order-row">
              <span class="label">日期</span>
              <span class="value date">{{ record.tradeDate ? formatDate(record.tradeDate) : '' }}</span>
            </div>
          </div>
          <div class="order-footer">
            <a class="details-btn" @click="showDetail(index)">
              <file-text-outlined /> 查看明细
            </a>
          </div>
        </div>
      </div>

      <!-- 移动端分页 -->
      <div class="mobile-pagination">
        <a-pagination v-model:current="pagination.current" v-model:pageSize="pagination.pageSize"
          :total="pagination.total" :page-size-options="['5', '10', '20']"
          show-size-changer simple size="small"
          @change="handleMobilePageChange" />
        <span class="total-text">共 {{ pagination.total }} 条</span>
      </div>
    </div>


    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="费用明细" :centered="true" width="90%">
      <div v-if="selectedRecord" class="detail-modal">
        <div class="detail-row">
          <span>订单号</span>
          <span>{{ selectedRecord.orderNo }}</span>
        </div>
        <div class="detail-row">
          <span>商品名称</span>
          <span>{{ selectedRecord.productName }}</span>
        </div>
        <div class="detail-row">
          <span>购买数量</span>
          <span>x{{ selectedRecord.quantity }}</span>
        </div>
        <div class="detail-row">
          <span>订单总价</span>
          <span class="price">$ {{ parseFloat(selectedRecord.totalPrice || 0).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span>订单净收入</span>
          <span class="price">$ {{ parseFloat(selectedRecord.netIncome || 0).toFixed(2) }}</span>
        </div>
        <div class="detail-row">
          <span>分销级别</span>
          <a-tag :color="getLevelColor(selectedRecord.distributionLevel)">{{ getLevelName(selectedRecord.distributionLevel) }}</a-tag>
        </div>
        <div class="detail-row">
          <span>佣金比例</span>
          <span class="commission-rate">{{ (parseFloat(selectedRecord.commissionRate || 0) * 100).toFixed(2) }}%</span>
        </div>
<!--        <div class="detail-divider"></div>-->
<!--        <div class="detail-row">-->
<!--          <span>净收入</span>-->
<!--          <span>$ {{ parseFloat(selectedRecord.netIncome || 0).toFixed(2) }}</span>-->
<!--        </div>-->
        <div class="detail-divider"></div>
        <div class="detail-row total">
          <span>分销佣金</span>
          <span class="commission">+ $ {{ parseFloat(selectedRecord.commissionAmount || 0).toFixed(2) }}</span>
        </div>
        <div class="detail-row" v-if="selectedRecord.feeDetailDesc">
          <span>费用明细</span>
          <span>{{ selectedRecord.feeDetailDesc }}</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { FileTextOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getDistributionDetails, getMerchantUserInfo } from '@/api/site'

const filters = reactive({
  level: '',
  status: '',
  dateRange: null
})

// 用户佣金比例
const userCommission = ref({
  commissionRate: 0.1,
  parentCommission: 0.05,
  grandfatherCommission: 0.02
})

const dataSource = ref([])
const loading = ref(false)

const columns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 180 },
  { title: '商品名称', dataIndex: 'productName', key: 'productName', ellipsis: true },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '订单总价', dataIndex: 'totalPrice', key: 'totalPrice', width: 100 },
  { title: '订单净收入', dataIndex: 'netIncome', key: 'netIncome', width: 100 },
  { title: '费用明细', key: 'details', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '佣金比例', dataIndex: 'commissionRate', key: 'commissionRate', width: 100 },
  { title: '分销级别', dataIndex: 'distributionLevel', key: 'level', width: 100 },
  { title: '佣金金额', dataIndex: 'commissionAmount', key: 'commissionAmount', width: 100 },
  { title: '日期', dataIndex: 'tradeDate', key: 'tradeDate', width: 170 }
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`
})

const detailVisible = ref(false)
const selectedRecord = ref(null)

// 加载分销明细数据
const loadDistributionData = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      orderField: 'trade_date',
      order: 'desc'
    }

    if (filters.level) {
      params.distributionLevel = filters.level
    }
    if (filters.status) {
      params.status = filters.status
    }
    if (filters.dateRange && filters.dateRange.length === 2) {
      params.startDate = filters.dateRange[0].format('YYYY-MM-DD')
      params.endDate = filters.dateRange[1].format('YYYY-MM-DD')
    }

    const response = await getDistributionDetails(params)
    if (response && response.data) {
      dataSource.value = response.data.list || []
      pagination.total = response.data.total || 0
    }
  } catch (error) {
    console.error('加载分销明细失败:', error)
    message.error('加载分销明细失败')
  } finally {
    loading.value = false
  }
}

// 加载用户佣金比例
const loadUserCommission = async () => {
  try {
    const response = await getMerchantUserInfo()
    if (response && response.data) {
      userCommission.value = {
        commissionRate: parseFloat(response.data.commissionRate) || 0.1,
        parentCommission: parseFloat(response.data.parentCommission) || 0.05,
        grandfatherCommission: parseFloat(response.data.grandfatherCommission) || 0.02
      }
    }
  } catch (error) {
    console.error('加载用户佣金比例失败:', error)
  }
}

const getStatusColor = (status) => {
  const colorMap = {
    DONE: 'success',
    NEW: 'processing',
    REFUND: 'warning',
    EXPIRED: 'default'
  }
  return colorMap[status] || 'default'
}

const getStatusName = (status) => {
  const textMap = {
    DONE: '已完成',
    NEW: '新订单',
    REFUND: '已退款',
    EXPIRED: '已过期'
  }
  return textMap[status] || '未知'
}

const getLevelColor = (level) => {
  const colorMap = {
    1: 'gold',
    2: 'blue',
    3: 'orange'
  }
  return colorMap[level] || 'default'
}

const getLevelName = (level) => {
  const textMap = {
    1: '一级',
    2: '二级',
    3: '三级'
  }
  return textMap[level] || '未知'
}

const handleSearch = () => {
  pagination.current = 1
  loadDistributionData()
}

const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadDistributionData()
}

const handleMobilePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  loadDistributionData()
}

const showDetail = (index) => {
  selectedRecord.value = dataSource.value[index]
  detailVisible.value = true
}

// 日期格式化
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadUserCommission()
  loadDistributionData()
})
</script>

<style scoped>
.distribution {
  max-width: 1400px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #111;
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-section :deep(.ant-form-item) {
  margin-bottom: 8px;
}

:deep(.ant-btn-primary) {
  background: #07c160;
}

.price {
  font-weight: 600;
  color: #111;
}

.details-link {
  color: #07c160;
  cursor: pointer;
}

.commission-rate {
  font-weight: 600;
  color: #fa8c16;
}

.detail-popover {
  min-width: 180px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
  border-bottom: 1px dashed #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item.total {
  border-top: 1px solid #e5e5e5;
  margin-top: 8px;
  padding-top: 10px;
  font-weight: 600;
}

.negative {
  color: #ff4d4f;
}

.positive {
  color: #07c160;
}

.commission {
  color: #fa8c16;
}

.distribution-info {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.distribution-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #111;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.info-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  border: 2px solid transparent;
}

.info-card.level-1 { border-color: #ffd700; }
.info-card.level-2 { border-color: #52c41a; }
.info-card.level-3 { border-color: #fa8c16; }

.info-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111;
}

.info-rate {
  font-size: 24px;
  font-weight: 700;
  color: #07c160;
  margin-bottom: 6px;
}

.info-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 移动端卡片列表 */
.mobile-list {
  display: none;
}

.mobile-pagination {
  display: none;
  margin-top: 16px;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.total-text {
  font-size: 13px;
  color: #999;
}

.detail-modal {
  padding: 8px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
}

.detail-row .price {
  font-size: 16px;
}

.detail-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.detail-row.total {
  font-weight: 600;
  font-size: 15px;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }

  .card-header h3 {
    font-size: 14px;
  }

  .filter-section :deep(.ant-form) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section :deep(.ant-form-item) {
    width: 100%;
    margin-bottom: 4px;
  }

  /* 隐藏桌面端表格 */
  .desktop-table {
    display: none;
  }

  /* 显示移动端列表 */
  .mobile-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mobile-pagination {
    display: flex;
  }

  .order-card {
    background: #f9f9f9;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #e5e5e5;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
  }

  .order-id {
    font-family: monospace;
    font-size: 12px;
    color: #666;
  }

  .header-tags {
    display: flex;
    gap: 4px;
  }

  .header-tags :deep(.ant-tag) {
    margin: 0;
    font-size: 11px;
  }

  .order-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .order-row .label {
    color: #999;
    font-size: 12px;
  }

  .order-row .value {
    color: #333;
    font-weight: 500;
  }

  .order-row .price {
    color: #07c160;
    font-size: 14px;
  }

  .order-row .commission-rate {
    color: #fa8c16;
    font-size: 13px;
  }

  .order-row .date {
    font-size: 11px;
    color: #999;
  }

  .order-footer {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
    text-align: right;
  }

  .details-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #07c160;
    font-size: 13px;
    cursor: pointer;
  }

  .detail-modal .detail-row {
    padding: 10px 0;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-rate {
    font-size: 20px;
  }
}
</style>

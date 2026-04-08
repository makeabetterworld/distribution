<template>
  <div class="site-manage">
    <!-- 站点设置 -->
    <div class="card">
      <div class="card-header">
        <h3>站点设置</h3>
      </div>
      <a-form :model="siteForm" layout="vertical">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="商户 ID">
              <a-input v-model:value="siteForm.merchantId" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点链接">
              <a-input v-model:value="siteForm.siteUrl" placeholder="由站点英文名自动生成" disabled />
              <div class="form-tip">格式：站点英文名.xx.com</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="站点英文名">
              <a-input v-model:value="siteForm.siteNameEn" @input="handleSiteNameInput" placeholder="仅支持小写字母和数字" disabled/>
              <div class="form-tip">仅支持小写字母和数字</div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点中文名称">
              <a-input v-model:value="siteForm.siteNameCn" placeholder="选填" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="站点会员定价 (USD)">
              <a-input-number v-model:value="siteForm.minPriceUsd" :min="14" :step="0.01" style="width: 100%">
                <template #addonAfter>$</template>
              </a-input-number>
              <div class="form-tip">最低价格不能低于 14USD</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-button type="primary" @click="handleSaveSite">保存设置</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 提现设置 -->
    <div class="card">
      <div class="card-header">
        <h3>提现设置</h3>
        <p>每个用户只能设置一个提现账户</p>
      </div>
      <a-form :model="withdrawForm" layout="vertical" ref="withdrawFormRef">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="支付宝手机号" name="alipayPhone" :rules="[
              { required: true, message: '请输入支付宝手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
            ]">
              <a-input v-model:value="withdrawForm.alipayPhone" placeholder="用于接收提现通知" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="姓氏拼音" name="alipayLastName" :rules="[{ required: true, message: '请输入姓氏拼音' }]">
              <a-input v-model:value="withdrawForm.alipayLastName" placeholder="例如：Zhang" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="名字拼音" name="alipayFirstName" :rules="[{ required: true, message: '请输入名字拼音' }]">
              <a-input v-model:value="withdrawForm.alipayFirstName" placeholder="例如：San" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注">
              <a-input v-model:value="withdrawForm.alipayRemark" placeholder="选填，用于识别账户" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-button type="primary" @click="handleSaveWithdraw" :loading="withdrawLoading">
            {{ withdrawForm.id ? '更新提现信息' : '新增提现信息' }}
          </a-button>
          <a-button v-if="withdrawForm.id" danger @click="handleDeleteWithdraw" style="margin-left: 8px">
            删除提现信息
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 推广物料 -->
    <div class="card">
      <div class="card-header">
        <h3>推广物料</h3>
        <p>使用以下物料进行推广，扫码即可访问您的站点</p>
      </div>
      <div class="materials-grid">
        <div class="material-card">
          <h4>站点二维码</h4>
          <div class="qr-code">
            <img :src="qrCodeUrl" alt="站点二维码" />
          </div>
          <a-button type="primary" @click="downloadQR">下载二维码</a-button>
        </div>

<!--        <div class="material-card">-->
<!--          <h4>站点信息</h4>-->
<!--          <div class="site-info">-->
<!--            <div class="info-item">-->
<!--              <span class="label">站点链接：</span>-->
<!--              <a :href="'https://' + siteForm.siteUrl" target="_blank">{{ siteForm.siteUrl }}</a>-->
<!--            </div>-->
<!--            <div class="info-item">-->
<!--              <span class="label">注册码：</span>-->
<!--              <span class="invite-code">{{ inviteCode }}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <a-button @click="copyInvite">复制注册码</a-button>-->
<!--        </div>-->


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import siteApi from '@/api/site'
import config from '@/config'

const authStore = useAuthStore()

const withdrawFormRef = ref()

const siteForm = reactive({
  id: null,
  merchantId: '',
  siteNameEn: '',
  siteNameCn: '',
  siteUrl: '',
  minPriceUsd: 14.00,
  productId: '',
  isActive: 1
})

const withdrawForm = reactive({
  id: null,
  alipayPhone: '',
  alipayLastName: '',
  alipayFirstName: '',
  alipayRemark: ''
})

const inviteCode = ref('INV' + Date.now().toString(36).toUpperCase())

const withdrawLoading = ref(false)

const handleSiteNameInput = (e) => {
  // 自动过滤非小写字母和数字字符
  const value = e.target.value
  const filtered = value.replace(/[^a-z0-9]/g, '')
  if (value !== filtered) {
    siteForm.siteNameEn = filtered
  }
  // 同步更新站点链接
  generateSiteUrl()
}

const generateSiteUrl = () => {
  if (siteForm.siteNameEn) {
    siteForm.siteUrl = siteForm.siteNameEn + '.' + config.siteDomain
  }
}

const qrCodeUrl = computed(() => {
  const url = siteForm.siteUrl || 'example.502502001.xyz'
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('https://' + url)}`
})

/**
 * 加载站点配置
 */
const loadSiteConfig = async () => {
  try {
    const res = await siteApi.getSiteConfigList({ pageSize: 1, current: 1 })
    console.log('站点配置响应:', res)

    // 后端返回格式：{ code: 0, data: { list: [...], total: 1 } }
    const responseData = res.data || res
    const list = responseData.list || []

    if (list.length > 0) {
      const config = list[0]
      siteForm.id = config.id
      siteForm.merchantId = config.merchantId
      siteForm.siteNameEn = config.siteNameEn
      siteForm.siteNameCn = config.siteNameCn || ''
      siteForm.siteUrl = config.siteUrl
      siteForm.minPriceUsd = config.minPriceUsd
      siteForm.productId = config.productId || ''
      siteForm.isActive = config.isActive

      // 同步到 store，这样 hasCompletedSetup 会返回 true
      authStore.completeSetup({
        merchantId: config.merchantId,
        siteNameEn: config.siteNameEn,
        siteNameCn: config.siteNameCn || '',
        siteUrl: config.siteUrl,
        memberPrice: config.minPriceUsd
      })
    } else {
      // 没有站点设置，清除 store 中的状态
      localStorage.removeItem('siteSetup')
      authStore.siteSetup = null
    }
  } catch (error) {
    console.error('加载站点配置失败:', error)
  }
}

/**
 * 保存站点设置
 */
const handleSaveSite = async () => {
  if (!siteForm.siteNameEn) {
    message.error('请输入站点英文名')
    return
  }
  if (siteForm.siteNameEn.length < 2) {
    message.error('站点英文名至少需要 2 个字符')
    return
  }
  if (siteForm.minPriceUsd < 14) {
    message.error('会员定价最低不能低于 14USD')
    return
  }

  try {
    const submitData = {
      siteNameEn: siteForm.siteNameEn,
      siteNameCn: siteForm.siteNameCn,
      siteUrl: siteForm.siteUrl,
      minPriceUsd: siteForm.minPriceUsd,
      productId: siteForm.productId,
      isActive: siteForm.isActive
    }

    if (siteForm.id) {
      // 修改
      submitData.id = siteForm.id
      await siteApi.updateSiteConfig(submitData)
    } else {
      // 新增
      await siteApi.addSiteConfig(submitData)
    }

    message.success('站点设置已保存')
    loadSiteConfig()
  } catch (error) {
    console.error('保存失败:', error)
    message.error(error.message || '保存失败，请重试')
  }
}

/**
 * 加载提现设置
 */
const loadWithdrawSetting = async () => {
  try {
    const res = await siteApi.getWithdrawSetting()
    console.log('提现设置响应:', res)

    // 后端返回格式：{ code: 0, data: { id, alipayPhone, firstNamePinyin, lastNamePinyin, remark } }
    const setting = res.data || res

    if (setting) {
      withdrawForm.id = setting.id
      withdrawForm.alipayPhone = setting.alipayPhone
      withdrawForm.alipayLastName = setting.lastNamePinyin
      withdrawForm.alipayFirstName = setting.firstNamePinyin
      withdrawForm.alipayRemark = setting.remark
    }
  } catch (error) {
    console.error('加载提现设置失败:', error)
  }
}

/**
 * 保存提现信息
 */
const handleSaveWithdraw = async () => {
  if (!withdrawFormRef.value) return

  try {
    await withdrawFormRef.value.validate()

    withdrawLoading.value = true
    const submitData = {
      alipayPhone: withdrawForm.alipayPhone,
      lastNamePinyin: withdrawForm.alipayLastName,
      firstNamePinyin: withdrawForm.alipayFirstName,
      remark: withdrawForm.alipayRemark
    }

    if (withdrawForm.id) {
      // 修改
      submitData.id = withdrawForm.id
      await siteApi.updateWithdrawSetting(submitData)
    } else {
      // 新增
      await siteApi.addWithdrawSetting(submitData)
    }

    message.success('提现信息已保存')
    loadWithdrawSetting()
  } catch (error) {
    withdrawLoading.value = false
    if (error?.errorFields) {
      // 表单验证失败，不显示错误消息
      return
    }
    console.error('保存失败:', error)
    message.error(error.message || '保存失败，请重试')
  } finally {
    withdrawLoading.value = false
  }
}

const handleDeleteWithdraw = async () => {
  if (!withdrawForm.id) return

  try {
    withdrawLoading.value = true
    await siteApi.deleteWithdrawSetting(withdrawForm.id)
    message.success('提现信息已删除')
    // 清空表单
    withdrawForm.id = null
    withdrawForm.alipayPhone = ''
    withdrawForm.alipayLastName = ''
    withdrawForm.alipayFirstName = ''
    withdrawForm.alipayRemark = ''
  } catch (error) {
    console.error('删除失败:', error)
    message.error(error.message || '删除失败，请重试')
  } finally {
    withdrawLoading.value = false
  }
}

const downloadQR = async () => {
  if (!siteForm.siteUrl) {
    message.warning('请先设置站点链接')
    return
  }

  try {
    const url = `https://${siteForm.siteUrl}`
    // 使用 qrserver 的正确 API 路径 (create-qr-code 不是 create-qrcode)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`

    // 获取二维码图片
    const response = await fetch(qrApiUrl)
    if (!response.ok) {
      throw new Error('二维码生成失败')
    }
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `站点二维码-${siteForm.siteUrl}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(imageUrl)

    message.success('二维码下载成功')
  } catch (error) {
    console.error('下载二维码失败:', error)
    message.error('下载失败，请重试')
  }
}

const copyInvite = () => {
  navigator.clipboard.writeText(inviteCode.value)
  message.success('注册码已复制')
}

onMounted(() => {
  loadSiteConfig()
  loadWithdrawSetting()
})
</script>

<style scoped>
.site-manage {
  max-width: 900px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #111;
}

.card-header p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

:deep(.ant-btn-primary) {
  background: #07c160;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.material-card {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.material-card h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #111;
}

.qr-code {
  width: 180px;
  height: 180px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code img {
  max-width: 100%;
  max-height: 100%;
}

.site-info {
  text-align: left;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  font-size: 13px;
}

.info-item .label {
  color: #666;
  width: 70px;
  flex-shrink: 0;
}

.info-item a {
  color: #07c160;
  word-break: break-all;
}

.invite-code {
  font-family: monospace;
  background: #e6f7ed;
  padding: 2px 8px;
  border-radius: 4px;
  color: #07c160;
}

:deep(.ant-btn) {
  margin-top: 8px;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }

  .card-header h3 {
    font-size: 15px;
  }

  .materials-grid {
    grid-template-columns: 1fr;
  }

  .qr-code {
    width: 150px;
    height: 150px;
  }

  .info-item {
    flex-direction: column;
    gap: 4px;
  }

  .info-item .label {
    width: auto;
  }

  :deep(.ant-row) {
    flex-direction: column;
  }

  :deep(.ant-col) {
    width: 100% !important;
    margin-bottom: 12px;
  }
}
</style>

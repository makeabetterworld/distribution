<template>
  <div class="site-setup">
    <div class="setup-header">
      <h2>站点设置</h2>
      <p>完成站点信息配置后即可开始推广</p>
    </div>

    <a-form :model="form" layout="vertical" :rules="rules" ref="formRef" @finish="handleSubmit">
      <a-card class="form-card">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="商户 ID" name="merchantId">
              <a-input v-model:value="form.merchantId" disabled placeholder="系统自动生成" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点链接" name="siteUrl">
              <a-input v-model:value="form.siteUrl" disabled placeholder="由站点英文名自动生成" />
              <div class="form-tip">格式：站点英文名.test.com</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="站点英文名" name="siteNameEn" :rules="[
              { required: true, message: '请输入站点英文名' },
              { min: 2, message: '站点英文名至少需要 2 个字符' },
              { pattern: /^[a-z0-9]+$/, message: '仅支持小写字母和数字，不能包含其他符号' }
            ]">
              <a-input v-model:value="form.siteNameEn" placeholder="例如：myshop123" @input="handleSiteNameInput" @blur="generateSiteUrl" />
              <div class="form-tip">仅支持小写字母和数字</div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="站点中文名称" name="siteNameCn">
              <a-input v-model:value="form.siteNameCn" placeholder="选填，用于展示" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="站点会员定价 (USD)"
              name="memberPrice"
              :rules="[
                { required: true, message: '请输入会员定价' },
                { type: 'number', min: 14, message: '最低不能低于 14USD' }
              ]"
            >
              <a-input-number v-model:value="form.memberPrice" :min="14" :max="999" :step="0.01" style="width: 100%" placeholder="最低 14USD">
                <template #addonAfter>$</template>
              </a-input-number>
              <div class="form-tip">最低价格不能低于 14USD</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" :loading="loading">
            {{ isFirstSetup ? '完成设置并开始推广' : '保存设置' }}
          </a-button>
        </a-form-item>
      </a-card>
    </a-form>

    <!-- 推广物料展示 -->
    <div v-if="showMaterials" class="materials-section">
      <h3>推广物料</h3>
      <p>使用以下物料进行推广，扫码即可访问您的站点</p>

      <div class="materials-grid">
        <div class="material-card">
          <h4>站点二维码</h4>
          <div class="qr-code">
            <img :src="materials.qrCode" alt="站点二维码" />
          </div>
          <a-button type="primary" @click="downloadQR">下载二维码</a-button>
        </div>

        <div class="material-card">
          <h4>站点信息</h4>
          <div class="site-info">
            <div class="info-item">
              <span class="label">站点链接：</span>
              <a :href="'https://' + materials.siteUrl" target="_blank">{{ materials.siteUrl }}</a>
            </div>
            <div class="info-item">
              <span class="label">注册码：</span>
              <span class="invite-code">{{ materials.inviteCode }}</span>
            </div>
          </div>
          <a-button @click="copyInvite">复制注册码</a-button>
        </div>
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
const formRef = ref()
const loading = ref(false)
const showMaterials = ref(false)
const currentConfigId = ref(null)
const materials = ref({
  qrCode: '',
  siteUrl: '',
  inviteCode: ''
})

const isFirstSetup = computed(() => !authStore.hasCompletedSetup)

const form = reactive({
  merchantId: '',
  siteNameEn: '',
  siteNameCn: '',
  siteUrl: '',
  memberPrice: 19.99,
  productId: '',
  isActive: 1
})

const rules = {
  siteNameEn: [
    { required: true, message: '请输入站点英文名' },
    { min: 2, message: '站点英文名至少需要 2 个字符' },
    { pattern: /^[a-z0-9]+$/, message: '仅支持小写字母和数字，不能包含其他符号' }
  ],
  memberPrice: [
    { required: true, message: '请输入会员定价' },
    { type: 'number', min: 14, message: '最低不能低于 14USD' }
  ]
}

const handleSiteNameInput = (e) => {
  // 自动过滤非小写字母和数字字符
  const value = e.target.value
  const filtered = value.replace(/[^a-z0-9]/g, '')
  if (value !== filtered) {
    form.siteNameEn = filtered
  }
}

const generateSiteUrl = () => {
  if (form.siteNameEn) {
    form.siteUrl = form.siteNameEn + '.' + config.siteDomain
  }
}

/**
 * 加载站点配置数据
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
      currentConfigId.value = config.id
      form.merchantId = config.merchantId
      form.siteNameEn = config.siteNameEn
      form.siteNameCn = config.siteNameCn || ''
      form.siteUrl = config.siteUrl
      form.memberPrice = config.minPriceUsd
      form.productId = config.productId || ''
      form.isActive = config.isActive

      // 同步到 store，这样 isFirstSetup 会返回 false
      authStore.completeSetup({
        merchantId: config.merchantId,
        siteNameEn: config.siteNameEn,
        siteNameCn: config.siteNameCn || '',
        siteUrl: config.siteUrl,
        memberPrice: config.minPriceUsd
      })
    } else {
      // 没有站点设置，清除 store 中的状态，引导用户重新设置
      localStorage.removeItem('siteSetup')
      authStore.siteSetup = null
    }
  } catch (error) {
    console.error('加载站点配置失败:', error)
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  try {
    loading.value = true

    const submitData = {
      siteNameEn: form.siteNameEn,
      siteNameCn: form.siteNameCn,
      siteUrl: form.siteUrl,
      minPriceUsd: form.memberPrice,
      productId: form.productId,
      isActive: form.isActive
    }

    if (currentConfigId.value) {
      // 修改 existing config
      submitData.id = currentConfigId.value
      await siteApi.updateSiteConfig(submitData)
      message.success('站点设置已更新')
    } else {
      // 新增 config
      const res = await siteApi.addSiteConfig(submitData)
      currentConfigId.value = res.data
      message.success('站点设置已保存')
    }

    // 更新 store
    authStore.completeSetup({
      merchantId: form.merchantId,
      siteNameEn: form.siteNameEn,
      siteNameCn: form.siteNameCn,
      siteUrl: form.siteUrl,
      memberPrice: form.memberPrice
    })

    // 获取推广物料
    materials.value = {
      qrCode: `https://api.qrserver.com/v1/create-qrcode/?size=300x300&data=https://${form.siteUrl}`,
      siteUrl: form.siteUrl,
      inviteCode: 'INV' + Math.random().toString(36).substring(2, 10).toUpperCase()
    }

    showMaterials.value = true
  } catch (error) {
    console.error('保存失败:', error)
    message.error(error.message || '设置失败，请重试')
  } finally {
    loading.value = false
  }
}

const downloadQR = () => {
  message.info('下载二维码功能')
}

const copyInvite = () => {
  navigator.clipboard.writeText(materials.value.inviteCode)
  message.success('注册码已复制')
}

onMounted(() => {
  // 加载站点配置数据
  loadSiteConfig()
})
</script>

<style scoped>
.site-setup {
  max-width: 800px;
}

.setup-header {
  margin-bottom: 20px;
}

.setup-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #111;
}

.setup-header p {
  color: #666;
  margin: 0;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

:deep(.ant-btn-primary) {
  background: #07c160;
}

.materials-section {
  margin-top: 24px;
}

.materials-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.materials-section > p {
  color: #666;
  margin: 0 0 16px;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.material-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.material-card h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px;
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
  .site-setup {
    padding: 0;
  }

  .setup-header h2 {
    font-size: 18px;
  }

  .form-card {
    padding: 12px;
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

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
        </div>
        <h1>注册账号</h1>
        <p class="subtitle">创建您的分销账户</p>
      </div>

      <a-form :model="form" layout="vertical" @finish="handleRegister">
        <a-form-item
          name="username"
          :rules="[
            { required: true, message: '请输入用户名' },
            { validator: validateUsername }
          ]"
        >
          <a-input v-model:value="form.username" size="large" placeholder="请输入用户名（登录使用）">
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="email"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ]"
        >
          <a-input v-model:value="form.email" size="large" placeholder="请输入邮箱（找回密码使用）">
            <template #prefix>
              <mail-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: PASSWORD_MIN_LENGTH, message: `密码至少${PASSWORD_MIN_LENGTH}位` }
          ]"
        >
          <a-input-password v-model:value="form.password" size="large" placeholder="请输入密码">
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password v-model:value="form.confirmPassword" size="large" placeholder="请确认密码">
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          name="voucherCode"
          :rules="[{ required: true, message: '请输入注册码' }]"
        >
          <div class="voucher-container">
            <a-input v-model:value="form.voucherCode" size="large" placeholder="注册码（必填）" style="flex: 1">
              <template #prefix>
                <gift-outlined />
              </template>

            </a-input>
            <a-button type="primary" class="voucher-btn" @click="handleBuyVoucher">
              购买注册码
            </a-button>
          </div>
        </a-form-item>

        <a-form-item
          name="questionId"
          :rules="[{ required: true, message: '请选择密保问题' }]"
          label="密保问题"
        >
          <a-select v-model:value="form.questionId" size="large" placeholder="点击下拉选择密保问题">
            <a-select-option v-for="question in securityQuestions" :key="question.id" :value="question.id">
              {{ question.question }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          name="questionAnswer"
          :rules="[{ required: true, message: '请输入密保答案' }]"
          label="密保答案"
        >
          <a-input v-model:value="form.questionAnswer" size="large" placeholder="请输入密保问题的答案">
            <template #prefix>
              <edit-outlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="loading">
            注册
          </a-button>
        </a-form-item>

        <div class="auth-footer">
          已有账号？<a @click="$router.push('/login')">立即登录</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GiftOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { register as registerApi, getSecurityQuestions as getSecurityQuestionsApi } from '@/api/auth'

// ==================== 常量定义 ====================

const PASSWORD_MIN_LENGTH = 6
const USERNAME_MIN_LENGTH = 3

// ==================== 响应式数据 ====================

const router = useRouter()
const loading = ref(false)
const securityQuestions = ref([])

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  voucherCode: '',
  questionId: '',
  questionAnswer: ''
})

// ==================== 验证方法 ====================

/**
 * 验证用户名
 * @param {string} value - 用户名
 */
const validateUsername = async (value) => {
  if (value.length < USERNAME_MIN_LENGTH) {
    throw new Error(`用户名至少${USERNAME_MIN_LENGTH}位`)
  }
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    throw new Error('用户名只能包含字母、数字和下划线')
  }
}

/**
 * 验证确认密码
 */
const validateConfirmPassword = async () => {
  if (form.password !== form.confirmPassword) {
    throw new Error('两次输入的密码不一致')
  }
}

// ==================== 业务方法 ====================

/**
 * 购买注册码
 */
const handleBuyVoucher = () => {
  message.info('购买注册码功能开发中')
}

/**
 * 加载密保问题列表
 */
const loadSecurityQuestions = async () => {
  try {
    const res = await getSecurityQuestionsApi()
    securityQuestions.value = res.data || res.result || []
    // 默认选中第一个问题
    if (securityQuestions.value.length > 0) {
      form.questionId = securityQuestions.value[0].id
    }
  } catch (error) {
    console.error('加载密保问题失败:', error)
  }
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  try {
    loading.value = true

    // 准备注册数据
    const registerData = {
      username: form.username,
      email: form.email,
      password: form.password,
      voucherCode: form.voucherCode,
      questionId: form.questionId,
      questionAnswer: form.questionAnswer
    }

    await registerApi(registerData)

    // 注册成功
    message.success('注册成功')

    // 清空注册表单
    resetForm()

    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.voucherCode = ''
  form.questionId = ''
  form.questionAnswer = ''
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadSecurityQuestions()
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  padding: 16px;
}

.auth-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  margin-bottom: 12px;
}

.logo img {
  width: 48px;
  height: 48px;
}

h1 {
  font-size: 20px;
  font-weight: 500;
  color: #111;
  margin: 0 0 4px;
}

.subtitle {
  color: #b2b2b2;
  margin: 0;
  font-size: 13px;
}

/* 表单样式优化 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label > label) {
  font-size: 14px;
  color: #111;
}

:deep(.ant-input),
:deep(.ant-select-selector) {
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 1px solid transparent;
  transition: all 0.3s;
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover) {
  background-color: #fff;
  border-color: #07c160;
}

:deep(.ant-input-focused),
:deep(.ant-select-focused .ant-select-selector) {
  background-color: #fff;
  border-color: #07c160;
  box-shadow: 0 0 0 2px rgba(7, 193, 96, 0.1);
}

:deep(.ant-input::placeholder),
:deep(.ant-select-selection-placeholder) {
  color: #b2b2b2;
}

:deep(.ant-select-arrow) {
  color: #b2b2b2;
}

.submit-btn {
  background: #07c160;
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
  border-radius: 6px;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #06ad56;
}

.submit-btn:active {
  background: #059b4d;
}

.voucher-container {
  display: flex;
  gap: 8px;
}

.voucher-container input {
  flex: 1;
}

.voucher-btn {
  height: 40px;
  border-radius: 6px;
}

.auth-footer {
  text-align: center;
  color: #b2b2b2;
  margin-top: 16px;
  font-size: 14px;
}

.auth-footer a {
  color: #07c160;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.auth-footer a:hover {
  color: #06ad56;
  text-decoration: underline;
}

/* 移动端响应式 */
@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
  }

  h1 {
    font-size: 18px;
  }

  .logo img {
    width: 44px;
    height: 44px;
  }
}
</style>

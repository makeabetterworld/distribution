<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
        </div>
        <h1>找回密码</h1>
        <p class="subtitle">通过密保问题重置密码</p>
      </div>

      <!-- 步骤 1: 输入邮箱 -->
      <div v-if="step === 1">
        <a-form :model="form" layout="vertical" @finish="handleGetQuestions">
          <a-form-item
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]"
          >
            <a-input v-model:value="form.email" size="large" placeholder="请输入注册时的邮箱">
              <template #prefix>
                <mail-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="loading">
              下一步
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 步骤 2: 回答密保问题并设置新密码 -->
      <div v-if="step === 2">
        <a-form :model="form" layout="vertical" @finish="handleResetPassword">
          <a-form-item
            name="questionId"
            :rules="[{ required: true, message: '请选择密保问题' }]"
            label="密保问题"
          >
            <a-select v-model:value="form.questionId" size="large" placeholder="请选择您的密保问题">
              <a-select-option v-for="question in securityQuestions" :key="question.id" :value="question.id">
                {{ question.question }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            name="answer"
            :rules="[{ required: true, message: '请输入密保答案' }]"
            label="密保答案"
          >
            <a-input v-model:value="form.answer" size="large" placeholder="请输入您当时设置的答案">
              <template #prefix>
                <edit-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="newPassword"
            :rules="[
              { required: true, message: '请输入新密码' },
              { min: PASSWORD_MIN_LENGTH, message: `密码至少${PASSWORD_MIN_LENGTH}位` }
            ]"
          >
            <a-input-password v-model:value="form.newPassword" size="large" placeholder="请输入新密码">
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
            name="confirmPassword"
            :rules="[
              { required: true, message: '请确认新密码' },
              { validator: validateConfirmPassword }
            ]"
          >
            <a-input-password v-model:value="form.confirmPassword" size="large" placeholder="请确认新密码">
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="loading">
              重置密码
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="auth-footer">
        <a @click="$router.push('/login')">返回登录</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { MailOutlined, LockOutlined, EditOutlined } from '@ant-design/icons-vue'
import { getUserQuestions, resetPasswordByQuestion } from '@/api/auth'

// ==================== 常量定义 ====================

const PASSWORD_MIN_LENGTH = 6

// ==================== 响应式数据 ====================

const router = useRouter()
const loading = ref(false)
const step = ref(1)
const securityQuestions = ref([])

const form = reactive({
  email: '',
  questionId: '',
  answer: '',
  newPassword: '',
  confirmPassword: ''
})

// ==================== 验证方法 ====================

/**
 * 验证确认密码
 */
const validateConfirmPassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    throw new Error('两次输入的密码不一致')
  }
}

// ==================== 业务方法 ====================

/**
 * 获取密保问题
 */
const handleGetQuestions = async () => {
  try {
    loading.value = true
    const res = await getUserQuestions(form.email)
    securityQuestions.value = res.data || []

    if (!securityQuestions.value.length) {
      message.error('该邮箱未设置密保问题')
      return
    }

    // 默认选中第一个问题
    form.questionId = securityQuestions.value[0].id
    step.value = 2
  } catch (error) {
    console.error('获取密保问题失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 重置密码
 */
const handleResetPassword = async () => {
  try {
    loading.value = true

    const resetData = {
      email: form.email,
      questionId: form.questionId,
      answer: form.answer,
      newPassword: form.newPassword
    }

    await resetPasswordByQuestion(resetData)

    message.success('密码重置成功')

    // 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    console.error('重置密码失败:', error)
  } finally {
    loading.value = false
  }
}
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
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px 32px;
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  margin-bottom: 16px;
}

.logo img {
  width: 56px;
  height: 56px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px;
}

.subtitle {
  color: #7e7e7e;
  margin: 0;
  font-size: 14px;
}

.submit-btn {
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #06ad56 0%, #059b4d 100%);
}

.auth-footer {
  text-align: center;
  color: #7e7e7e;
  margin-top: 16px;
  font-size: 14px;
}

.auth-footer a {
  color: #07c160;
  cursor: pointer;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* 移动端响应式 */
@media (max-width: 480px) {
  .auth-card {
    padding: 32px 24px;
  }

  h1 {
    font-size: 20px;
  }

  .logo img {
    width: 48px;
    height: 48px;
  }
}
</style>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
        </div>
        <h1>分销系统</h1>
        <p class="subtitle">开启您的分销之旅</p>
      </div>

      <a-form :model="form" layout="vertical" @finish="handleLogin">
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名或邮箱' }]"
        >
          <a-input v-model:value="form.username" size="large" placeholder="请输入用户名或邮箱">
            <template #prefix>
              <user-outlined />
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
          name="captcha"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <div class="captcha-input">
            <a-input v-model:value="form.captcha" size="large" placeholder="请输入验证码" style="width: calc(100% - 120px)">
              <template #prefix>
                <safety-outlined />
              </template>
            </a-input>
            <img
              v-if="captchaUrl"
              :src="captchaUrl"
              class="captcha-img"
              @click="refreshCaptcha"
              alt="验证码"
            />
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block class="submit-btn" :loading="loading">
            登录
          </a-button>
        </a-form-item>

        <div class="auth-footer">
          还没有账号？<a @click="$router.push('/register')">立即注册</a>
          <span class="divider">|</span>
          <a @click="$router.push('/forget-password')">忘记密码？</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { login as loginApi, getCaptcha } from '@/api/auth'
import { generateUuid } from '@/utils'

// ==================== 常量定义 ====================

const PASSWORD_MIN_LENGTH = 6

// ==================== 响应式数据 ====================

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const captchaUrl = ref('')
const uuid = ref('')

const form = reactive({
  username: '',
  password: '',
  captcha: ''
})

// ==================== 方法 ====================

/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
  uuid.value = generateUuid()
  captchaUrl.value = ''

  getCaptcha(uuid.value)
    .then((data) => {
      if (data instanceof Blob) {
        captchaUrl.value = URL.createObjectURL(data)
      } else {
        try {
          captchaUrl.value = URL.createObjectURL(new Blob([data], { type: 'image/gif' }))
        } catch (e) {
          message.error('验证码加载失败')
        }
      }
    })
    .catch((err) => {
      console.error('获取验证码失败:', err)
      message.error('获取验证码失败')
    })
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  try {
    loading.value = true
    const res = await loginApi({
      username: form.username,
      password: form.password,
      captcha: form.captcha,
      uuid: uuid.value
    })

    // 后端返回格式：{ code: 0, data: { token: 'xxx', expire: 1234567890 } }
    const responseData = res.data || res

    if (!responseData?.token) {
      message.error('登录失败：未获取到 token')
      loading.value = false
      refreshCaptcha()
      form.captcha = ''
      return
    }

    // 保存用户信息（token 和 expire）
    // 后端返回的 expire 是相对秒数（如 315360000=10 年），需要计算过期时间戳
    const expireTimestamp = responseData.expire ? Date.now() + responseData.expire * 1000 : 0
    authStore.login({
      token: responseData.token,
      tokenExpireTime: expireTimestamp
    })

    // 获取用户详细信息
    try {
      await authStore.fetchUserInfo()
    } catch (error) {
      console.log('获取用户信息失败，但保持登录状态')
    }

    message.success('登录成功')
    router.push('/dashboard/overview')
  } catch (error) {
    console.error('登录失败:', error)
    // 刷新验证码
    refreshCaptcha()
    form.captcha = ''
  } finally {
    loading.value = false
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  refreshCaptcha()
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/dashboard/overview')
  }
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

.captcha-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.captcha-img {
  width: 112px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.captcha-img:hover {
  border-color: #07c160;
}

.auth-footer {
  text-align: center;
  color: #7e7e7e;
  margin-top: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.auth-footer a {
  color: #07c160;
  cursor: pointer;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.auth-footer .divider {
  color: #d9d9d9;
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

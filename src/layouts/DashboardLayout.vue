<template>
  <div class="dashboard-layout">
    <a-layout>
      <!-- 侧边栏 - 桌面端 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        theme="light"
        class="sidebar"
        :class="{ 'mobile-hidden': isMobile }"
      >
        <div class="logo">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
          <span>分销系统</span>
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" mode="inline" class="menu">
          <a-menu-item key="overview" @click="handleMenuClick('/dashboard/overview')">
            <template #icon>
              <home-outlined />
            </template>
            商户主页
          </a-menu-item>
          <a-menu-item key="site-manage" @click="handleMenuClick('/dashboard/site-manage')">
            <template #icon>
              <setting-outlined />
            </template>
            站点管理
          </a-menu-item>
          <a-menu-item key="revenue" @click="handleMenuClick('/dashboard/revenue')">
            <template #icon>
              <bar-chart-outlined />
            </template>
            营收明细
          </a-menu-item>
          <a-menu-item key="distribution" @click="handleMenuClick('/dashboard/distribution')">
            <template #icon>
              <team-outlined />
            </template>
            分销明细
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 移动端 Drawer -->
      <a-drawer
        v-model:open="mobileDrawerOpen"
        placement="left"
        :width="280"
        :close-icon="null"
        class="mobile-drawer"
      >
        <template #header>
          <div class="drawer-logo">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307c160'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" alt="logo" />
            <span>分销系统</span>
          </div>
        </template>
        <a-menu v-model:selectedKeys="selectedKeys" mode="vertical" class="menu">
          <a-menu-item key="overview" @click="handleMenuClick('/dashboard/overview')">
            <template #icon>
              <home-outlined />
            </template>
            商户主页
          </a-menu-item>
          <a-menu-item key="site-manage" @click="handleMenuClick('/dashboard/site-manage')">
            <template #icon>
              <setting-outlined />
            </template>
            站点管理
          </a-menu-item>
          <a-menu-item key="revenue" @click="handleMenuClick('/dashboard/revenue')">
            <template #icon>
              <bar-chart-outlined />
            </template>
            营收明细
          </a-menu-item>
          <a-menu-item key="distribution" @click="handleMenuClick('/dashboard/distribution')">
            <template #icon>
              <team-outlined />
            </template>
            分销明细
          </a-menu-item>
        </a-menu>
      </a-drawer>

      <a-layout>
        <!-- 顶部导航 -->
        <a-layout-header class="header">
          <div class="header-left">
            <!-- 移动端菜单按钮 -->
            <span class="trigger mobile-trigger" @click="mobileDrawerOpen = true" v-if="isMobile">
              <menu-unfold-outlined />
            </span>
            <!-- 桌面端折叠按钮 -->
            <span class="trigger" @click="collapsed = !collapsed" v-else>
              <menu-unfold-outlined v-if="collapsed" />
              <menu-fold-outlined v-else />
            </span>
            <span class="page-title">{{ route.meta.title }}</span>
          </div>
          <div class="header-right">
            <a-dropdown>
              <a class="user-dropdown" @click.prevent>
                <a-avatar size="small" :style="{ backgroundColor: '#07c160' }">
                  <template #icon><user-outlined /></template>
                </a-avatar>
                <span class="user-name" :class="{ 'mobile-hidden': isMobile }">{{ authStore.user?.username || authStore.user?.name }}</span>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>

        <!-- 主内容区 -->
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { logout as logoutApi } from '@/api/auth'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = ref(['overview'])
const mobileDrawerOpen = ref(false)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    collapsed.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(() => route.path, (newPath) => {
  const pathMap = {
    '/dashboard/overview': 'overview',
    '/dashboard/site-manage': 'site-manage',
    '/dashboard/revenue': 'revenue',
    '/dashboard/distribution': 'distribution',
    '/dashboard/site-setup': 'site-setup'
  }
  selectedKeys.value = [pathMap[newPath] || 'overview']
  // 移动端路由变化后关闭 drawer
  if (isMobile.value) {
    mobileDrawerOpen.value = false
  }
}, { immediate: true })

const handleMenuClick = (path) => {
  router.push(path)
  if (isMobile.value) {
    mobileDrawerOpen.value = false
  }
}

const handleLogout = async () => {
  try {
    await logoutApi()
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    authStore.logout()
    message.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
}

.sidebar {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar.mobile-hidden {
  display: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  font-size: 18px;
  font-weight: 600;
  color: #07c160;
  border-bottom: 1px solid #f0f0f0;
}

.logo img {
  width: 32px;
  height: 32px;
}

.menu {
  border-right: none;
}

.menu :deep(.ant-menu-item) {
  margin: 4px 8px;
  border-radius: 8px;
}

.menu :deep(.ant-menu-item-selected) {
  background-color: #e6f7ed;
  color: #07c160;
}

.menu :deep(.ant-menu-item:hover) {
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trigger:hover {
  color: #07c160;
}

.mobile-trigger {
  padding: 8px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}

.user-name {
  color: #333;
}

.user-name.mobile-hidden {
  display: none;
}

.content {
  margin: 16px;
  padding: 16px;
  background: #f5f5f5;
  min-height: calc(100vh - 112px);
  border-radius: 12px;
}

.mobile-drawer :deep(.ant-drawer-body) {
  padding: 0;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #07c160;
}

.drawer-logo img {
  width: 32px;
  height: 32px;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .content {
    margin: 8px;
    padding: 12px;
    border-radius: 8px;
  }

  .header {
    padding: 0 12px;
  }

  .page-title {
    font-size: 14px;
  }
}
</style>

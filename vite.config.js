import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      host: true,
      // 代理配置（开发环境使用）
      proxy: env.VITE_ENABLE_MOCK === 'true' ? {} : {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      // 生产环境配置
      outDir: 'dist',
      assetsDir: 'static',
      // 是否生成 source map
      sourcemap: mode === 'development',
      // 代码分割
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                return 'vendor-vue'
              }
              if (id.includes('ant-design-vue') || id.includes('@ant-design/icons-vue')) {
                return 'vendor-antd'
              }
              if (id.includes('echarts')) {
                return 'vendor-charts'
              }
            }
          }
        }
      },
      // 代码分割大小限制
      chunkSizeWarningLimit: 500
    },
    // 全局定义
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || '分销系统')
    }
  }
})

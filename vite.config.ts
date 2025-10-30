import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署配置
  // 如果是生产环境且有仓库名，使用 /repo-name/ 作为 base
  // 否则使用根路径 /
  base: './',
})

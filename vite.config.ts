import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署配置
  // 使用仓库名作为 base，确保资源路径正确
  base: '/codepulse-lite/',
})

# 部署指南

本指南将帮助你将 CodePulse Lite 部署到各种托管平台。

## 目录

- [Vercel 部署](#vercel-部署)
- [Netlify 部署](#netlify-部署)
- [GitHub Pages 部署](#github-pages-部署)
- [Docker 部署](#docker-部署)
- [环境变量配置](#环境变量配置)

---

## Vercel 部署

Vercel 是推荐的部署平台，提供最佳的开发体验和性能。

### 方法 1: 一键部署

点击下方按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/codepulse-lite)

### 方法 2: 通过 Vercel CLI

1. **安装 Vercel CLI**

```bash
npm install -g vercel
```

2. **登录 Vercel**

```bash
vercel login
```

3. **部署项目**

```bash
# 初次部署
vercel

# 生产部署
vercel --prod
```

### 方法 3: 通过 Git 集成

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量（可选）：
   - `VITE_GITHUB_TOKEN`: 你的 GitHub Token
6. 点击 "Deploy"

### Vercel 环境变量配置

在 Vercel 项目设置中添加环境变量：

1. 进入项目设置 → Environment Variables
2. 添加变量：
   - **Name**: `VITE_GITHUB_TOKEN`
   - **Value**: 你的 GitHub Personal Access Token
   - **Environment**: Production, Preview, Development
3. 重新部署项目以应用更改

---

## Netlify 部署

### 方法 1: 一键部署

点击下方按钮一键部署：

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/codepulse-lite)

### 方法 2: 通过 Netlify CLI

1. **安装 Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **登录 Netlify**

```bash
netlify login
```

3. **初始化并部署**

```bash
# 初始化站点
netlify init

# 部署
netlify deploy

# 生产部署
netlify deploy --prod
```

### 方法 3: 通过 Git 集成

1. 访问 [Netlify](https://app.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 Git 提供商并授权
4. 选择你的仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 添加环境变量（可选）：
   - Key: `VITE_GITHUB_TOKEN`
   - Value: 你的 GitHub Token
7. 点击 "Deploy site"

### Netlify 配置文件

项目已包含 `netlify.toml` 配置文件，包含：

- 构建配置
- 重定向规则（SPA 支持）
- 安全头部
- 资源缓存策略

---

## GitHub Pages 部署

### 配置步骤

1. **更新 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/codepulse-lite/', // 替换为你的仓库名
})
```

2. **创建部署脚本**

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **安装 gh-pages**

```bash
npm install --save-dev gh-pages
```

4. **部署**

```bash
npm run deploy
```

5. **配置 GitHub Pages**

- 进入仓库 Settings → Pages
- Source 选择 `gh-pages` 分支
- 等待几分钟后访问: `https://yourusername.github.io/codepulse-lite/`

### 使用 GitHub Actions 自动部署

项目已包含 `.github/workflows/deploy.yml` 配置文件，推送到 `main` 分支时会自动部署。

需要在 GitHub 仓库设置中添加以下 Secrets：

- `VITE_GITHUB_TOKEN`: 你的 GitHub Token（可选）

---

## Docker 部署

### 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头部
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

### 构建并运行

```bash
# 构建镜像
docker build -t codepulse-lite .

# 运行容器
docker run -p 80:80 codepulse-lite

# 带环境变量运行
docker run -p 80:80 -e VITE_GITHUB_TOKEN=your_token codepulse-lite
```

### 使用 Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

---

## 环境变量配置

### 必需的环境变量

无必需环境变量，应用可以在不配置的情况下运行。

### 可选的环境变量

| 变量名 | 描述 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token，用于提高 API 限额 | 无 | 否 |

### 如何获取 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置 Token 名称（如：codepulse-lite）
4. **不需要选择任何权限**（公开访问即可）
5. 点击 "Generate token"
6. 复制生成的 Token

### API 限额对比

| 认证方式 | 每小时请求限制 |
|----------|----------------|
| 未认证 | 60 次 |
| 使用 Token | 5000 次 |

---

## 常见问题

### 1. 构建失败：内存不足

**解决方案**: 增加 Node.js 内存限制

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

或在 `package.json` 中修改构建脚本：

```json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
  }
}
```

### 2. 部署后环境变量不生效

**原因**: Vite 只在构建时注入环境变量。

**解决方案**: 
- 确保环境变量以 `VITE_` 开头
- 在部署平台配置环境变量后重新部署
- 检查 `.env` 文件是否被 `.gitignore` 忽略

### 3. SPA 路由 404 错误

**原因**: 服务器没有正确配置 SPA 路由重定向。

**解决方案**:
- Vercel/Netlify: 自动处理
- 自托管: 使用提供的 `nginx.conf` 配置
- 确保所有路径都重定向到 `index.html`

### 4. API 限流错误

**原因**: 未配置 GitHub Token，使用公开 API 有较低的限额。

**解决方案**: 
- 配置 `VITE_GITHUB_TOKEN` 环境变量
- 等待限流重置（通常1小时）
- 应用会自动显示限流提示和解决方案

---

## 性能优化建议

### 1. 启用 Gzip/Brotli 压缩

大多数托管平台默认启用，自托管时需要配置服务器。

### 2. 配置 CDN

- Vercel/Netlify 自带全球 CDN
- 自托管可以使用 Cloudflare 等 CDN 服务

### 3. 启用缓存

项目已配置静态资源缓存策略：

- HTML: 无缓存
- JS/CSS: 1年强缓存（带哈希）

### 4. 监控和分析

推荐工具：

- [Vercel Analytics](https://vercel.com/analytics)
- [Google Analytics](https://analytics.google.com/)
- [Plausible](https://plausible.io/)

---

## 支持

如果在部署过程中遇到问题：

1. 查看 [常见问题](#常见问题) 部分
2. 搜索或提交 [GitHub Issues](https://github.com/yourusername/codepulse-lite/issues)
3. 查阅平台官方文档：
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com/)
   - [GitHub Pages Docs](https://docs.github.com/pages)

---

**祝部署顺利！** 🚀

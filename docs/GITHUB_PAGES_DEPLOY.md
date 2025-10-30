# GitHub Pages 部署指南

## 🚀 快速部署

### 方法 1: 自动部署（推荐）

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/codepulse-lite.git

# 添加所有文件
git add .

# 提交
git commit -m "feat: initial commit with GitHub Pages deployment"

# 推送到 main 分支
git push -u origin main
```

#### 步骤 2: 启用 GitHub Pages

1. 访问你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Source** 中选择：**GitHub Actions**
4. 保存设置

#### 步骤 3: 触发部署

推送代码后，GitHub Actions 会自动：
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 部署到 GitHub Pages

查看部署状态：
- 仓库页面 → **Actions** 标签
- 查看 "Deploy to GitHub Pages" 工作流

#### 步骤 4: 访问网站

部署成功后，访问：
```
https://你的用户名.github.io/codepulse-lite/
```

---

### 方法 2: 手动部署

如果不想使用 GitHub Actions：

```bash
# 1. 构建项目
npm run build

# 2. 进入构建目录
cd dist

# 3. 初始化 Git 并推送到 gh-pages 分支
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:你的用户名/codepulse-lite.git main:gh-pages

# 4. 返回项目根目录
cd ..
```

然后在 GitHub Settings → Pages 中：
- **Source**: Deploy from a branch
- **Branch**: gh-pages / (root)

---

## ⚙️ 配置说明

### Vite 配置

已在 `vite.config.ts` 中配置：

```typescript
export default defineConfig({
  plugins: [react()],
  base: './',  // 使用相对路径，适用于子目录部署
})
```

### GitHub Actions 工作流

文件位置：`.github/workflows/deploy-pages.yml`

**触发条件**：
- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**权限设置**：
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**构建步骤**：
1. Checkout 代码
2. 设置 Node.js 20
3. 安装依赖（npm ci）
4. 构建项目（npm run build）
5. 上传构建产物
6. 部署到 GitHub Pages

---

## 🔧 自定义域名（可选）

### 添加自定义域名

1. 在项目根目录创建 `public/CNAME` 文件：

```bash
echo "your-domain.com" > public/CNAME
```

2. 在域名提供商处添加 DNS 记录：

**A 记录**（指向 GitHub Pages）：
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

或

**CNAME 记录**：
```
你的用户名.github.io
```

3. 在 GitHub Settings → Pages 中：
- 输入自定义域名
- 等待 DNS 检查通过
- 启用 "Enforce HTTPS"

---

## 🐛 常见问题

### 问题 1: 页面 404

**原因**：base 路径配置错误

**解决**：
- 确认 `vite.config.ts` 中 `base: './'`
- 或者设置为 `base: '/仓库名/'`

### 问题 2: 资源加载失败

**原因**：资源路径不正确

**解决**：
- 使用相对路径 `base: './'`
- 检查构建输出中的资源路径

### 问题 3: GitHub Token 配置

**注意**：GitHub Pages 部署的应用无法读取环境变量

**解决**：
- 使用应用内 Token 配置功能（已实现）
- 用户在浏览器中配置自己的 Token
- Token 保存在 LocalStorage

### 问题 4: Actions 部署失败

**原因**：权限不足

**解决**：
1. 仓库 Settings → Actions → General
2. 找到 "Workflow permissions"
3. 选择 "Read and write permissions"
4. 保存

### 问题 5: 构建失败

**检查**：
```bash
# 本地测试构建
npm run build

# 检查构建产物
ls -la dist/
```

---

## 📊 部署验证清单

部署前检查：

- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已启用（Settings → Pages）
- [ ] Source 设置为 "GitHub Actions"
- [ ] Actions 权限已配置
- [ ] 工作流文件存在（`.github/workflows/deploy-pages.yml`）

部署后验证：

- [ ] Actions 工作流运行成功
- [ ] GitHub Pages 显示已部署
- [ ] 网站可以正常访问
- [ ] 资源加载正常（CSS、JS、图片）
- [ ] API 调用正常
- [ ] Token 配置功能可用

---

## 🔄 更新部署

每次更新代码后：

```bash
# 1. 提交更改
git add .
git commit -m "feat: 新功能描述"

# 2. 推送到 GitHub
git push origin main

# 3. 自动触发部署
# GitHub Actions 会自动构建和部署
```

查看部署进度：
- 仓库 → Actions 标签
- 等待绿色 ✓ 表示成功

---

## 🎯 性能优化

### 启用 Gzip 压缩

GitHub Pages 自动启用 Gzip 压缩。

### CDN 加速

GitHub Pages 使用全球 CDN，自动优化。

### 缓存策略

在 `public` 目录添加 `_headers` 文件（GitHub Pages 不支持）

或使用 Service Worker（需要额外配置）

---

## 📈 监控部署

### 查看部署历史

1. 仓库 → Environments → github-pages
2. 查看所有部署记录
3. 点击查看详情

### 查看构建日志

1. 仓库 → Actions
2. 选择工作流运行
3. 展开步骤查看详细日志

### 回滚部署

如果需要回滚到之前的版本：

```bash
# 1. 查看提交历史
git log --oneline

# 2. 回滚到指定提交
git revert <commit-hash>

# 3. 推送
git push origin main

# 4. 自动触发重新部署
```

---

## 🔐 安全建议

1. **不要在代码中硬编码 Token**
   - ✅ 使用应用内配置（已实现）
   - ✅ Token 保存在用户浏览器本地

2. **启用 HTTPS**
   - GitHub Pages 自动启用
   - 自定义域名需手动启用

3. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

---

## 📚 相关链接

- [GitHub Pages 文档](https://docs.github.com/pages)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [自定义域名设置](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## ✅ 快速命令参考

```bash
# 初始化并推送到 GitHub
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/codepulse-lite.git
git push -u origin main

# 本地测试构建
npm run build
npx vite preview

# 查看构建产物
ls dist/

# 强制重新部署
git commit --allow-empty -m "chore: trigger deployment"
git push
```

---

**部署状态**: ⏳ 等待首次部署  
**预计用时**: 2-5 分钟  
**部署地址**: `https://你的用户名.github.io/codepulse-lite/`

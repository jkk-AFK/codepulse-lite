# API 限流状态显示为 0 的解决方案

## 🔍 问题诊断

如果 API 限流状态始终显示为 **0 / 0**，可能是以下原因：

### 1. 网络问题 ❌
**症状**：显示"API 状态异常"或"获取限流信息失败"

**解决方案**：
- 检查网络连接
- 检查防火墙设置
- 尝试访问 https://api.github.com 确认可达
- 使用 VPN 或代理（如果在受限网络环境）

### 2. GitHub API 响应异常 ⚠️
**症状**：页面加载正常，但限流数据为 0

**解决方案**：
- 打开浏览器开发者工具（F12）
- 查看 Console 标签页中的错误信息
- 查看 Network 标签页检查 API 请求
- 查找 `rate_limit` 相关的请求

### 3. 未配置 Token（正常情况）✅
**症状**：显示 "60 / 60" 或较小的数值

**说明**：这是正常的！未认证用户限额为 60次/小时

**优化方案**：配置 GitHub Token 提升至 5000次/小时

---

## ✅ 配置 GitHub Token（推荐）

### 步骤 1: 生成 Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置 Token 名称（如：`codepulse-lite`）
4. **无需选择任何权限**（保持默认即可）
5. 点击底部的 **Generate token**
6. **立即复制** Token（只显示一次！）

### 步骤 2: 配置到项目

```bash
# 在项目根目录创建 .env 文件
cd c:\Users\Administrator\Desktop\files\codeg\10.30\codepulse-lite

# 复制模板
copy .env.example .env

# 编辑 .env 文件
notepad .env
```

将内容修改为：
```env
VITE_GITHUB_TOKEN=ghp_你的Token
```

### 步骤 3: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 步骤 4: 验证配置

刷新页面后，应该看到：
- **未配置前**: 0/60 或 60/60
- **配置成功后**: xxxx/5000

---

## 🔧 技术细节

### API 数据结构

GitHub Rate Limit API 返回的数据结构：

```json
{
  "resources": {
    "core": {
      "limit": 5000,
      "remaining": 4999,
      "reset": 1730275200,
      "used": 1
    }
  }
}
```

### 代码实现

```typescript
// src/services/github.ts
async getRateLimit(): Promise<RateLimit> {
  const { data } = await this.octokit.rateLimit.get();
  
  // 优先使用 data.resources.core
  const rateData = data.resources?.core || data.rate;
  
  return {
    limit: rateData.limit,      // 总限额
    remaining: rateData.remaining, // 剩余请求数
    reset: rateData.reset,       // 重置时间戳
    used: rateData.used,         // 已使用数
  };
}
```

### 显示逻辑

```typescript
// src/components/RateLimitStatus.tsx

// 1. 如果 limit === 0，显示"API 状态异常"
if (rateLimit.limit === 0) {
  return <ErrorMessage />;
}

// 2. 如果 limit === 60，显示"未认证"提示
if (rateLimit.limit === 60) {
  return <UnauthenticatedWarning />;
}

// 3. 正常显示限流状态
return <RateLimitDisplay />;
```

---

## 🐛 调试方法

### 浏览器控制台调试

打开开发者工具（F12），在 Console 中运行：

```javascript
// 查看当前配置
console.log('Token:', import.meta.env.VITE_GITHUB_TOKEN ? '已配置' : '未配置');

// 手动测试 API
fetch('https://api.github.com/rate_limit')
  .then(r => r.json())
  .then(data => console.log('Rate Limit:', data));
```

### 检查 Network 请求

1. 打开 Network 标签
2. 刷新页面
3. 查找 `rate_limit` 请求
4. 检查响应状态码和数据

**正常响应**：
- 状态码：200
- 响应中包含 `resources.core` 对象

**异常响应**：
- 状态码：403（被限流）
- 状态码：401（认证失败）
- 状态码：0（网络错误）

---

## ⚠️ 常见错误

### 错误 1: Token 无效

**症状**：配置 Token 后仍显示 60/60

**原因**：
- Token 格式错误（应以 `ghp_` 开头）
- Token 已过期或被删除
- 环境变量名称错误（必须是 `VITE_GITHUB_TOKEN`）

**解决**：
- 重新生成 Token
- 检查 `.env` 文件格式
- 确保没有多余的空格或引号

### 错误 2: 环境变量未生效

**症状**：配置后没有变化

**原因**：未重启开发服务器

**解决**：
```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 错误 3: CORS 错误

**症状**：Console 显示 CORS 相关错误

**原因**：GitHub API 的 CORS 策略

**解决**：
- 确保使用的是 `https://api.github.com`
- 不要使用浏览器扩展拦截请求
- 检查代理设置

---

## 📊 限额说明

| 认证状态 | 限额 | 说明 |
|---------|------|------|
| 未认证 | 60次/小时 | 基于 IP 地址 |
| 已认证（Token） | 5000次/小时 | 基于用户账号 |
| 已认证（OAuth） | 5000次/小时 | 基于用户账号 |

### 限额消耗

CodePulse 每次完整分析消耗的 API 请求：
- 获取仓库信息：1 次
- 获取提交记录：1 次
- 获取贡献者：1 次
- **总计：3 次请求/分析**

**未认证**：最多分析 **20 个仓库/小时**  
**已认证**：最多分析 **1666 个仓库/小时**

---

## ✅ 验证清单

完成以下检查确保配置正确：

- [ ] 网络可以访问 GitHub
- [ ] 已创建 `.env` 文件
- [ ] Token 以 `ghp_` 开头
- [ ] 环境变量名是 `VITE_GITHUB_TOKEN`
- [ ] 已重启开发服务器
- [ ] 页面显示正确的限额（5000）
- [ ] 浏览器 Console 无错误

---

## 🆘 仍然无法解决？

1. **检查完整错误日志**
   ```bash
   # 查看开发服务器输出
   # 查看浏览器 Console
   ```

2. **尝试清除缓存**
   ```javascript
   // 在浏览器 Console 运行
   localStorage.clear();
   location.reload();
   ```

3. **验证 Token 权限**
   ```bash
   curl -H "Authorization: token ghp_你的Token" \
     https://api.github.com/rate_limit
   ```

4. **提交 Issue**
   - 包含完整错误信息
   - 说明操作步骤
   - 附上截图

---

**最后更新**: 2025-10-30  
**适用版本**: v2.0+

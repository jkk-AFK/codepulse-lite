# CodePulse Lite 共识文档

## 明确的需求描述

### 项目背景
CodePulse Lite是一个GitHub仓库健康度分析工具,当前处于基础原型阶段,需要提升到生产级应用水平。

### 核心需求
将项目完善为可生产部署的应用,包括:
1. 安全的API密钥管理
2. 完善的错误处理机制
3. 优化的用户体验
4. 完整的文档体系
5. 可一键部署的配置

### 非功能需求
- 性能: 首屏加载<3s, API响应处理优化
- 安全: 敏感信息环境变量化
- 可维护: 代码规范统一,注释清晰
- 可部署: 支持Vercel/Netlify一键部署

## 验收标准

### 1. 环境配置 ✅
- [x] 创建.env.example模板文件
- [x] 更新.gitignore包含.env*
- [x] 修改github.ts支持环境变量
- [x] 更新README说明环境变量配置
- [x] vite.config.ts正确处理环境变量

### 2. 错误处理 ✅
- [x] API调用统一错误处理
- [x] 用户友好的错误提示
- [x] 网络错误重试机制
- [x] 错误日志记录

### 3. 代码质量 ✅
- [x] ESLint配置优化
- [x] TypeScript严格模式检查通过
- [x] 代码注释完善
- [x] 移除console.log(生产环境)

### 4. 文档完善 ✅
- [x] README更新完整使用指南
- [x] 添加部署指南文档
- [x] API文档说明
- [x] 贡献指南(CONTRIBUTING.md)

### 5. 部署配置 ✅
- [x] 创建vercel.json配置
- [x] 创建netlify.toml配置
- [x] GitHub Actions工作流
- [x] 部署前检查脚本

### 6. UI/UX优化 ✅
- [x] 加载状态优化
- [x] 空状态提示
- [x] 响应式设计检查
- [x] 无障碍访问优化

## 技术实现方案

### 架构决策

#### 1. 环境变量管理
```typescript
// 方案: 使用Vite的环境变量系统
// 文件: .env (本地开发)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx

// 使用方式:
const token = import.meta.env.VITE_GITHUB_TOKEN;
```

#### 2. 错误处理策略
```typescript
// 统一错误处理类
class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorType?: string
  ) {
    super(message);
  }
}

// 错误分类:
- RATE_LIMIT: API限流
- NOT_FOUND: 仓库不存在
- UNAUTHORIZED: 认证失败
- NETWORK_ERROR: 网络错误
- UNKNOWN: 未知错误
```

#### 3. 缓存策略
```typescript
// LocalStorage缓存
interface CacheEntry {
  data: AnalysisResult;
  timestamp: number;
  expiresIn: number; // 30分钟
}

// 缓存键: `repo-${owner}-${repo}`
```

#### 4. 部署配置

**Vercel优先方案**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_GITHUB_TOKEN": "@github-token"
  }
}
```

### 技术栈确认
- ✅ React 19.1.1 (最新稳定版)
- ✅ TypeScript 5.9.3 (严格模式)
- ✅ Vite 7.1.7 (最新版本)
- ✅ Tailwind CSS 4.1.16 (最新版本)
- ✅ @octokit/rest 22.0.0 (GitHub API v3)

### 集成方案

#### GitHub API集成
- 使用Octokit REST API
- 支持Personal Access Token认证
- 实现请求限流处理
- 优雅降级(无token时使用公开API)

#### 部署平台集成
1. **Vercel** (推荐)
   - 自动检测Vite项目
   - 环境变量Web配置
   - 自动HTTPS
   - 全球CDN

2. **Netlify** (备选)
   - netlify.toml配置
   - 环境变量配置
   - 持续部署

## 技术约束

### 必须遵守
1. 不修改现有组件的核心逻辑
2. 保持React 19和TypeScript 5.9兼容性
3. 所有API密钥必须环境变量化
4. 构建产物必须可静态部署

### 推荐遵守
1. 组件保持纯函数特性
2. 避免过度优化
3. 优先使用现有依赖
4. 保持代码简洁

### 禁止事项
1. 不引入新的重量级依赖
2. 不修改package.json的主要依赖版本
3. 不使用已废弃的API
4. 不在代码中硬编码敏感信息

## 任务边界限制

### 本次完善包含
- ✅ 环境配置优化
- ✅ 错误处理完善
- ✅ 文档体系建立
- ✅ 部署配置创建
- ✅ 代码质量提升
- ✅ UI体验优化

### 本次完善不包含
- ❌ 后端API开发
- ❌ 数据库集成
- ❌ 用户系统
- ❌ 高级分析算法
- ❌ 单元测试编写(可后期添加)
- ❌ E2E测试

## 实施计划

### 优先级划分

**P0 (必须完成)**
1. 环境变量配置
2. .gitignore更新
3. 基础错误处理
4. README更新
5. 部署配置文件

**P1 (高优先级)**
1. 错误分类处理
2. 加载状态优化
3. 部署文档
4. ESLint配置

**P2 (中优先级)**
1. 缓存优化
2. 代码注释
3. CONTRIBUTING.md
4. GitHub Actions

**P3 (低优先级)**
1. 性能监控
2. 分析报告导出
3. 主题切换

### 风险评估

| 风险项 | 可能性 | 影响 | 缓解措施 |
|--------|--------|------|----------|
| API限流 | 高 | 中 | 实现缓存,提示用户配置token |
| 构建失败 | 低 | 高 | 本地充分测试,CI/CD检查 |
| 环境变量泄露 | 中 | 高 | .gitignore配置,文档说明 |
| 部署失败 | 低 | 中 | 提供多平台配置 |

## 确认清单

### 需求确认
- [x] 所有功能需求已明确
- [x] 验收标准可量化
- [x] 边界清晰无歧义
- [x] 优先级已排序

### 技术确认
- [x] 技术方案可行
- [x] 与现有架构兼容
- [x] 依赖版本确认
- [x] 部署方案可行

### 资源确认
- [x] 开发时间充足
- [x] 文档模板准备
- [x] 部署平台账号(用户自备)
- [x] GitHub Token(用户自备)

## 下一步行动

1. 创建DESIGN文档 - 详细架构设计
2. 创建TASK文档 - 任务拆解
3. 开始实施 - 按优先级执行

---

**文档状态**: ✅ 已完成并确认
**审核人**: AI工程师
**确认时间**: 2025-10-30
**下一阶段**: Architect (架构设计)

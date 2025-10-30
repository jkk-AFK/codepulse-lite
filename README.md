# CodePulse Lite 🚀

<div align="center">

![CodePulse Lite](https://img.shields.io/badge/CodePulse-Lite-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)

**智能分析 GitHub 仓库健康度的现代化 Web 应用**

[GitHub Pages](https://yourusername.github.io/codepulse-lite/) · [Vercel 演示](https://codepulse-lite.vercel.app) · [报告问题](https://github.com/yourusername/codepulse-lite/issues) · [部署指南](./docs/GITHUB_PAGES_DEPLOY.md)

</div>

---

## ✨ 特性

### 核心功能
- 🎯 **多维度评估** - 从代码质量、文档完整性、活跃度、社区参与和维护质量5个维度全面分析
- 📊 **可视化报告** - 直观的图表展示提交历史、贡献者分布、Issues和PR状态等关键数据
- ⚡ **即时分析** - 无需注册登录，输入仓库地址即可获得详细的健康度分析报告
- 💾 **智能缓存** - 自动缓存分析结果（30分钟），避免重复请求

### 新增高级功能 ⭐
- 📜 **历史记录管理** - 自动保存最近50条分析记录，快速重新访问
- 🌟 **仓库收藏** - 标记重要项目，快速定位常用仓库
- 🌓 **主题切换** - 支持深色/浅色两种主题模式，适应不同光线环境
- 📊 **API限流监控** - 实时显示 GitHub API 剩余请求数和重置时间
- 📥 **报告导出** - 一键导出 JSON 格式的完整分析报告
- 🔍 **仓库比较** - 同时比较最多5个仓库的健康度评分

### 技术特点
- 🎨 **现代化UI** - 基于 Tailwind CSS 的精美界面设计，支持响应式布局
- 🔒 **安全可靠** - 环境变量管理敏感信息，完善的错误处理机制
- ⚙️ **类型安全** - 完整的 TypeScript 类型定义，严格模式检查
- 🚀 **高性能** - Vite 构建，代码分割，按需加载

## 🎬 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/codepulse-lite.git
cd codepulse-lite
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量（可选但推荐）**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加你的 GitHub Token
# VITE_GITHUB_TOKEN=your_github_token_here
```

> 💡 **提示**: 配置 GitHub Token 可以提高 API 调用限额（从 60次/小时 提升到 5000次/小时）
> 
> 获取 Token: https://github.com/settings/tokens (不需要任何特殊权限)

4. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

5. **构建生产版本**

```bash
npm run build
```

构建产物将生成在 `dist` 目录

## 📖 使用指南

### 基本使用

1. 在搜索框中输入 GitHub 仓库地址（格式：`owner/repo`）
2. 点击"分析"按钮或按回车键
3. 等待几秒钟，即可看到详细的健康度分析报告

### 配置 GitHub Token

为了获得更好的体验和更高的 API 限额，建议配置 GitHub Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置 Token 名称（如：codepulse-lite）
4. **无需选择任何权限**（使用默认的公开访问权限即可）
5. 生成并复制 Token
6. 在项目根目录创建 `.env` 文件：

```env
VITE_GITHUB_TOKEN=ghp_your_token_here
```

7. 重启开发服务器

## 🏗️ 技术架构

### 技术栈

- **前端框架**: React 19.1.1
- **类型系统**: TypeScript 5.9.3
- **构建工具**: Vite 7.1.7
- **样式方案**: Tailwind CSS 4.1.16
- **API集成**: @octokit/rest 22.0.0
- **图表库**: Recharts 3.3.0
- **图标库**: Lucide React 0.548.0

### 项目结构

```
codepulse-lite/
├── src/
│   ├── components/      # React 组件
│   │   ├── Header.tsx           # 页面头部
│   │   ├── SearchBar.tsx        # 搜索框
│   │   ├── AnalysisReport.tsx   # 分析报告
│   │   ├── RepoCard.tsx         # 仓库信息卡片
│   │   ├── HealthRadar.tsx      # 健康度雷达图
│   │   ├── HistoryPanel.tsx     # ⭐ 历史记录面板
│   │   ├── ComparePanel.tsx     # ⭐ 仓库比较面板
│   │   ├── ThemeToggle.tsx      # ⭐ 主题切换按钮
│   │   ├── RateLimitStatus.tsx  # ⭐ API限流状态
│   │   └── ExportButton.tsx     # ⭐ 导出按钮
│   ├── services/        # API 服务层
│   │   └── github.ts    # GitHub API 封装
│   ├── utils/           # 工具函数
│   │   ├── cache.ts     # 缓存服务
│   │   └── error.ts     # 错误处理
│   ├── config/          # 配置文件
│   │   └── env.ts       # 环境变量配置
│   ├── constants/       # 常量定义
│   │   ├── api.ts       # API 常量
│   │   ├── cache.ts     # 缓存常量
│   │   └── messages.ts  # 错误消息
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx          # 应用根组件
│   └── main.tsx         # 应用入口
├── public/              # 静态资源
├── docs/                # 项目文档
│   └── 项目完善/
│       ├── ENHANCEMENT_功能优化.md  # ⭐ 新功能文档
│       ├── USER_GUIDE.md           # ⭐ 用户指南
│       └── ...其他文档
├── .github/             # GitHub 配置
│   └── workflows/       # CI/CD 工作流
└── ...配置文件

```

### 核心功能

#### 健康度评分算法

项目从5个维度评估仓库健康度：

1. **代码质量 (25%)**: 基于提交频率和贡献者数量
2. **文档完整性 (20%)**: README、License、描述、主题标签
3. **活跃度 (25%)**: 基于最后推送时间
4. **社区参与 (15%)**: Stars、Forks、贡献者数量
5. **维护质量 (15%)**: Issues 响应率

#### 缓存策略

- 分析结果缓存 30 分钟
- 搜索结果缓存 5 分钟
- 历史记录保留 50 条
- 使用 LocalStorage 实现客户端缓存

#### 错误处理

- 统一的错误分类和处理
- 用户友好的错误提示
- 特殊错误的解决方案引导
- 支持重试机制

## 🚀 部署指南

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/codepulse-lite)

### 快速部署到 Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/codepulse-lite)

## 🛠️ 开发指南

### 可用脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 ESLint 检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit
```

### 代码规范

项目使用 ESLint 和 TypeScript 严格模式确保代码质量：

```bash
# 运行代码检查
npm run lint

# 自动修复可修复的问题
npm run lint -- --fix
```

### 贡献指南

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情

## � 部署

### GitHub Pages（推荐）

一键部署到 GitHub Pages，完全免费：

```bash
# 1. 推送代码到 GitHub
git push origin main

# 2. 在 GitHub 仓库设置中启用 Pages
# Settings → Pages → Source → GitHub Actions

# 3. 访问你的网站
# https://你的用户名.github.io/codepulse-lite/
```

详细步骤查看：[GitHub Pages 部署指南](./docs/GITHUB_PAGES_DEPLOY.md)

### Vercel / Netlify

也支持一键部署到 Vercel 或 Netlify，配置文件已包含：
- `vercel.json` - Vercel 配置
- `netlify.toml` - Netlify 配置

---

## �🙏 致谢

- [GitHub API](https://docs.github.com/rest) - 提供强大的 API 支持
- [Octokit](https://github.com/octokit/octokit.js) - 优雅的 GitHub API 客户端
- [React](https://react.dev/) - 构建用户界面的 JavaScript 库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/yourusername/codepulse-lite/issues)
- 发送邮件至: your.email@example.com
- 访问作者 GitHub: [@jkk-AFK](https://github.com/jkk-AFK)

---

<div align="center">

**⭐ 如果觉得这个项目有帮助，请给个 Star 支持一下！⭐**

Made with ❤️ by [jkk-AFK](https://github.com/jkk-AFK)

</div>

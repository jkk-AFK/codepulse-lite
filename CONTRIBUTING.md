# 贡献指南

感谢你对 CodePulse Lite 项目的关注！我们欢迎任何形式的贡献。

## 行为准则

参与本项目即表示你同意遵守我们的行为准则：

- 尊重所有参与者
- 接受建设性的批评
- 关注对社区最有利的事情
- 对他人表现出同理心

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/yourusername/codepulse-lite/issues) 提交报告。

**好的 Bug 报告应该包含**:

1. **清晰的标题** - 简明扼要地描述问题
2. **重现步骤** - 详细描述如何重现问题
3. **期望行为** - 说明你期望发生什么
4. **实际行为** - 说明实际发生了什么
5. **环境信息** - 浏览器版本、操作系统等
6. **截图或录屏**（如果适用）

**示例**:

```markdown
**标题**: 分析私有仓库时出现403错误

**重现步骤**:
1. 打开应用
2. 输入私有仓库地址 "owner/private-repo"
3. 点击分析按钮

**期望行为**: 显示无权限访问的友好提示

**实际行为**: 显示通用的403错误

**环境**:
- 浏览器: Chrome 120.0.0
- 操作系统: Windows 11
- 是否配置Token: 否
```

### 建议新功能

我们欢迎功能建议！请通过 [GitHub Issues](https://github.com/yourusername/codepulse-lite/issues) 提交。

**好的功能建议应该包含**:

1. **问题描述** - 你想解决什么问题？
2. **建议方案** - 你的解决方案是什么？
3. **替代方案** - 还有其他可行的方案吗？
4. **使用场景** - 谁会使用这个功能？

### 提交代码

#### 开发流程

1. **Fork 项目**

点击 GitHub 页面右上角的 "Fork" 按钮。

2. **克隆到本地**

```bash
git clone https://github.com/your-username/codepulse-lite.git
cd codepulse-lite
```

3. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `style/` - 代码格式调整
- `refactor/` - 代码重构
- `perf/` - 性能优化
- `test/` - 测试相关

4. **安装依赖**

```bash
npm install
```

5. **开发和测试**

```bash
# 启动开发服务器
npm run dev

# 运行代码检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit

# 构建测试
npm run build
```

6. **提交更改**

```bash
git add .
git commit -m "feat: add awesome feature"
```

提交信息规范（遵循 [Conventional Commits](https://www.conventionalcommits.org/)）：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响代码运行）
- `refactor:` - 重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具的变动

**示例**:

```bash
feat: add GitHub star history chart
fix: resolve API rate limit error handling
docs: update installation instructions
style: format code with prettier
refactor: extract error handling logic
perf: implement request caching
test: add unit tests for cache service
chore: update dependencies
```

7. **推送到 GitHub**

```bash
git push origin feature/your-feature-name
```

8. **创建 Pull Request**

- 前往你 Fork 的仓库页面
- 点击 "Pull Request" 按钮
- 选择你的分支
- 填写 PR 描述（使用模板）
- 提交 Pull Request

#### Pull Request 指南

**PR 标题**: 遵循提交信息规范

**PR 描述应包含**:

```markdown
## 更改类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性更改
- [ ] 文档更新

## 更改内容
简要描述你的更改...

## 相关 Issue
Closes #123

## 测试
说明你如何测试这些更改...

## 截图（如适用）
添加截图帮助审查者理解更改...

## 检查清单
- [ ] 代码遵循项目风格指南
- [ ] 已运行 `npm run lint` 且无错误
- [ ] 已运行 `npm run build` 且构建成功
- [ ] 已测试所有更改
- [ ] 已更新相关文档
- [ ] 提交信息遵循规范
```

#### 代码规范

1. **TypeScript**
   - 使用严格模式
   - 为所有函数添加类型注解
   - 避免使用 `any`（除非必要）
   - 使用接口定义数据结构

2. **React**
   - 使用函数组件和 Hooks
   - 组件文件使用 PascalCase 命名
   - Props 使用接口定义类型
   - 避免内联样式

3. **代码风格**
   - 使用 2 空格缩进
   - 使用单引号（字符串）
   - 语句末尾不加分号（遵循项目配置）
   - 运行 `npm run lint` 检查

4. **注释**
   - 复杂逻辑添加注释说明
   - 公共 API 使用 JSDoc 注释
   - 避免无意义的注释

**示例**:

```typescript
/**
 * 分析 GitHub 仓库健康度
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns 分析结果
 * @throws {APIError} 当 API 调用失败时
 */
async function analyzeRepository(
  owner: string, 
  repo: string
): Promise<AnalysisResult> {
  // 实现逻辑...
}
```

#### 测试

虽然项目当前没有测试套件，但我们鼓励：

- 手动测试所有更改
- 测试边界情况
- 测试错误处理
- 在不同浏览器测试

将来可能会添加：

- 单元测试（Vitest）
- 组件测试（React Testing Library）
- E2E 测试（Playwright）

## 开发环境设置

### 推荐的 IDE 配置

**VS Code** + 以下扩展:

- ESLint
- TypeScript
- Tailwind CSS IntelliSense
- Prettier
- GitLens

**WebStorm** / **其他 JetBrains IDE**:

- 内置支持良好，开箱即用

### 调试技巧

1. **使用浏览器开发者工具**
   - Chrome DevTools
   - React Developer Tools

2. **VS Code 调试配置**

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 项目维护

### Release 流程

1. 更新版本号（`package.json`）
2. 更新 CHANGELOG.md
3. 创建 Git tag
4. 推送到 GitHub
5. 创建 GitHub Release

### 依赖更新

定期检查和更新依赖：

```bash
# 检查过期依赖
npm outdated

# 更新依赖
npm update

# 更新到最新版本（谨慎）
npx npm-check-updates -u
npm install
```

## 获取帮助

如果有任何疑问：

- 查看 [README.md](./README.md)
- 查看 [DEPLOYMENT.md](./DEPLOYMENT.md)
- 搜索现有的 [Issues](https://github.com/yourusername/codepulse-lite/issues)
- 创建新的 Issue 提问

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！ 🎉

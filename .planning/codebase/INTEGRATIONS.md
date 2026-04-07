# 外部集成

**分析日期：** 2026-04-07

## API 和外部服务

**HTTP/REST API：**
- **基于 Axios 的 HTTP 客户端** - 可配置的 HTTP 客户端，位于 `src/utils/http.ts`
  - 支持自定义基础 URL
  - 内置请求/响应拦截器
  - 支持自定义回调的错误处理
  - CSRF token 支持（基于 meta 标签或 cookie）
  - Inertia.js 响应兼容性

**HTTP 客户端配置：**
```typescript
// 位置：src/utils/http.ts、src/hooks/use-http.ts
interface HttpOptions {
  baseUrl?: string           // API 基础路径
  disabledError?: boolean    // 禁用全局错误通知
  onError?: (message, error) => void     // 错误处理器回调
  onUnauthorized?: (error) => void       // 401 处理器回调
}
```

## 数据存储

**数据库：**
- 不适用 - 这是 UI 组件库，没有直接的数据库连接

**文件存储：**
- 仅本地文件系统 - 构建输出到 `dist/` 目录

**缓存：**
- 未检测到 - 没有 Redis、localStorage 或其他缓存机制

**状态管理：**
- 用于组件级状态的 React Context API
  - `src/components/search/context/` 中的 `SearchContext`
  - `src/components/provider/context.ts` 中的 `NewbieContext`

## 认证与身份

**认证提供者：**
- 通过 HTTP 客户端拦截器的自定义实现
- 支持：
  - 从 meta 标签提取 CSRF token（`<meta name="csrf-token">`）
  - Laravel 风格的 XSRF-TOKEN cookie 支持
  - 通过 `onUnauthorized` 回调处理 401 未授权
  - 403 禁止访问处理

## 监控与可观测性

**错误跟踪：**
- 无 - 仅通过 `onError` 回调进行自定义错误处理

**日志：**
- 基于 Console 的日志（仅开发环境）
- 没有外部日志服务集成

## CI/CD 与部署

**托管：**
- NPM Registry（公共）
  - 配置：`registry.npmjs.org`
  - 发布为 `@jobsys/newbie-next`

**CI 流水线：**
- GitHub Actions（目录存在：`.github/`）
- 使用 Changesets 进行自动化版本控制和发布

**发布流程：**
```bash
pnpm build && changeset publish
```

**构建产物：**
- 输出目录：`dist/`
- 文件：`dist/index.js`、`dist/index.d.ts`、`dist/styles.css`

## 环境配置

**必需的环境变量：**
- 库本身不需要
- 环境特定的配置通过 `NewbieProvider` 或 HTTP 客户端设置传递

**配置模式：**
```typescript
// 通过 NewbieProvider 进行全局配置
<NewbieProvider config={{ theme, httpClient, componentDefaults }}>
  <App />
</NewbieProvider>
```

## Webhooks 与回调

**传入：**
- 无 - 这是客户端库

**传出：**
- 无 - 库不发起 webhook 调用

## 第三方服务集成

**图标库：**
- **Lucide React** - 现代图标集（`lucide-react`）
- **Ant Design Icons** - Ant Design 的图标库（`@ant-design/icons`）

**日期/时间：**
- **Day.js** - 带插件的日期处理：
  - `weekday` 插件
  - `localeData` 插件

**拖拽：**
- **@dnd-kit** - 现代拖拽工具包

## 部署依赖

**构建时：**
- Vite 8.0.5
- TypeScript 6.0.2
- Rollup（通过 Vite）

**运行时（peer dependencies）：**
- React ^18.0.0 || ^19.0.0
- React DOM ^18.0.0 || ^19.0.0
- Ant Design ^5.0.0 || ^6.0.0
- @ant-design/pro-components ^2.0.0 || ^3.0.0

---

*集成审计：2026-04-07*

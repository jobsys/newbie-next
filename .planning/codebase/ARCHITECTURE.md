# 架构设计

**分析日期：** 2025-04-07

## 模式概览

**整体架构：** 组件库 + Provider 模式 + 基于 Context 的状态管理

**主要特点：**
- 扩展 Ant Design Pro Components 的 React 组件库
- 基于 Provider 的全局配置和主题管理
- 复杂组件（搜索）使用 Context 进行状态管理
- 可组合的组件架构与 Hooks
- Barrel 文件模式实现简洁导出
- TypeScript 优先，全面的类型定义

## 分层架构

**组件层（Component Layer）：**
- 目的：扩展 Ant Design 功能的 UI 组件
- 位置：`src/components/`
- 包含：React JSX 组件，通过 Ant Design tokens 进行样式设置
- 依赖：工具层、Hooks 层、类型层
- 使用者：消费应用程序

**Context 层：**
- 目的：通过 React Context API 进行状态管理
- 位置：`src/components/*/context/`
- 包含：Context Provider 和用于组件状态的 Hooks
- 依赖：React Context API
- 使用者：组件层

**Hooks 层：**
- 目的：可复用的 React Hooks，用于 HTTP、验证和组件逻辑
- 位置：`src/hooks/`
- 包含：自定义 Hooks（useHttp、useRegex）
- 依赖：工具层（HTTP 客户端）
- 使用者：组件层、消费应用程序

**工具层：**
- 目的：工具函数和 HTTP 客户端
- 位置：`src/utils/`
- 包含：HTTP 客户端、深度合并、classNames
- 依赖：Axios、外部依赖
- 使用者：组件层、Hooks 层

**类型层：**
- 目的：共享 TypeScript 类型定义
- 位置：`src/types/`
- 包含：基础接口、通用类型
- 依赖：无
- 使用者：所有层

## 数据流

**搜索组件数据流：**

1. Columns 配置传递给 `NewbieSearch`（`src/components/search/newbie-search.tsx`）
2. `SearchProvider` 从 columns 初始化查询和排序状态（`src/components/search/context/search-provider.tsx`）
3. 用户交互通过 context 触发 `updateFieldValue`
4. `SearchItem` 渲染带条件选择器的特定字段输入（`src/components/search/components/search-item.tsx`）
5. 提交操作过滤有效值并调用 `onSubmit` 回调
6. 通过 `@dnd-kit` 进行拖拽排序管理

**Provider 配置数据流：**

1. `NewbieProvider` 在应用根节点接受配置（`src/components/provider/newbie-provider.tsx`）
2. 使用 `deepMerge` 将配置与默认值合并（`src/utils/merge.ts`）
3. `useNewbieContext` 提供对 config 和 `mergeProps` 函数的访问（`src/components/provider/context.ts`）
4. 组件将 props 与 context 默认值合并

**HTTP 数据流：**

1. `createHttpClient` 创建配置的 Axios 实例（`src/utils/http.ts`）
2. 响应拦截器提取数据并处理 Laravel 风格响应
3. `useHttp` Hook 在组件中管理请求状态（`src/hooks/use-http.ts`）
4. 从 meta 标签或 cookies 自动提取 CSRF token

## 核心抽象

**NewbieProColumn：**
- 目的：搜索功能的扩展 ProTable 列类型
- 示例：`src/components/search/types.ts`
- 模式：扩展 `@ant-design/pro-components` 的 ProColumnType，添加搜索特定字段

**组件 Provider 模式：**
- 目的：全局配置和默认 Props 管理
- 示例：`src/components/provider/newbie-provider.tsx`
- 模式：基于 Context，支持嵌套配置的深度合并

**搜索 Context：**
- 目的：集中式搜索状态管理
- 示例：`src/components/search/context/search-provider.tsx`、`src/components/search/context/search-context.tsx`
- 模式：Context 的复合组件模式

**图标适配器：**
- 目的：将 Lucide 图标桥接到 Ant Design 图标系统
- 示例：`src/components/icon/newbie-icon.tsx`
- 模式：使用 `@ant-design/icons` 的 Icon 组件的包装组件

## 入口点

**库入口：**
- 位置：`src/index.ts`
- 触发：被消费应用程序导入
- 职责：导出所有公共组件、类型、Hooks 和工具

**组件入口：**
- `src/components/search/index.ts` - 搜索组件导出
- `src/components/provider/index.ts` - Provider 导出
- `src/components/icon/index.ts` - 图标组件导出
- `src/components/captcha/index.ts` - 验证码组件导出

**Playground 入口：**
- 位置：`playground/src/App.tsx`
- 触发：开发服务器（vite dev）
- 职责：组件展示和测试环境

## 错误处理

**策略：** 在 HTTP 客户端中集中处理，支持自定义回调

**模式：**
- HTTP 错误在响应拦截器中处理（`src/utils/http.ts`）
- 通过 `{ status: "SUCCESS", result: ... }` 模式检测业务逻辑错误
- 通过 `onError` 和 `onUnauthorized` 选项自定义错误处理器
- Context Hooks 在 Provider 外部使用时抛出错误

## 横切关注点

**日志：** SearchProvider 中选项加载失败的 Console.error 日志

**验证：** 通过 `useRegexRule` 进行正则验证规则（`src/hooks/use-regex.ts`）

**认证：** HTTP 客户端中的 CSRF token 处理；401/403 错误处理器

**样式：** 基于 Ant Design token 的样式，支持密度配置（loose/normal/compact）

**主题：** 通过 ConfigProvider 集成支持 light/dark 模式

---

*架构分析：2025-04-07*

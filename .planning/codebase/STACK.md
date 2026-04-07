# 技术栈

**分析日期：** 2026-04-07

## 编程语言

**主要语言：**
- **TypeScript 6.0.2** - 库的主要开发语言
- **TSX** - React 组件开发

**次要语言：**
- **JSON** - 配置文件
- **JavaScript** - Vite 配置（遗留 `.js` 文件）

## 运行环境

**环境：**
- **浏览器（DOM）** - 用于 Web 应用的 React 组件库
- **Node.js** - 构建工具和开发服务器

**包管理器：**
- **pnpm** - 用于依赖管理（通过 `pnpm-lock.yaml` 和预提交钩子确认）
- 锁定文件：`pnpm-lock.yaml` 存在

## 框架

**核心框架：**
- **React 19.2.4**（peer dependency: ^18.0.0 || ^19.0.0）- UI 组件库基础
- **React DOM 19.2.4** - DOM 渲染

**UI 框架：**
- **Ant Design (antd) 6.3.5**（peer dependency: ^5.0.0 || ^6.0.0）- 核心 UI 组件库
- **@ant-design/pro-components 3.1.2-0**（peer dependency: ^2.0.0 || ^3.0.0）- 高级 Pro 组件
- **@ant-design/icons 6.1.1** - 图标库
- **@ant-design/cssinjs 2.1.2** - CSS-in-JS 样式解决方案

**构建/开发：**
- **Vite 8.0.5** - 开发服务器和构建工具
- **@vitejs/plugin-react 5.1.2** - Vite 的 React 插件
- **vite-plugin-dts 4.5.4** - TypeScript 声明文件生成
- **vite-plugin-progress 0.0.7** - 构建进度指示器

**测试：**
- **Vitest 4.0.16** - 单元测试框架
- **@testing-library/react 16.3.1** - React 组件测试工具
- **@testing-library/jest-dom 6.9.1** - DOM 断言
- **@testing-library/user-event 14.6.1** - 用户交互模拟
- **jsdom 27.3.0** - 测试的浏览器环境模拟

**代码检查/格式化：**
- **oxlint 1.59.0** - 快速的 JavaScript/TypeScript 代码检查器
- **oxfmt 0.44.0** - 代码格式化工具

## 核心依赖

**关键依赖：**
- **axios 1.14.0** - 用于 API 请求的 HTTP 客户端
  - 配置在 `src/utils/http.ts`，带拦截器用于错误处理
- **dayjs 1.11.20** - 日期处理库
  - 扩展了 weekday 和 localeData 插件
- **lodash-es 4.18.1** - 工具库（ES 模块版本）
- **lucide-react 1.7.0** - 现代图标库

**拖拽：**
- **@dnd-kit/core 6.3.1** - 拖拽基础组件
- **@dnd-kit/sortable 10.0.0** - 可排序组件
- **@dnd-kit/utilities 3.2.2** - DnD 工具

**发布管理：**
- **@changesets/cli 2.27.9** - 版本控制和变更日志管理

**Git 钩子：**
- **husky 9.1.7** - Git 钩子管理
- **lint-staged 16.2.7** - 在暂存文件上运行代码检查

## 配置

**TypeScript 配置：**
- `tsconfig.json` - 主配置，目标 ES2020，DOM 库
- `tsconfig.node.json` - Vite 配置的 Node 专用配置
- `playground/tsconfig.json` - Playground 应用配置

**路径别名：**
- `@/*` → `./src/*` - 源代码目录别名

**Vite 配置：**
- Library 模式构建，输出 ES 模块
- 外部依赖：react、react-dom、antd、@ant-design/pro-components、lucide-react、dayjs、lodash-es、@ant-design/icons、@dnd-kit/*、axios

**格式化配置（.oxfmtrc.jsonc）：**
- 打印宽度：150
- Tab 宽度：4，使用制表符
- 无分号，双引号
- 尾随逗号：all
- 箭头函数括号：always

**代码检查（.oxlintrc.jsonc）：**
- 插件：oxc、eslint、react、unicorn
- 强制执行 correctness、style、suspicious 类别
- 启用 React hooks 规则
- 强制 camelCase

**测试（vite.config.ts 中的 vitest 配置）：**
- 全局变量：true
- 环境：jsdom
- 设置文件：`./src/test/setup.ts`
- 覆盖率：v8 provider，支持 text、json、html 报告

**版本控制：**
- 预提交钩子：`pnpm exec lint-staged`
- lint-staged 对 `*.{ts,tsx,js,jsx}` 运行 `oxfmt`

## 平台要求

**开发环境：**
- Node.js（.nvmrc 中未指定版本）
- pnpm 包管理器
- 现代浏览器用于测试

**生产环境：**
- 目标：ES2020
- 模块格式：ES 模块（es）
- JSX 转换：react-jsx

**浏览器支持：**
- 支持 ES2020 的现代浏览器
- DOM API：ResizeObserver（测试中模拟）

---

*技术栈分析：2026-04-07*

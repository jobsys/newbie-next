# 代码库结构

**分析日期：** 2025-04-07

## 目录布局

```
newbie-next/
├── src/                          # 主源代码
│   ├── components/               # React 组件
│   │   ├── captcha/              # 滑块验证组件
│   │   ├── icon/                 # Lucide 图标适配器
│   │   ├── provider/             # 全局配置 Provider
│   │   ├── search/               # 高级搜索组件
│   │   │   ├── components/       # 子组件
│   │   │   ├── context/          # Context Provider
│   │   │   ├── hooks/            # 搜索专用 Hooks
│   │   │   ├── utils/            # 搜索工具
│   │   │   └── __tests__/        # 搜索测试
│   │   └── upload/               # 上传组件
│   ├── hooks/                    # 可复用 React Hooks
│   │   └── __tests__/            # Hooks 测试
│   ├── types/                    # 共享 TypeScript 类型
│   ├── utils/                    # 工具函数
│   │   └── __tests__/            # 工具测试
│   └── test/                     # 测试工具
├── playground/                   # 开发 playground
│   └── src/
│       ├── demos/                # 组件演示
│       └── App.tsx               # Playground 入口
├── docs/                         # 文档
├── dist/                         # 构建输出
├── .agent/                       # AI Agent 规则和技能
├── .changeset/                   # Changeset 版本控制
├── .github/                      # GitHub 工作流
└── .planning/                    # 规划文档
```

## 目录用途

**src/components/：**
- 用途：React 组件实现
- 包含：包含 index.ts、主组件、类型的组件文件夹
- 关键文件：`src/components/search/newbie-search.tsx`、`src/components/provider/newbie-provider.tsx`

**src/components/search/：**
- 用途：基于 Context 状态的复杂搜索组件
- 包含：Provider、context、子组件、hooks、工具
- 关键文件：`src/components/search/context/search-provider.tsx`、`src/components/search/components/search-item.tsx`

**src/hooks/：**
- 用途：可复用的 React Hooks
- 包含：HTTP hook、正则 hook
- 关键文件：`src/hooks/use-http.ts`、`src/hooks/use-regex.ts`

**src/utils/：**
- 用途：共享工具函数
- 包含：HTTP 客户端、深度合并、classNames
- 关键文件：`src/utils/http.ts`、`src/utils/merge.ts`

**src/types/：**
- 用途：共享 TypeScript 接口
- 包含：基础配置接口
- 关键文件：`src/types/index.ts`

**src/test/：**
- 用途：测试工具和设置
- 包含：测试设置、工具
- 关键文件：`src/test/setup.ts`、`src/test/test-utils.tsx`

**playground/src/demos/：**
- 用途：组件展示和测试
- 包含：每个组件的演示实现
- 关键文件：`playground/src/demos/search-demo.tsx`、`playground/src/App.tsx`

## 关键文件位置

**入口点：**
- `src/index.ts`：库公共 API 导出
- `playground/src/main.tsx`：Playground 入口（推断）

**配置：**
- `package.json`：包元数据和依赖
- `tsconfig.json`：带路径别名的 TypeScript 配置
- `vite.config.ts`：构建和测试配置

**核心逻辑：**
- `src/components/provider/newbie-provider.tsx`：全局配置 Provider
- `src/components/search/context/search-provider.tsx`：搜索状态管理
- `src/utils/http.ts`：基于 Axios 的 HTTP 客户端

**测试：**
- `src/test/setup.ts`：Vitest 设置
- `src/components/search/__tests__/newbie-search.test.tsx`：搜索组件测试
- `src/components/provider/__tests__/newbie-provider.test.tsx`：Provider 测试

## 命名约定

**文件：**
- 组件：PascalCase，带 "newbie-" 前缀（如 `newbie-search.tsx`）
- 工具：camelCase（如 `use-http.ts`、`merge.ts`）
- 类型：kebab-case，`.ts` 扩展名（如 `types.ts`）
- 测试：`.test.ts` 或 `.test.tsx` 后缀

**目录：**
- 组件：kebab-case（如 `search/`、`provider/`）
- 子目录：复数名词（如 `hooks/`、`utils/`、`components/`）

**导出：**
- Barrel 文件使用 `index.ts` 实现简洁导入
- 首选命名导出而非默认导出
- 类型与实现一起导出

## 在哪里添加新代码

**新组件：**
- 主代码：`src/components/{component-name}/`
- Barrel 导出：`src/components/{component-name}/index.ts`
- 类型：`src/components/{component-name}/types.ts`
- 测试：`src/components/{component-name}/__tests__/{component-name}.test.tsx`
- 演示：`playground/src/demos/{component-name}-demo.tsx`
- 更新：`src/index.ts` 以导出新组件

**新 Hook：**
- 实现：`src/hooks/use-{hook-name}.ts`
- 测试：`src/hooks/__tests__/use-{hook-name}.test.ts`
- 更新：`src/index.ts` 以导出新 hook

**新工具：**
- 实现：`src/utils/{utility-name}.ts`
- 测试：`src/utils/__tests__/{utility-name}.test.ts`
- 更新：`src/utils/index.ts` 以导出

**新类型：**
- 共享类型：`src/types/index.ts`
- 组件专用类型：`src/components/{component}/types.ts`

## 特殊目录

**dist/：**
- 用途：构建输出
- 生成：是（通过 vite build）
- 提交：否（在 .gitignore 中）

**playground/：**
- 用途：组件开发和测试环境
- 生成：否
- 提交：是

**.agent/：**
- 用途：AI Agent 规则和技能定义
- 生成：否
- 提交：是

**node_modules/.pnpm/：**
- 用途：pnpm 包存储
- 生成：是
- 提交：否

---

*结构分析：2025-04-07*

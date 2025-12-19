# Newbie Next 组件开发细则

本文档为 AI Agent 提供详细的开发指南，确保代码质量和 AI 友好性。

## 项目概述

**@jobsys/newbie-next** 是一个基于 React + Ant Design 6.1 的组件库，旨在提供 AI 友好的、高质量的 React 组件。

## 核心原则

### 1. AI 友好性（最重要）

所有代码必须遵循以下原则：

- ✅ **完整的 TypeScript 类型定义**：所有 API 都有明确的类型
- ✅ **详细的 JSDoc 注释**：每个函数、组件、属性都有说明和示例
- ✅ **语义化命名**：变量、函数名清晰表达意图
- ✅ **清晰的代码结构**：模块化、职责单一
- ✅ **丰富的示例**：提供多种使用场景

### 2. 代码质量标准

- **测试覆盖率 > 80%**
- **所有代码必须通过 oxlint 检查**
- **所有公共 API 必须有完整的类型定义和 JSDoc**

## 技术栈

- **包管理器**：pnpm
- **格式化与 Lint**：oxc (oxlint)
- **框架**：React 18+ with TypeScript
- **UI 库**：Ant Design 6.1
- **Pro Components**：@ant-design/pro-components (copilot/upgrade-to-antd-v6 分支)
- **构建工具**：Vite
- **测试框架**：Vitest + @testing-library/react

## 项目结构

```
newbie-next/
├── src/
│   ├── components/          # 组件实现
│   │   ├── provider/        # NewbieProvider
│   │   ├── form/            # NewbieForm
│   │   ├── search/          # NewbieSearch
│   │   └── table/           # NewbieTable
│   ├── hooks/               # 自定义 Hooks
│   ├── utils/               # 工具函数
│   ├── types/               # 类型定义
│   └── test/                # 测试工具
├── playground/              # Playground 应用
│   └── src/
│       ├── App.tsx
│       ├── demos/
│       └── components/
├── .github/
│   └── workflows/
│       └── release.yml      # CI/CD
├── .changeset/              # Changesets 配置
└── package.json
```

## 开发规范

### 1. 类型定义规范

所有类型必须：

1. **使用 interface 而非 type**（除非需要联合类型）
2. **每个属性都有 JSDoc 注释**
3. **提供使用示例**

````typescript
/**
 * 搜索字段配置
 *
 * @example
 * ```tsx
 * const field: SearchFieldConfig = {
 *   key: 'name',
 *   type: 'input',
 *   title: '姓名',
 *   conditions: ['equal', 'include']
 * }
 * ```
 */
export interface SearchFieldConfig {
  /** 字段唯一标识 */
  key: string
  /** 字段类型 */
  type: 'input' | 'number' | 'date' | 'select'
  /** 字段标题 */
  title: string
  /** 可用条件列表 */
  conditions?: string[]
}
````

### 2. Hook 开发规范

所有 Hook 必须：

1. **完整的 JSDoc 注释**（包括参数说明、返回值说明、使用示例）
2. **明确的返回类型**
3. **使用 useMemo、useCallback 优化性能**

````typescript
/**
 * 搜索字段状态管理 Hook
 *
 * 用于管理搜索字段的值、条件、显示值等状态
 *
 * @param options - Hook 配置选项
 * @param options.field - 字段配置对象
 * @returns 字段状态和控制方法
 *
 * @example
 * ```tsx
 * const fieldState = useSearchField({
 *   field: { key: 'name', type: 'input', title: '姓名' }
 * })
 *
 * // 更新值
 * fieldState.setValue('张三')
 *
 * // 更新条件
 * fieldState.setCondition('include')
 * ```
 */
export function useSearchField(
  options: UseSearchFieldOptions
): UseSearchFieldReturn {
  // 实现...
}
````

### 3. 组件开发规范

所有组件必须：

1. **完整的 Props 类型定义和 JSDoc**
2. **使用 React.memo 优化（如适用）**
3. **提供使用示例**

````typescript
/**
 * NewbieSearch 组件
 *
 * 高级搜索组件，支持条件筛选、排序、持久化等功能
 *
 * @example
 * ```tsx
 * <NewbieSearch
 *   fields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   onSubmit={(query) => console.log(query)}
 * />
 * ```
 */
export interface NewbieSearchProps {
  /** 搜索字段配置数组 */
  fields: SearchFieldConfig[]
  /** 提交回调 */
  onSubmit?: (query: QueryForm) => void
  /** 是否禁用条件选择 */
  disableConditions?: boolean
}

export const NewbieSearch: React.FC<NewbieSearchProps> = (props) => {
  // 实现...
}
````

### 4. 测试规范

所有代码必须：

1. **单元测试**：所有 Hooks 和工具函数
2. **集成测试**：组件交互和状态管理
3. **覆盖率 > 80%**

测试文件命名：`*.test.ts` 或 `*.test.tsx`

```typescript
// hooks/__tests__/use-search-field.test.ts
import { renderHook, act } from '@testing-library/react'
import { useSearchField } from '../use-search-field'

describe('useSearchField', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSearchField({
      field: { key: 'name', type: 'input', title: '姓名' }
    }))

    expect(result.current.value).toBe('')
    expect(result.current.condition).toBe('equal')
  })
})
```

## 组件开发指南

### NewbieProvider

**功能**：支持所有组件的默认属性覆盖

**实现要点**：

- 使用 React Context 提供全局配置
- 支持组件级别的默认属性（如 `defaults.NewbieForm`、`defaults.ProFormText`）
- 深度合并配置
- 完整的 TypeScript 类型定义

### NewbieForm

**实现方式**：基于 ProForm Schema Form 的轻量级封装

**核心功能**：

- JSON Schema 配置生成表单
- 字段类型映射（input, select, date, number 等）
- 多列布局
- 条件渲染
- 表单验证
- 初始值加载和提交处理

**独特功能**：

- 矩阵组件（MatrixCheckbox, MatrixRadio, MatrixScale）
- Group 子表单增强（childrenOperations, cellProps）

### NewbieSearch

**实现方式**：完全独立实现（核心独特功能）

**核心功能**：

- 条件筛选系统（equal, notEqual, like, between 等）
- 展开搜索项（expandable）
- 排序功能（sortableColumns）
- 持久化（persistence）
- 响应式布局

### NewbieTable

**实现方式**：基于 ProTable 的轻量级封装

**核心功能**：

- 集成 NewbieSearch 作为搜索栏
- 分页配置
- 数据请求
- 列配置
- 操作列

## 自动化流程

### 发版流程

1. **开发完成后创建 changeset**：

    ```bash
    pnpm changeset
    ```

2. **提交代码**：

    ```bash
    git add .
    git commit -m "feat: add new feature"
    git push
    ```

3. **CI 自动处理**：
    - 运行测试
    - 构建
    - 如果有 changeset，创建 PR
    - 合并 PR 后自动发布到 npm

### 测试流程

```bash
# 运行测试
pnpm test

# 运行测试（UI 模式）
pnpm test:ui

# 运行测试（单次）
pnpm test:run

# 生成覆盖率报告
pnpm test:coverage
```

### Lint 流程

```bash
# 检查
pnpm lint

# 自动修复
pnpm lint:fix
```

## 文件命名规范

- **组件文件**：`kebab-case.tsx`（如 `newbie-search.tsx`）
- **Hook 文件**：`use-kebab-case.ts`（如 `use-search-field.ts`）
- **类型文件**：`types.ts` 或 `index.ts`
- **测试文件**：`*.test.ts` 或 `*.test.tsx`

## 导出规范

所有公共 API 必须在 `src/index.ts` 中导出：

```typescript
// 组件
export { NewbieProvider } from './components/provider'
export type { NewbieProviderProps } from './components/provider'

// Hooks
export { useSearchField } from './hooks/use-search-field'

// 类型
export type * from './types'
```

## 注意事项

1. **不要使用 any 类型**：使用 `unknown` 或具体类型
2. **所有函数必须有返回值类型**：即使返回 void
3. **使用 const 而非 let**：除非需要重新赋值
4. **避免魔法数字/字符串**：使用常量或枚举
5. **保持函数单一职责**：一个函数只做一件事

## 参考资源

- [Ant Design 6.1 文档](https://ant.design)
- [Pro Components 文档](https://procomponents.ant.design)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)
- [Vitest 文档](https://vitest.dev)
- [Testing Library 文档](https://testing-library.com)

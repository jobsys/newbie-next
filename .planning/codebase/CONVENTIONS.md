# 编码规范

**分析日期：** 2026-04-07

## 命名模式

**文件：**
- 组件文件使用 PascalCase：`newbie-search.tsx`、`newbie-provider.tsx`
- 工具/hook 文件使用 camelCase：`use-regex.ts`、`use-http.ts`、`merge.ts`
- 测试文件使用 `__tests__` 子目录和 `.test.ts` 后缀：`src/utils/__tests__/merge.test.ts`
- Barrel 文件命名为 `index.ts` 以实现简洁导出

**函数：**
- 常规函数使用 camelCase：`deepMerge`、`createHttpClient`、`useRegexRule`
- React 组件使用 PascalCase：`NewbieProvider`、`NewbieSearch`、`NewbieIcon`
- Hook 函数以 `use` 为前缀：`useRegexRule`、`useHttp`、`useNewbieContext`

**变量：**
- 局部变量使用 camelCase：`queryForm`、`sortFields`、`fieldOptions`
- 常量使用 UPPER_CASE：`PATTERNS`（正则模式对象）
- 私有/内部变量在对象属性中使用下划线前缀

**类型：**
- 接口和类型使用 PascalCase：`NewbieProviderProps`、`HttpInstance`、`RegexRuleOptions`
- 类型参数使用单个大写字母：`T`、`ValueType`
- 联合类型使用显式字面量定义：`type SearchCondition = "equal" | "notEqual" | ...`

**CSS/样式：**
- 内联样式属性使用 camelCase（React 标准）
- 样式对象隐式类型为 `React.CSSProperties`

## 代码风格

**格式化：**
- 工具：`oxfmt`（Oxlint 的格式化工具）
- 行尾：Unix 风格（LF）
- 引号：字符串使用双引号，JSX 属性需要时使用单引号
- 尾随逗号：多行对象/数组字面量中使用
- 分号：必需，由 oxlint 强制执行

**代码检查：**
- 工具：`oxlint`，自定义配置在 `.oxlintrc.jsonc`
- 插件：oxc、eslint、react、unicorn
- 关键规则：
  - `camelcase`：error
  - `no-unused-vars`：error（支持 TypeScript）
  - `no-plusplus`：error（for 循环除外）
  - React prop-types：off（TypeScript 处理类型）
  - React hooks 规则：`react-hooks/rules-of-hooks` 为 error，`react-hooks/exhaustive-deps` 为 warn

## 导入组织

**顺序：**
1. React 导入优先
2. 第三方库导入（antd、lucide-react、@dnd-kit/*）
3. 类型导入（`import type { ... }`）
4. 内部绝对导入（`@/components/*`、`@/utils/*`）
5. 相对导入（同级、父目录）

**路径别名：**
- `@/*` 映射到 `./src/*`（在 `tsconfig.json` 和 `vite.config.ts` 中配置）
- 示例：`import { deepMerge } from "@/utils/merge"`

**导入风格：**
- 首选命名导入而非默认导入
- 类型导入使用显式 `import type` 语法
- 从 React 解构导入：`import { useMemo, useCallback } from "react"`

## 错误处理

**模式：**
- HTTP 错误在集中式拦截器中处理（`src/utils/http.ts`）
- 业务逻辑错误抛出带描述性消息的 `Error`
- 配置对象中的可选错误回调：`onError?: (message: string, error: AxiosError) => void`
- Promise rejection 用于异步错误

**类型安全：**
- 启用严格 TypeScript 模式
- 无隐式 any
- 访问可选属性前需要空检查
- 使用类型守卫进行收窄：`typeof value === "object"`、`Array.isArray(value)`

## 日志

**框架：** 原生 `console`，有目的的用法

**模式：**
- 错误记录到 `console.error` 并带上下文：`console.error(\`加载 ${fieldKey} 的选项失败：\`, error)`
- 未检测到生产日志框架
- 测试中抑制预期的错误控制台输出（见 `newbie-provider.test.tsx`）

## 注释

**何时注释：**
- 所有导出的函数、接口和复杂逻辑使用 JSDoc
- 业务逻辑使用双语注释（中文和英文）
- 非明显的实现细节使用内联注释

**JSDoc/TSDoc：**
- 所有公共 API 使用 `@param`、`@returns`、`@example` 记录
- 接口属性使用内联注释记录
- 函数描述包含用途和用法示例

**示例：**
```typescript
/**
 * 深度合并工具函数 (Deep Merge Utility)
 *
 * 此工具用于深度递归合并两个对象...
 *
 * @param target - 目标对象，合并的基础
 * @param source - 源对象，其中的属性将合并到目标对象中
 * @returns 合并后的新对象
 *
 * @example
 * ```ts
 * const result = deepMerge(base, extra);
 * ```
 */
```

## 函数设计

**大小：**
- 函数通常保持在 50 行以内
- 大组件拆分为内部子组件（如 `SortableItem`、`SortPopoverContent`）

**参数：**
- 3 个以上参数使用选项对象
- 可选参数有默认值或使用 `?:` 语法
- 回调函数显式类型

**返回值：**
- 公共函数有显式返回类型
- React 组件显式返回 `JSX.Element`
- Hooks 返回元组或带命名属性的对象

## 模块设计

**导出：**
- 首选命名导出而非默认导出
- Barrel 文件从子模块重新导出：`src/components/provider/index.ts`
- 类型导出使用 `export type` 语法

**Barrel 文件：**
- 每个组件目录有 `index.ts` 以实现简洁公共 API
- 主 `src/index.ts` 导出所有公共 API
- 未来功能的注释占位符（如 `// export { NewbieForm }`）

**结构模式：**
```
src/components/[component]/
├── index.ts          # Barrel 导出
├── [component].tsx   # 主组件
├── types.ts          # 组件专用类型
├── context.ts        # React context（如需要）
├── context/
│   ├── [context]-provider.tsx
│   └── [context]-context.tsx
├── hooks/
│   └── use-[hook].ts
└── __tests__/
    └── [component].test.tsx
```

---

*规范分析：2026-04-07*

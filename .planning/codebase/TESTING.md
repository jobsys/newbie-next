# 测试模式

**分析日期：** 2026-04-07

## 测试框架

**运行器：**
- Vitest v4.0.16
- 配置：`vite.config.ts`（测试配置嵌入在 Vite 配置中）
- 环境：jsdom

**断言库：**
- `@testing-library/jest-dom` v6.9.1 用于 DOM 断言
- Vitest 内置断言用于单元测试

**运行命令：**
```bash
pnpm test              # 以 watch 模式运行测试
pnpm test:ui           # 以 UI 运行测试
pnpm test:run          # 运行一次测试
pnpm test:coverage     # 运行测试并生成覆盖率报告
```

## 测试文件组织

**位置：**
- 与源文件共存于 `__tests__` 子目录
- 模式：`src/components/[component]/__tests__/[component].test.tsx`
- 工具测试位于 `src/utils/__tests__/[util].test.ts`
- 设置文件位于 `src/test/`

**命名：**
- 文件：`[name].test.ts` 或 `[name].test.tsx`
- 描述性名称，表明测试内容

**结构：**
```
src/
├── components/
│   ├── provider/
│   │   ├── __tests__/
│   │   │   └── newbie-provider.test.tsx
│   │   ├── newbie-provider.tsx
│   │   └── types.ts
│   └── search/
│       ├── __tests__/
│       │   └── newbie-search.test.tsx
│       └── newbie-search.tsx
├── hooks/
│   ├── __tests__/
│   │   └── use-regex.test.ts
│   └── use-regex.ts
├── utils/
│   ├── __tests__/
│   │   └── merge.test.ts
│   └── merge.ts
└── test/
    ├── setup.ts
    └── test-utils.tsx
```

## 测试结构

**套件组织：**
```typescript
import { describe, it, expect } from "vitest"

describe("组件名称", () => {
  it("应该执行某个特定操作", () => {
    // Arrange
    const input = ...

    // Act
    const result = functionUnderTest(input)

    // Assert
    expect(result).toBe(expected)
  })

  describe("嵌套行为组", () => {
    it("应该处理边界情况", () => {
      // 测试实现
    })
  })
})
```

**模式：**
- 顶级 `describe` 使用组件/函数名称
- 嵌套 `describe` 用于分组相关行为
- 测试名称使用 "should" 格式描述预期行为
- 测试体中隐含的 Arrange-Act-Comment 结构

**设置模式：**
```typescript
// src/test/setup.ts
import "@testing-library/jest-dom"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// 全局模拟
vi.mock("@ant-design/pro-components", async () => ({
  ProConfigProvider: ({ children }: any) => children,
}))

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// 浏览器 API 的全局模拟
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})
```

## 模拟

**框架：** Vitest 内置模拟（`vi` 命名空间）

**模式：**
```typescript
// 模拟外部模块
vi.mock("@ant-design/pro-components", async () => ({
  ProConfigProvider: ({ children }: any) => children,
}))

// 模拟函数
const onSubmit = vi.fn()
renderWithProviders(<NewbieSearch columns={columns} onSubmit={onSubmit} />)
expect(onSubmit).toBeDefined()

// 抑制预期错误的控制台错误
const consoleError = console.error
console.error = () => {}
expect(() => {
  render(<TestComponent />)
}).toThrow("useNewbieContext 必须在 NewbieProvider 内使用")
console.error = consoleError
```

**模拟内容：**
- 复杂设置的外部 UI 库（Ant Design Pro）
- jsdom 中不存在的浏览器 API（ResizeObserver、matchMedia）
- 网络请求（通过拦截器或模拟服务）
- 作为 props 传递的回调函数

**不模拟的内容：**
- 测试中的内部工具函数
- 直接测试 hook 行为时的 React hooks
- Ant Design 基础组件（包装在 ConfigProvider 中）

## 夹具和工厂

**测试数据：**
```typescript
// 测试中的内联夹具
const columns: NewbieProColumn[] = [
  { key: "name", valueType: "input", title: "姓名" }
]

// 复杂设置的组件工厂
function TestComponent() {
  const { config } = useNewbieContext()
  return <div>{config.locale}</div>
}
```

**位置：**
- 测试文件中定义的内联测试数据
- 未检测到专用夹具目录
- 可复用的包装组件位于 `src/test/test-utils.tsx`

## 自定义测试工具

**位置：** `src/test/test-utils.tsx`

**模式：**
```typescript
/**
 * 带 Ant Design ConfigProvider 的自定义渲染函数
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

// 从 @testing-library/react 重新导出所有内容
export * from "@testing-library/react"
```

**用法：**
```typescript
import { renderWithProviders, screen } from "../../../test/test-utils"

renderWithProviders(<NewbieSearch columns={columns} />)
expect(screen.getByText("搜索")).toBeInTheDocument()
```

## 覆盖率

**要求：** 未显式强制执行目标

**配置：**
```typescript
// vite.config.ts
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html"],
  exclude: [
    "node_modules/",
    "src/test/",
    "**/*.d.ts",
    "**/*.config.*",
    "**/playground/**"
  ],
}
```

**查看覆盖率：**
```bash
pnpm test:coverage
```

## 测试类型

**单元测试：**
- 专注于隔离的函数和 hooks
- 无外部依赖（已模拟）
- 示例：`src/utils/__tests__/merge.test.ts` 测试 `deepMerge`

**组件测试：**
- 使用 React Testing Library
- 测试用户可见行为，而非实现
- 需要时包装在 provider context 中

**Hook 测试：**
- 以最小包装隔离测试 hooks
- 示例：`src/hooks/__tests__/use-regex.test.ts`

**E2E 测试：**
- 当前未实现
- Playground 应用用于手动测试

## 常见模式

**异步测试：**
```typescript
// 通过 vi.fn() 测试回调
const onSubmit = vi.fn()
renderWithProviders(<Component onSubmit={onSubmit} />)
// 触发操作
expect(onSubmit).toHaveBeenCalled()
```

**错误测试：**
```typescript
// 抑制预期错误的控制台噪音
const consoleError = console.error
console.error = () => {}
expect(() => {
  render(<TestComponent />)
}).toThrow("useNewbieContext 必须在 NewbieProvider 内使用")
console.error = consoleError
```

**Context 测试：**
```typescript
// 在 provider 中包装组件
render(
  <NewbieProvider config={{ locale: "en_US" }}>
    <TestComponent />
  </NewbieProvider>
)
expect(screen.getByText("en_US")).toBeInTheDocument()
```

**DOM 断言：**
```typescript
// 使用 jest-dom 匹配器
expect(screen.getByText("搜索")).toBeInTheDocument()
expect(element).toHaveAttribute("disabled")
```

---

*测试分析：2026-04-07*

# Testing Patterns

**Analysis Date:** 2026-04-07

## Test Framework

**Runner:**
- Vitest v4.0.16
- Config: `vite.config.ts` (test configuration embedded in Vite config)
- Environment: jsdom

**Assertion Library:**
- `@testing-library/jest-dom` v6.9.1 for DOM assertions
- Vitest built-in assertions for unit tests

**Run Commands:**
```bash
pnpm test              # Run tests in watch mode
pnpm test:ui           # Run tests with UI
pnpm test:run          # Run tests once
pnpm test:coverage     # Run with coverage report
```

## Test File Organization

**Location:**
- Co-located with source files in `__tests__` subdirectories
- Pattern: `src/components/[component]/__tests__/[component].test.tsx`
- Utilities tested in `src/utils/__tests__/[util].test.ts`
- Setup files in `src/test/`

**Naming:**
- Files: `[name].test.ts` or `[name].test.tsx`
- Descriptive names that indicate what's being tested

**Structure:**
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

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from "vitest"

describe("ComponentName", () => {
  it("should do something specific", () => {
    // Arrange
    const input = ...

    // Act
    const result = functionUnderTest(input)

    // Assert
    expect(result).toBe(expected)
  })

  describe("nested behavior group", () => {
    it("should handle edge case", () => {
      // Test implementation
    })
  })
})
```

**Patterns:**
- Top-level `describe` uses component/function name
- Nested `describe` for grouping related behaviors
- Test names use "should" format describing expected behavior
- Arrange-Act-Comment structure implied in test body

**Setup Pattern:**
```typescript
// src/test/setup.ts
import "@testing-library/jest-dom"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// Global mocks
vi.mock("@ant-design/pro-components", async () => ({
  ProConfigProvider: ({ children }: any) => children,
}))

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Global mocks for browser APIs
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

## Mocking

**Framework:** Vitest built-in mocking (`vi` namespace)

**Patterns:**
```typescript
// Mock external modules
vi.mock("@ant-design/pro-components", async () => ({
  ProConfigProvider: ({ children }: any) => children,
}))

// Mock functions
const onSubmit = vi.fn()
renderWithProviders(<NewbieSearch columns={columns} onSubmit={onSubmit} />)
expect(onSubmit).toBeDefined()

// Suppress console errors for expected errors
const consoleError = console.error
console.error = () => {}
expect(() => {
  render(<TestComponent />)
}).toThrow("useNewbieContext must be used within NewbieProvider")
console.error = consoleError
```

**What to Mock:**
- External UI libraries with complex setup (Ant Design Pro)
- Browser APIs not in jsdom (ResizeObserver, matchMedia)
- Network requests (via interceptors or mock services)
- Callback functions passed as props

**What NOT to Mock:**
- Internal utility functions under test
- React hooks when testing hook behavior directly
- Ant Design base components (ConfigProvider wrapped)

## Fixtures and Factories

**Test Data:**
```typescript
// Inline fixtures within tests
const columns: NewbieProColumn[] = [
  { key: "name", valueType: "input", title: "姓名" }
]

// Component factories for complex setups
function TestComponent() {
  const { config } = useNewbieContext()
  return <div>{config.locale}</div>
}
```

**Location:**
- Test data defined inline in test files
- No dedicated fixtures directory detected
- Reusable wrapper components in `src/test/test-utils.tsx`

## Custom Test Utilities

**Location:** `src/test/test-utils.tsx`

**Pattern:**
```typescript
/**
 * Custom render function with Ant Design ConfigProvider
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

// Re-export everything from @testing-library/react
export * from "@testing-library/react"
```

**Usage:**
```typescript
import { renderWithProviders, screen } from "../../../test/test-utils"

renderWithProviders(<NewbieSearch columns={columns} />)
expect(screen.getByText("搜索")).toBeInTheDocument()
```

## Coverage

**Requirements:** Target not explicitly enforced

**Configuration:**
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

**View Coverage:**
```bash
pnpm test:coverage
```

## Test Types

**Unit Tests:**
- Focus on isolated functions and hooks
- No external dependencies (mocked)
- Example: `src/utils/__tests__/merge.test.ts` for `deepMerge`

**Component Tests:**
- Use React Testing Library
- Test user-visible behavior, not implementation
- Wrap components in provider context when needed

**Hook Tests:**
- Test hooks in isolation with minimal wrapper
- Example: `src/hooks/__tests__/use-regex.test.ts`

**E2E Tests:**
- Not currently implemented
- Playground app used for manual testing

## Common Patterns

**Async Testing:**
```typescript
// Callbacks tested via vi.fn()
const onSubmit = vi.fn()
renderWithProviders(<Component onSubmit={onSubmit} />)
// Trigger action
expect(onSubmit).toHaveBeenCalled()
```

**Error Testing:**
```typescript
// Suppress console noise for expected errors
const consoleError = console.error
console.error = () => {}
expect(() => {
  render(<TestComponent />)
}).toThrow("useNewbieContext must be used within NewbieProvider")
console.error = consoleError
```

**Context Testing:**
```typescript
// Wrap component in provider
render(
  <NewbieProvider config={{ locale: "en_US" }}>
    <TestComponent />
  </NewbieProvider>
)
expect(screen.getByText("en_US")).toBeInTheDocument()
```

**DOM Assertions:**
```typescript
// Using jest-dom matchers
expect(screen.getByText("搜索")).toBeInTheDocument()
expect(element).toHaveAttribute("disabled")
```

---

*Testing analysis: 2026-04-07*

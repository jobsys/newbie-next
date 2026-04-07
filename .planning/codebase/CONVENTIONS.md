# Coding Conventions

**Analysis Date:** 2026-04-07

## Naming Patterns

**Files:**
- PascalCase for component files: `newbie-search.tsx`, `newbie-provider.tsx`
- camelCase for utility/hook files: `use-regex.ts`, `use-http.ts`, `merge.ts`
- Test files use `__tests__` subdirectory with `.test.ts` suffix: `src/utils/__tests__/merge.test.ts`
- Barrel files named `index.ts` for clean exports

**Functions:**
- camelCase for regular functions: `deepMerge`, `createHttpClient`, `useRegexRule`
- PascalCase for React components: `NewbieProvider`, `NewbieSearch`, `NewbieIcon`
- Hook functions prefixed with `use`: `useRegexRule`, `useHttp`, `useNewbieContext`

**Variables:**
- camelCase for local variables: `queryForm`, `sortFields`, `fieldOptions`
- UPPER_CASE for constants: `PATTERNS` (regex patterns object)
- Private/internal variables use underscore prefix in object properties

**Types:**
- PascalCase for interfaces and types: `NewbieProviderProps`, `HttpInstance`, `RegexRuleOptions`
- Type parameters use single uppercase letters: `T`, `ValueType`
- Union types defined with explicit literals: `type SearchCondition = "equal" | "notEqual" | ...`

**CSS/Styles:**
- camelCase for inline style properties (React standard)
- Style objects typed as `React.CSSProperties` implicitly

## Code Style

**Formatting:**
- Tool: `oxfmt` (Oxlint's formatter)
- Line endings: Unix-style (LF)
- Quotes: Double quotes for strings, single quotes for JSX attributes when needed
- Trailing commas: Used in multi-line object/array literals
- Semicolons: Required, enforced by oxlint

**Linting:**
- Tool: `oxlint` with custom configuration in `.oxlintrc.jsonc`
- Plugins: oxc, eslint, react, unicorn
- Key rules:
  - `camelcase`: error
  - `no-unused-vars`: error (TypeScript-aware)
  - `no-plusplus`: error (except in for loops)
  - React prop-types: off (TypeScript handles types)
  - React hooks rules: `react-hooks/rules-of-hooks` as error, `react-hooks/exhaustive-deps` as warn

## Import Organization

**Order:**
1. React imports first
2. Third-party library imports (antd, lucide-react, @dnd-kit/*)
3. Type imports (`import type { ... }`)
4. Internal absolute imports (`@/components/*`, `@/utils/*`)
5. Relative imports (siblings, parent directories)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- Example: `import { deepMerge } from "@/utils/merge"`

**Import Style:**
- Named imports preferred over default imports
- Type imports use explicit `import type` syntax
- Destructuring imports from React: `import { useMemo, useCallback } from "react"`

## Error Handling

**Patterns:**
- HTTP errors handled in centralized interceptor (`src/utils/http.ts`)
- Business logic errors throw `Error` with descriptive messages
- Optional error callbacks in configuration objects: `onError?: (message: string, error: AxiosError) => void`
- Promise rejection used for async errors

**Type Safety:**
- Strict TypeScript mode enabled
- No implicit any
- Null checks required before accessing optional properties
- Type guards used for narrowing: `typeof value === "object"`, `Array.isArray(value)`

## Logging

**Framework:** Native `console` with intentional usage

**Patterns:**
- Errors logged to `console.error` with context: `console.error(\`Failed to load options for ${fieldKey}:\`, error)`
- No production logging framework detected
- Console suppression in tests for expected errors (see `newbie-provider.test.tsx`)

## Comments

**When to Comment:**
- JSDoc for all exported functions, interfaces, and complex logic
- Bilingual comments (Chinese and English) for business logic
- Inline comments for non-obvious implementation details

**JSDoc/TSDoc:**
- All public APIs documented with `@param`, `@returns`, `@example`
- Interface properties documented with inline comments
- Function descriptions include purpose and usage examples

**Example:**
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

## Function Design

**Size:**
- Functions generally kept under 50 lines
- Large components split into internal sub-components (e.g., `SortableItem`, `SortPopoverContent`)

**Parameters:**
- Use options objects for 3+ parameters
- Optional parameters have default values or use `?:` syntax
- Callback functions typed explicitly

**Return Values:**
- Explicit return types on public functions
- React components return `JSX.Element` explicitly
- Hooks return tuples or objects with named properties

## Module Design

**Exports:**
- Named exports preferred over default exports
- Barrel files re-export from submodules: `src/components/provider/index.ts`
- Type exports use `export type` syntax

**Barrel Files:**
- Each component directory has `index.ts` for clean public API
- Main `src/index.ts` exports all public APIs
- Commented placeholders for future features (e.g., `// export { NewbieForm }`)

**Structure Pattern:**
```
src/components/[component]/
├── index.ts          # Barrel exports
├── [component].tsx   # Main component
├── types.ts          # Component-specific types
├── context.ts        # React context (if needed)
├── context/
│   ├── [context]-provider.tsx
│   └── [context]-context.tsx
├── hooks/
│   └── use-[hook].ts
└── __tests__/
    └── [component].test.tsx
```

---

*Convention analysis: 2026-04-07*

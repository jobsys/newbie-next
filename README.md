# jobsys-newbie-next

AI-friendly React components built with Ant Design 6.1 and Pro Components.

## Features

- ✅ **AI 友好**：完整的 TypeScript 类型定义、详细的 JSDoc 注释、丰富的使用示例
- ✅ **自动化发版**：基于 Changesets 的版本管理和 CI/CD 自动化
- ✅ **完整测试**：单元测试、集成测试，覆盖率 > 80%
- ✅ **Playground**：交互式组件展示和文档

## Installation

```bash
pnpm add jobsys-newbie-next
```

## Quick Start

### 1. 使用 NewbieProvider

```tsx
import { NewbieProvider } from 'jobsys-newbie-next'

function App() {
  return (
    <NewbieProvider
      config={{
        locale: 'zh_CN',
        defaults: {
          NewbieForm: {
            layout: 'vertical',
          },
        },
      }}
    >
      <YourApp />
    </NewbieProvider>
  )
}
```

### 2. 使用 NewbieSearch

```tsx
import { NewbieSearch } from 'jobsys-newbie-next'
import type { SearchFieldConfig } from 'jobsys-newbie-next'

function SearchExample() {
  const fields: SearchFieldConfig[] = [
    { key: 'name', type: 'input', title: '姓名' },
    { key: 'age', type: 'number', title: '年龄' },
  ]

  return (
    <NewbieSearch
      fields={fields}
      onSubmit={(query) => {
        console.log('Search query:', query)
      }}
    />
  )
}
```

## Components

### NewbieProvider

Global configuration provider that supports default props override for all components.

**Features:**

- Global configuration management
- Component-level default props override
- Deep merge configuration
- Ant Design locale support

**Example:**

```tsx
<NewbieProvider
  config={{
    locale: 'zh_CN',
    defaults: {
      NewbieForm: { layout: 'vertical' },
      ProFormText: { placeholder: '请输入' },
    },
  }}
>
  <App />
</NewbieProvider>
```

### NewbieSearch

Advanced search component with condition filtering, sorting, and persistence.

**Features:**

- Condition filtering system (equal, notEqual, like, between, etc.)
- Expandable search items (tiled selection)
- Multi-field sorting functionality with drag-and-drop
- Custom render support for complex search scenarios
- Search record persistence
- Responsive layout

**Props:**

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `queryFields` | Search field configurations | `SearchFieldConfig[]` | `[]` |
| `sortFields` | Sort field configurations | `SortFieldConfig[]` | `[]` |
| `onSubmit` | Submit callback | `(query: QueryForm, sort: SortForm) => void` | - |
| `autoQuery` | Whether to trigger search automatically on change | `boolean` | `false` |
| `disableConditions` | Global toggle to disable condition selectors | `boolean` | `false` |
| `persistence` | Persistence key or boolean to enable storage | `boolean \| string` | `false` |

**SearchFieldConfig:**

| Property | Description | Type |
| --- | --- | --- |
| `key` | Unique field identifier | `string` |
| `type` | Field type | `'input'\|'number'\|'date'\|'select'\|'cascade'\|'textarea'` |
| `title`| Field label | `string` |
| `render` | Custom render function for the popup panel | `(props: { updateFieldValue, getFieldValue, close }) => ReactNode` |
| `getDisplayValue` | Custom display value logic for the mask | `(getFieldValue) => string` |
| `expandable` | Show options as tiled tags (for select) | `boolean \| 'single' \| 'multiple'` |

**Example:**

```tsx
<NewbieSearch
  queryFields={[
    { key: 'name', type: 'input', title: '姓名' },
    { 
      key: 'score', 
      type: 'number', 
      title: '分数',
      render: ({ updateFieldValue }) => (
        <Button onClick={() => updateFieldValue('score', 100, 'equal', 'number')}>
          Set 100
        </Button>
      )
    },
  ]}
  onSubmit={(query, sort) => {
    // query format: { name: { value: '...', condition: '...', type: 'input' } }
    console.log(query, sort)
  }}
/>
```

## Development

```bash
# Install dependencies
pnpm install

# Development (library)
pnpm dev

# Development (playground)
cd playground && pnpm dev

# Build
pnpm build

# Test
pnpm test

# Test with coverage
pnpm test:coverage

# Lint
pnpm lint

# Lint and fix
pnpm lint:fix
```

## Project Structure

```
newbie-next/
├── src/
│   ├── components/          # Components
│   │   ├── provider/        # NewbieProvider
│   │   ├── search/          # NewbieSearch
│   │   ├── form/            # NewbieForm (coming soon)
│   │   └── table/           # NewbieTable (coming soon)
│   ├── hooks/               # Custom Hooks
│   ├── utils/               # Utilities
│   └── types/               # Type definitions
├── playground/              # Playground application
├── .github/workflows/       # CI/CD configuration
└── .changeset/              # Changesets configuration
```

## Testing

The project uses Vitest and @testing-library/react for testing.

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Generate coverage report
pnpm test:coverage
```

## AI-Friendly Design

All code follows AI-friendly principles:

1. **Complete TypeScript types**: All APIs have explicit type definitions
2. **Detailed JSDoc comments**: Every function, component, and property has documentation with examples
3. **Semantic naming**: Clear variable and function names
4. **Clear code structure**: Modular, single responsibility
5. **Rich examples**: Multiple usage scenarios

## Contributing

See [DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) for detailed development guidelines.

## License

ISC

# jobsys-newbie-next

AI-friendly React components built with Ant Design 5.x and Pro Components.

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
      themeMode="system"
      primaryColor="blue"
      density="normal"
      config={{
        locale: 'zh_CN',
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
import type { NewbieProColumn } from 'jobsys-newbie-next'

function SearchExample() {
  const columns: NewbieProColumn[] = [
    { title: '姓名', dataIndex: 'name', valueType: 'text' },
    { title: '年龄', dataIndex: 'age', valueType: 'digit', sorter: true },
  ]

  return (
    <NewbieSearch
      columns={columns}
      onSubmit={(query, sort) => {
        console.log('Search query:', query)
        console.log('Sort config:', sort)
      }}
    />
  )
}
```

## Components

### NewbieProvider

Global configuration provider that supports default props override for all components.

**Features:**

- Global configuration management (Theme, Color, Density)
- Component-level default props override
- Deep merge configuration
- Ant Design locale support
- Automatic Ant Design Token translation

**Example:**

```tsx
<NewbieProvider
  themeMode="dark"
  primaryColor="#00ff00"
  density="compact"
  config={{
    locale: 'zh_CN',
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
| `columns` | Search/Table field configurations | `NewbieProColumn[]` | `[]` |
| `onSubmit` | Submit callback | `(query: QueryForm, sort: SortForm) => void` | - |
| `autoQuery` | Whether to trigger search automatically on change | `boolean` | `false` |
| `disableConditions` | Global toggle to disable condition selectors | `boolean` | `false` |

**NewbieProColumn:**

Inherits from `ProColumns` with additional properties:

| Property | Description | Type |
| --- | --- | --- |
| `title`| Field label | `string` |
| `dataIndex` | Unique field identifier | `string` |
| `valueType` | Field type | `'text'\|'digit'\|'date'\|'dateTime'\|'select'\|'cascader'\|'textarea'` |
| `sorter` | Enable sorting for this field | `boolean` |
| `fieldProps` | Additional props passed to the input component | `any` |

**Example:**

```tsx
<NewbieSearch
  columns={[
    { title: '姓名', dataIndex: 'name', valueType: 'text' },
    { 
      title: '分数', 
      dataIndex: 'score', 
      valueType: 'digit', 
      sorter: true 
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

# NewbieSearch 排序功能使用示例

## 概述

从现在开始，列表页面应该使用 `NewbieProColumn` 类型而不是 ProTable 的 `ProColumns`，并使用自定义的 `sortable` 属性来定义可排序字段。

## 为什么要使用 `sortable` 而不是 `sorter`？

- **`sorter`** 是 ProTable 的原生属性，设置后会在 ProTable 列头渲染排序操作按钮
- **`sortable`** 是 NewbieSearch 的自定义属性，仅用于标记该列支持排序，排序功能完全由 NewbieSearch 组件控制
- 使用 `sortable` 可以将排序功能完全集成到 NewbieSearch 中，提供统一的用户体验

## sortable 属性的三种模式

### 1. `sortable: true` - 可排序但无默认值

表示该字段支持排序，但初始时不会应用任何排序。

```typescript
{
  title: "姓名",
  dataIndex: "name",
  sortable: true, // 可排序，初始无排序
}
```

### 2. `sortable: 'asc' | 'desc'` - 可排序且有默认排序

表示该字段支持排序，并在初始时应用指定的排序方向。

```typescript
{
  title: "创建时间",
  dataIndex: "created_at",
  sortable: "desc", // 默认降序排序
}
```

### 3. `sortable: SortField` - 自定义排序字段

当你需要使用不同的字段名进行排序时（例如，显示 `category.name` 但按 `category_id` 排序）：

```typescript
{
  title: "分类",
  dataIndex: ["category", "name"],
  sortable: {
    key: "category_id", // 按 category_id 排序
    order: "asc"        // 默认升序
  }
}
```

## 使用示例

### 旧方式（❌ 不推荐）

```typescript
import type { ProColumns } from '@ant-design/pro-components'

const columns: ProColumns<DataType>[] = [
  {
    title: "创建时间",
    dataIndex: "created_at",
    sorter: true, // 这会在 ProTable 中渲染排序按钮
    defaultSortOrder: "descend",
  },
]
```

### 新方式（✅ 推荐）

```typescript
import type { NewbieProColumn } from "@/components/search/types"

const columns: NewbieProColumn<DataType>[] = [
  {
    title: "ID",
    dataIndex: "id",
    sortable: true, // 可排序，无默认值
  },
  {
    title: "姓名",
    dataIndex: "name",
    sortable: "asc", // 默认升序排序
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    sortable: "desc", // 默认降序排序
  },
  {
    title: "分类",
    dataIndex: ["category", "name"],
    sortable: {
      key: "category_id", // 自定义排序字段
      order: "asc"
    }
  },
  {
    title: "邮箱",
    dataIndex: "email",
    // 没有 sortable，不支持排序
  },
]
```

## 完整页面示例

```typescript
import { PageContainer } from "@ant-design/pro-components"
import { NewbieSearch } from "@/components/search"
import type { NewbieProColumn } from "@/components/search/types"

interface UserData {
  id: number
  name: string
  email: string
  created_at: string
}

export default function UserList() {
  const columns: NewbieProColumn<UserData>[] = [
    {
      title: "ID",
      dataIndex: "id",
      sortable: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
      sortable: "asc", // 默认按姓名升序
      fieldProps: {
        conditions: ["include", "equal"],
        defaultCondition: "include",
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      fieldProps: {
        conditions: ["include", "equal"],
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      valueType: "dateTime",
      sortable: "desc", // 默认按创建时间降序
      search: false, // 不在搜索中显示
    },
    {
      title: "操作",
      dataIndex: "action",
      valueType: "option",
    },
  ]

  const handleSubmit = (query, sort) => {
    console.log("查询条件:", query)
    console.log("排序条件:", sort)
    // 发起 API 请求
  }

  return (
    <PageContainer>
      <NewbieSearch columns={columns} onSubmit={handleSubmit} autoQuery>
        <ProTable
          columns={columns}
          // ... 其他 ProTable 配置
        />
      </NewbieSearch>
    </PageContainer>
  )
}
```

## 重要提示

1. **类型定义**：使用 `NewbieProColumn<DataType>` 而不是 `ProColumns<DataType>`
2. **排序模式**：
   - `sortable: true` - 可排序，无默认值
   - `sortable: 'asc' | 'desc'` - 可排序，有默认排序
   - `sortable: { key, order }` - 自定义排序字段
3. **不影响 ProTable**：`sortable` 不会影响 ProTable 的渲染，所有排序操作都在 NewbieSearch 中完成
4. **无需 defaultSortOrder**：旧的 `defaultSortOrder` 属性已废弃，直接使用 `sortable` 即可

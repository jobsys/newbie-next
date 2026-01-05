# 在 Ant Design 中使用 Lucide 图标指南

本项目使用 [Lucide React](https://lucide.dev/icons/) 替代 `@ant-design/icons`，以获得更丰富的图标选择。

## 为什么使用 Lucide？

1. **图标数量丰富**：Lucide 提供了 1000+ 个高质量图标
2. **统一风格**：所有图标采用一致的线条风格
3. **轻量级**：支持 tree-shaking，只打包使用的图标
4. **TypeScript 支持**：完整的类型定义
5. **可定制**：支持自定义大小、颜色、描边宽度等

## 基本使用

### 安装

```bash
pnpm add lucide-react
```

### 导入图标

```tsx
import { Search, Check, X, ArrowUp, ArrowDown } from 'lucide-react'
```

### 在 Ant Design 组件中使用

#### 1. Button 的 icon 属性

```tsx
import { Button } from 'antd'
import { Search, RotateCw } from 'lucide-react'

// 基本使用
<Button icon={<Search size={14} />}>搜索</Button>

// 带描边宽度
<Button icon={<RotateCw size={14} strokeWidth={2} />}>重置</Button>
```

#### 2. 作为独立元素

```tsx
import { Check, X } from 'lucide-react'

<span>
  <Check size={16} style={{ color: '#52c41a' }} />
  成功
</span>
```

#### 3. 在 Dropdown Menu 中使用

```tsx
import { Dropdown } from 'antd'
import { Check, X, Search } from 'lucide-react'

const menuItems = [
  {
    key: '1',
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Check size={14} style={{ color: '#1890ff' }} />
        选项 1
      </span>
    ),
  },
]
```

## 图标属性

Lucide 图标支持以下常用属性：

| 属性          | 类型            | 默认值         | 说明             |
| ------------- | --------------- | -------------- | ---------------- |
| `size`        | `number`        | `24`           | 图标大小（像素） |
| `strokeWidth` | `number`        | `2`            | 描边宽度         |
| `color`       | `string`        | `currentColor` | 图标颜色         |
| `style`       | `CSSProperties` | -              | 自定义样式       |
| `className`   | `string`        | -              | CSS 类名         |

## 与 Ant Design 图标大小对照

为了与 Ant Design 的图标风格保持一致，建议使用以下尺寸：

| Ant Design 图标 | Lucide 图标大小 | 使用场景         |
| --------------- | --------------- | ---------------- |
| `14px`          | `size={14}`     | 按钮图标、小尺寸 |
| `16px`          | `size={16}`     | 中等尺寸         |
| `20px`          | `size={20}`     | 较大图标         |
| `24px`          | `size={24}`     | 默认大小         |

## 最佳实践

### 1. 统一图标配置

创建一个工具函数来统一图标样式：

```tsx
// utils/icon-utils.tsx
import type { LucideIcon } from 'lucide-react'

export function createIconProps(size: number = 14) {
  return {
    size,
    strokeWidth: 2,
    style: { display: 'inline-block' } as const,
  }
}

// 使用
import { Check } from 'lucide-react'
import { createIconProps } from './utils/icon-utils'

<Check {...createIconProps(14)} />
```

### 2. 条件图标映射

```tsx
import { Check, X, Search, Filter } from 'lucide-react'

function getConditionIcon(condition: string) {
  const iconProps = { size: 14, strokeWidth: 2 }

  switch (condition) {
    case 'equal':
      return <Check {...iconProps} />
    case 'notEqual':
      return <X {...iconProps} />
    case 'include':
      return <Search {...iconProps} />
    case 'exclude':
      return <Filter {...iconProps} />
    default:
      return <Search {...iconProps} />
  }
}
```

### 3. 颜色控制

```tsx
import { Check } from 'lucide-react'

// 使用 style 设置颜色
<Check size={14} style={{ color: '#1890ff' }} />

// 使用 className 配合 CSS
<Check size={14} className="text-primary" />
```

### 4. 响应式图标

```tsx
import { Search } from 'lucide-react'
import { useMemo } from 'react'

function ResponsiveIcon({ baseSize = 14 }: { baseSize?: number }) {
  const iconSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? baseSize : baseSize * 1.2
    }
    return baseSize
  }, [baseSize])

  return <Search size={iconSize} />
}
```

## 常用图标映射

| Ant Design 图标          | Lucide 图标   | 说明      |
| ------------------------ | ------------- | --------- |
| `SearchOutlined`         | `Search`      | 搜索      |
| `ReloadOutlined`         | `RotateCw`    | 刷新/重置 |
| `DownOutlined`           | `ChevronDown` | 向下箭头  |
| `UpOutlined`             | `ChevronUp`   | 向上箭头  |
| `CheckOutlined`          | `Check`       | 选中      |
| `CloseOutlined`          | `X`           | 关闭      |
| `FilterOutlined`         | `Filter`      | 筛选      |
| `ArrowUpOutlined`        | `ArrowUp`     | 向上      |
| `ArrowDownOutlined`      | `ArrowDown`   | 向下      |
| `PlusOutlined`           | `Plus`        | 加号      |
| `MinusOutlined`          | `Minus`       | 减号      |
| `QuestionCircleOutlined` | `HelpCircle`  | 帮助      |

## 查找图标

访问 [Lucide Icons](https://lucide.dev/icons/) 查找所需图标：

1. 使用搜索框搜索图标名称
2. 浏览分类找到合适的图标
3. 点击图标查看详细信息和使用示例
4. 复制图标名称并在代码中导入

## 注意事项

1. **Tree Shaking**：确保只导入需要的图标，避免打包体积过大
2. **类型安全**：Lucide 提供完整的 TypeScript 类型定义
3. **样式一致性**：建议统一使用 `strokeWidth={2}` 保持视觉一致性
4. **性能**：Lucide 图标是 SVG 组件，渲染性能良好

## 示例代码

完整示例请参考：

- `src/components/search/components/search-item.tsx` - 条件图标使用
- `src/components/search/newbie-search.tsx` - 按钮图标使用

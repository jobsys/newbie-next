# Newbie Next 组件开发细则

本文档为 AI Agent 提供详细的开发指南，确保代码质量和 AI 友好性。

## 项目概述

**@jobsys/newbie-next** 是一个基于 React + Ant Design 5.x 的组件库，旨在提供 AI 友好的、高质量的 React 组件。

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
- **UI 库**：Ant Design 5.x
- **Pro Components**：@ant-design/pro-components
- **构建工具**：Vite
- **测试框架**：Vitest + @testing-library/react

## 项目结构

```
newbie-next/
├── src/
│   ├── components/          # 组件目录
│   │   ├── captcha/         # 验证码组件 (SlideVerify)
│   │   ├── form/            # 表单组件 (NewbieForm)
│   │   ├── icon/            # 图标组件 (NewbieIcon)
│   │   ├── provider/        # 全局上下文 (NewbieProvider)
│   │   ├── search/          # 搜索组件 (NewbieSearch)
│   │   ├── table/           # 表格组件 (NewbieTable)
│   │   └── upload/          # 上传组件 (NewbieUpload)
│   ├── hooks/               # 通用 Hooks (useHttp 等)
│   ├── utils/               # 工具函数
│   ├── types/               # 全局类型定义
│   └── index.ts             # 统一出口
├── playground/              # 演示应用
├── .agent/rules.md          # 本规则文件
└── package.json
```

## 开发规范

### 1. 组件开发规范

每个组件应包含：
- **`component-name.tsx`**: 核心逻辑
- **`pro-form-component-name.tsx`**: (可选) 适配 ProForm 的封装
- **`index.ts`**: (可选) 局部导出
- **单元测试**: `__tests__` 目录或同级 `.test.tsx` 文件

#### 示例：NewbieUpload
组件必须支持非受控和受控模式 (value/onChange)，并提供 ProForm 适配器。

**重要规则**:
- **NewbieProvider 支持**: 每新增一个组件，必须在 `src/components/provider/types.ts` 的 `ComponentDefaults` 接口中添加其配置项，并在组件内使用 `useNewbieContext` 读取默认值。
- **Playground 同步**: 新增组件或修改属性后，必须在 `playground` 目录下添加或更新相应的示例代码 (`demo`)。每个演示页面必须使用 **中文简体** 编写文档说明，并包含完整的 **API 文档** 表格，列出所有属性的：**属性、类型、默认值、必填、说明**。

```typescript
/**
 * NewbieUpload 多媒体上传组件
 * @example
 * <NewbieUpload action="/api/upload" onChange={setId} />
 */
export const NewbieUpload: React.FC<NewbieUploadProps> = ...
```

### 2. ProForm 适配规范

适配器组件命名统一为 `ProForm{ComponentName}`。
- **Props**: 继承 `FormItemProps`
- **fieldProps**: 透传给核心组件的属性放在 `fieldProps` 中

```typescript
export interface ProFormNewbieUploadProps extends FormItemProps {
  fieldProps?: Omit<NewbieUploadProps, 'value' | 'onChange'>
  // 其他 ProFormItem 特有属性
}
```

### 3. 类型定义规范

- **Interface**: 优先使用 interface 定义 Props
- **JSDoc**: 必须包含组件描述、Props 说明和 `@example`

```typescript
/**
 * 搜索字段配置
 * @example
 * { key: 'name', type: 'input', title: '姓名' }
 */
export interface SearchFieldConfig { ... }
```

### 4. 导出规范

所有公共组件和类型必须在 `src/index.ts` 中显式导出。

```typescript
// Upload
export { NewbieUpload } from "./components/upload/newbie-upload"
export type { NewbieUploadProps } from "./components/upload/newbie-upload"
export { ProFormNewbieUpload } from "./components/upload/pro-form-newbie-upload"
```

### 5. 暗黑模式支持规范

所有组件必须原生支持暗黑模式，严禁硬编码颜色。

- **禁止硬编码**: 严禁在样式中使用 Hex/RGB 颜色字符串（如 `#fff`, `#f0f0f0`, `#000`）。
- **Token 获取**: 必须导入 `theme` 并使用 `theme.useToken()` 获取 Ant Design 的 Design Token。
- **样式应用**:
  - **背景色**: 使用 `token.colorBgContainer` (默认背景), `token.colorFillQuaternary` (浅灰背景/Hover), `token.colorFillAlter` (强调背景)。
  - **文本色**: 使用 `token.colorText` (正文), `token.colorTextSecondary` (次要), `token.colorPrimary` (品牌色)。
  - **边框色**: 使用 `token.colorBorder` (默认边框), `token.colorBorderSecondary` (分割线)。
- **一致性**: 确保组件在 `NewbieProvider` 的 `themeMode` 切换时能即时响应颜色变化。

```tsx
import { theme } from "antd";

const MyComponent = () => {
  const { token } = theme.useToken();
  return (
    <div style={{ background: token.colorBgContainer, border: `1px solid ${token.colorBorder}` }}>
      <span style={{ color: token.colorText }}>Content</span>
    </div>
  );
};
```

## 常用组件指南

### 1. NewbieSearch
- **功能**: 高级搜索栏，支持动态表单项和复杂查询条件。
- **关键属性**: `fields` (配置), `onSubmit` (回调).

### 2. NewbieUpload
- **功能**: 单文件/多文件上传，标准化 API 响应处理。
- **关键属性**: `action` (API路径), `value` (ID/UUID), `maxSize`.

### 3. SlideVerify
- **功能**: 滑块验证码，用于登录或高敏操作。
- **关键属性**: `onSuccess` (验证通过回调).

## 提交与发版

1. **Changeset**: 任何修改需运行 `pnpm changeset` 添加变更说明。
2. **Lint**: 提交前运行 `pnpm lint`。
3. **Test**: 运行 `pnpm test` 确保无回归。

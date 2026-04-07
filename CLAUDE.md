# Newbie-Next 项目指南

> AI-friendly React 组件库，基于 Ant Design 6 构建

---

## 快速开始

```bash
pnpm install
pnpm dev          # 启动 playground (http://localhost:3000)
pnpm test         # 运行测试
pnpm build        # 构建组件库
```

---

## 项目结构

```
newbie-next/
├── src/                      # 组件库源码
│   ├── components/           # 组件目录
│   │   ├── captcha/          # 滑块验证码
│   │   ├── icon/             # 图标组件
│   │   ├── provider/         # 全局配置
│   │   ├── search/           # 搜索组件
│   │   └── upload/           # 上传组件
│   ├── hooks/                # 通用 Hooks
│   ├── utils/                # 工具函数
│   └── index.ts              # 统一出口
├── playground/               # 演示应用
├── .agent/rules/             # Agent 规则
└── .planning/                # GSD 规划文档
```

---

## 核心约束（不可违反）

| 约束 | 说明 |
|------|------|
| **AI 友好** | 完整 TypeScript 类型 + 详细 JSDoc 注释 |
| **测试覆盖** | > 80% 覆盖率 |
| **代码检查** | 必须通过 oxlint |
| **暗黑模式** | 禁止硬编码颜色，必须使用 Ant Design Token |
| **中文文档** | 所有文档和注释使用简体中文 |

**Token 使用示例：**
```tsx
const { token } = theme.useToken()
// ✅ 正确: token.colorBgContainer
// ❌ 错误: '#ffffff'
```

---

## 文档索引

| 文档 | 用途 | 何时查阅 |
|------|------|----------|
| `.agent/rules/CORE_RULES.md` | 详细开发规范、组件标准、最佳实践 | **每次开发新功能时必读** |
| `.agent/rules/LUCIDE_ICONS_GUIDE.md` | Lucide 图标使用指南 | 使用图标时 |
| `.planning/codebase/CONCERNS.md` | 技术债务、已知问题、性能陷阱 | 重构或优化时 |
| `.planning/codebase/ARCHITECTURE.md` | 架构设计、数据流 | 理解系统设计时 |

---

## 技术栈

- **包管理器**: pnpm
- **框架**: React 19 + TypeScript 6
- **UI 库**: Ant Design 6.x + @ant-design/pro-components 3.x
- **构建**: Vite 8
- **测试**: Vitest + @testing-library/react
- **图标**: Lucide React

---

## 发布流程

1. `pnpm test` - 确保测试通过
2. `pnpm changeset` - 添加变更说明
3. `pnpm version` - 更新版本号
4. `pnpm release` - 构建并发布

---

*Claude Code / GSD / OMC 自动加载此文档*

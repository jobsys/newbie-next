# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- **TypeScript 6.0.2** - Main development language for the library
- **TSX** - React component development

**Secondary:**
- **JSON** - Configuration files
- **JavaScript** - Vite config (legacy `.js` files exist)

## Runtime

**Environment:**
- **Browser (DOM)** - React component library for web applications
- **Node.js** - Build tooling and development server

**Package Manager:**
- **pnpm** - Used for dependency management (evidenced by `pnpm-lock.yaml` and pre-commit hooks)
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- **React 19.2.4** (peer dependency: ^18.0.0 || ^19.0.0) - UI component library base
- **React DOM 19.2.4** - DOM rendering

**UI Framework:**
- **Ant Design (antd) 6.3.5** (peer dependency: ^5.0.0 || ^6.0.0) - Core UI component library
- **@ant-design/pro-components 3.1.2-0** (peer dependency: ^2.0.0 || ^3.0.0) - Advanced Pro components
- **@ant-design/icons 6.1.1** - Icon library
- **@ant-design/cssinjs 2.1.2** - CSS-in-JS styling solution

**Build/Dev:**
- **Vite 8.0.5** - Development server and build tool
- **@vitejs/plugin-react 5.1.2** - React plugin for Vite
- **vite-plugin-dts 4.5.4** - TypeScript declaration generation
- **vite-plugin-progress 0.0.7** - Build progress indicator

**Testing:**
- **Vitest 4.0.16** - Unit testing framework
- **@testing-library/react 16.3.1** - React component testing utilities
- **@testing-library/jest-dom 6.9.1** - DOM assertions
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **jsdom 27.3.0** - Browser environment simulation for tests

**Linting/Formatting:**
- **oxlint 1.59.0** - Fast JavaScript/TypeScript linter
- **oxfmt 0.44.0** - Code formatter

## Key Dependencies

**Critical:**
- **axios 1.14.0** - HTTP client for API requests
  - Configured in `src/utils/http.ts` with interceptors for error handling
- **dayjs 1.11.20** - Date manipulation library
  - Extended with weekday and localeData plugins
- **lodash-es 4.18.1** - Utility library (ES modules version)
- **lucide-react 1.7.0** - Modern icon library

**Drag & Drop:**
- **@dnd-kit/core 6.3.1** - Drag and drop primitives
- **@dnd-kit/sortable 10.0.0** - Sortable components
- **@dnd-kit/utilities 3.2.2** - DnD utilities

**Release Management:**
- **@changesets/cli 2.27.9** - Versioning and changelog management

**Git Hooks:**
- **husky 9.1.7** - Git hooks management
- **lint-staged 16.2.7** - Run linters on staged files

## Configuration

**TypeScript Configuration:**
- `tsconfig.json` - Main config targeting ES2020, DOM libraries
- `tsconfig.node.json` - Node-specific config for Vite config
- `playground/tsconfig.json` - Playground app config

**Path Aliases:**
- `@/*` → `./src/*` - Source directory alias

**Vite Configuration:**
- Library mode build with ES modules output
- External dependencies: react, react-dom, antd, @ant-design/pro-components, lucide-react, dayjs, lodash-es, @ant-design/icons, @dnd-kit/*, axios

**Formatting (.oxfmtrc.jsonc):**
- Print width: 150
- Tab width: 4, uses tabs
- No semicolons, double quotes
- Trailing commas: all
- Arrow parens: always

**Linting (.oxlintrc.jsonc):**
- Plugins: oxc, eslint, react, unicorn
- Enforces correctness, style, suspicious categories
- React hooks rules enabled
- camelCase enforcement

**Testing (vitest config in vite.config.ts):**
- Globals: true
- Environment: jsdom
- Setup files: `./src/test/setup.ts`
- Coverage: v8 provider with text, json, html reporters

**Version Control:**
- Pre-commit hook: `pnpm exec lint-staged`
- lint-staged runs `oxfmt` on `*.{ts,tsx,js,jsx}`

## Platform Requirements

**Development:**
- Node.js (version not specified in .nvmrc)
- pnpm package manager
- Modern browser for testing

**Production:**
- Target: ES2020
- Module format: ES modules (es)
- JSX transform: react-jsx

**Browser Support:**
- Modern browsers with ES2020 support
- DOM APIs: ResizeObserver (mocked in tests)

---

*Stack analysis: 2026-04-07*

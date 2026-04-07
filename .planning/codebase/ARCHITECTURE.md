# Architecture

**Analysis Date:** 2025-04-07

## Pattern Overview

**Overall:** Component Library with Provider Pattern + Context-based State Management

**Key Characteristics:**
- React component library extending Ant Design Pro Components
- Provider-based global configuration and theme management
- Context-based state management for complex components (Search)
- Composable component architecture with hooks
- Barrel file pattern for clean exports
- TypeScript-first with comprehensive type definitions

## Layers

**Component Layer:**
- Purpose: UI components that extend Ant Design functionality
- Location: `src/components/`
- Contains: React components with JSX, styling via Ant Design tokens
- Depends on: Utils, Hooks, Types
- Used by: Consumer applications

**Context Layer:**
- Purpose: State management via React Context API
- Location: `src/components/*/context/`
- Contains: Context providers and hooks for component state
- Depends on: React Context API
- Used by: Component Layer

**Hook Layer:**
- Purpose: Reusable React hooks for HTTP, validation, and component logic
- Location: `src/hooks/`
- Contains: Custom hooks (useHttp, useRegex)
- Depends on: Utils (http client)
- Used by: Component Layer, Consumer applications

**Utils Layer:**
- Purpose: Utility functions and HTTP client
- Location: `src/utils/`
- Contains: HTTP client, merge utilities, classNames
- Depends on: Axios, external dependencies
- Used by: Component Layer, Hook Layer

**Types Layer:**
- Purpose: Shared TypeScript type definitions
- Location: `src/types/`
- Contains: Base interfaces, common types
- Depends on: None
- Used by: All layers

## Data Flow

**Search Component Flow:**

1. Columns configuration passed to `NewbieSearch` (`src/components/search/newbie-search.tsx`)
2. `SearchProvider` initializes query and sort state from columns (`src/components/search/context/search-provider.tsx`)
3. User interactions trigger `updateFieldValue` via context
4. `SearchItem` renders field-specific inputs with condition selectors (`src/components/search/components/search-item.tsx`)
5. Submit action filters valid values and calls `onSubmit` callback
6. Sort management via drag-and-drop with `@dnd-kit`

**Provider Configuration Flow:**

1. `NewbieProvider` accepts configuration at app root (`src/components/provider/newbie-provider.tsx`)
2. Configuration merged with defaults using `deepMerge` (`src/utils/merge.ts`)
3. `useNewbieContext` provides access to config and `mergeProps` function (`src/components/provider/context.ts`)
4. Components merge their props with context defaults

**HTTP Flow:**

1. `createHttpClient` creates configured Axios instance (`src/utils/http.ts`)
2. Response interceptor extracts data and handles Laravel-style responses
3. `useHttp` hook manages request state in components (`src/hooks/use-http.ts`)
4. CSRF token auto-extracted from meta tags or cookies

## Key Abstractions

**NewbieProColumn:**
- Purpose: Extended ProTable column type for search functionality
- Examples: `src/components/search/types.ts`
- Pattern: Extension of `@ant-design/pro-components` ProColumnType with search-specific fields

**Component Provider Pattern:**
- Purpose: Global configuration and default props management
- Examples: `src/components/provider/newbie-provider.tsx`
- Pattern: Context-based with deep merge for nested config

**Search Context:**
- Purpose: Centralized search state management
- Examples: `src/components/search/context/search-provider.tsx`, `src/components/search/context/search-context.tsx`
- Pattern: Compound component pattern with context

**Icon Adapter:**
- Purpose: Bridge Lucide icons to Ant Design icon system
- Examples: `src/components/icon/newbie-icon.tsx`
- Pattern: Wrapper component using `@ant-design/icons` Icon component

## Entry Points

**Library Entry:**
- Location: `src/index.ts`
- Triggers: Imported by consumer applications
- Responsibilities: Exports all public components, types, hooks, and utilities

**Component Entry Points:**
- `src/components/search/index.ts` - Search component exports
- `src/components/provider/index.ts` - Provider exports
- `src/components/icon/index.ts` - Icon component exports
- `src/components/captcha/index.ts` - Captcha component exports

**Playground Entry:**
- Location: `playground/src/App.tsx`
- Triggers: Development server (vite dev)
- Responsibilities: Component showcase and testing environment

## Error Handling

**Strategy:** Centralized in HTTP client with custom callbacks

**Patterns:**
- HTTP errors handled in response interceptor (`src/utils/http.ts`)
- Business logic errors detected via `{ status: "SUCCESS", result: ... }` pattern
- Custom error handlers via `onError` and `onUnauthorized` options
- Context hooks throw if used outside provider

## Cross-Cutting Concerns

**Logging:** Console.error for failed option loading in SearchProvider

**Validation:** Regex validation rules via `useRegexRule` (`src/hooks/use-regex.ts`)

**Authentication:** CSRF token handling in HTTP client; 401/403 error handlers

**Styling:** Ant Design token-based styling with density configuration (loose/normal/compact)

**Theming:** Supports light/dark modes via ConfigProvider integration

---

*Architecture analysis: 2025-04-07*

# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**HTTP/REST APIs:**
- **Axios-based HTTP client** - Configurable HTTP client in `src/utils/http.ts`
  - Supports custom base URLs
  - Built-in interceptors for request/response handling
  - Error handling with customizable callbacks
  - CSRF token support (meta tag or cookie-based)
  - Inertia.js response compatibility

**HTTP Client Configuration:**
```typescript
// Location: src/utils/http.ts, src/hooks/use-http.ts
interface HttpOptions {
  baseUrl?: string           // API base path
  disabledError?: boolean    // Disable global error notifications
  onError?: (message, error) => void     // Error handler callback
  onUnauthorized?: (error) => void       // 401 handler callback
}
```

## Data Storage

**Databases:**
- Not applicable - This is a UI component library, no direct database connections

**File Storage:**
- Local filesystem only - Build outputs to `dist/` directory

**Caching:**
- None detected - No Redis, localStorage, or other caching mechanisms

**State Management:**
- React Context API for component-level state
  - `SearchContext` in `src/components/search/context/`
  - `NewbieContext` in `src/components/provider/context.ts`

## Authentication & Identity

**Auth Provider:**
- Custom implementation via HTTP client interceptors
- Supports:
  - CSRF token extraction from meta tags (`<meta name="csrf-token">`)
  - Laravel-style XSRF-TOKEN cookie support
  - 401 Unauthorized handling via `onUnauthorized` callback
  - 403 Forbidden handling

## Monitoring & Observability

**Error Tracking:**
- None - Custom error handling via `onError` callbacks only

**Logs:**
- Console-based logging (development only)
- No external logging service integration

## CI/CD & Deployment

**Hosting:**
- NPM Registry (public)
  - Config: `registry.npmjs.org`
  - Published as `@jobsys/newbie-next`

**CI Pipeline:**
- GitHub Actions (directory exists: `.github/`)
- Changesets for automated versioning and publishing

**Release Process:**
```bash
pnpm build && changeset publish
```

**Build Artifacts:**
- Output directory: `dist/`
- Files: `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`

## Environment Configuration

**Required env vars:**
- None required for the library itself
- Environment-specific configuration passed via `NewbieProvider` or HTTP client setup

**Configuration Pattern:**
```typescript
// Global configuration via NewbieProvider
<NewbieProvider config={{ theme, httpClient, componentDefaults }}>
  <App />
</NewbieProvider>
```

## Webhooks & Callbacks

**Incoming:**
- None - This is a client-side library

**Outgoing:**
- None - No webhook calls made by the library

## Third-Party Services Integration

**Icon Libraries:**
- **Lucide React** - Modern icon set (`lucide-react`)
- **Ant Design Icons** - Ant Design's icon library (`@ant-design/icons`)

**Date/Time:**
- **Day.js** - Date manipulation with plugins:
  - `weekday` plugin
  - `localeData` plugin

**Drag & Drop:**
- **@dnd-kit** - Modern drag and drop toolkit

## Deployment Dependencies

**Build-time:**
- Vite 8.0.5
- TypeScript 6.0.2
- Rollup (via Vite)

**Runtime (peer dependencies):**
- React ^18.0.0 || ^19.0.0
- React DOM ^18.0.0 || ^19.0.0
- Ant Design ^5.0.0 || ^6.0.0
- @ant-design/pro-components ^2.0.0 || ^3.0.0

---

*Integration audit: 2026-04-07*

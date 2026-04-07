# Codebase Structure

**Analysis Date:** 2025-04-07

## Directory Layout

```
newbie-next/
├── src/                          # Main source code
│   ├── components/               # React components
│   │   ├── captcha/              # Slide verification component
│   │   ├── icon/                 # Lucide icon adapter
│   │   ├── provider/             # Global config provider
│   │   ├── search/               # Advanced search component
│   │   │   ├── components/       # Sub-components
│   │   │   ├── context/          # Context providers
│   │   │   ├── hooks/            # Search-specific hooks
│   │   │   ├── utils/            # Search utilities
│   │   │   └── __tests__/        # Search tests
│   │   └── upload/               # Upload components
│   ├── hooks/                    # Reusable React hooks
│   │   └── __tests__/            # Hook tests
│   ├── types/                    # Shared TypeScript types
│   ├── utils/                    # Utility functions
│   │   └── __tests__/            # Utils tests
│   └── test/                     # Test utilities
├── playground/                   # Development playground
│   └── src/
│       ├── demos/                # Component demos
│       └── App.tsx               # Playground entry
├── docs/                         # Documentation
├── dist/                         # Build output
├── .agent/                       # AI agent rules and skills
├── .changeset/                   # Changeset versioning
├── .github/                      # GitHub workflows
└── .planning/                    # Planning documents
```

## Directory Purposes

**src/components/:**
- Purpose: React component implementations
- Contains: Component folders with index.ts, main component, types
- Key files: `src/components/search/newbie-search.tsx`, `src/components/provider/newbie-provider.tsx`

**src/components/search/:**
- Purpose: Complex search component with context-based state
- Contains: Provider, context, sub-components, hooks, utilities
- Key files: `src/components/search/context/search-provider.tsx`, `src/components/search/components/search-item.tsx`

**src/hooks/:**
- Purpose: Reusable React hooks
- Contains: HTTP hook, regex hook
- Key files: `src/hooks/use-http.ts`, `src/hooks/use-regex.ts`

**src/utils/:**
- Purpose: Shared utility functions
- Contains: HTTP client, deep merge, classNames
- Key files: `src/utils/http.ts`, `src/utils/merge.ts`

**src/types/:**
- Purpose: Shared TypeScript interfaces
- Contains: Base config interface
- Key files: `src/types/index.ts`

**src/test/:**
- Purpose: Test utilities and setup
- Contains: Test setup, utilities
- Key files: `src/test/setup.ts`, `src/test/test-utils.tsx`

**playground/src/demos/:**
- Purpose: Component showcase and testing
- Contains: Demo implementations for each component
- Key files: `playground/src/demos/search-demo.tsx`, `playground/src/App.tsx`

## Key File Locations

**Entry Points:**
- `src/index.ts`: Library public API export
- `playground/src/main.tsx`: Playground entry (implied)

**Configuration:**
- `package.json`: Package metadata and dependencies
- `tsconfig.json`: TypeScript configuration with path aliases
- `vite.config.ts`: Build and test configuration

**Core Logic:**
- `src/components/provider/newbie-provider.tsx`: Global configuration provider
- `src/components/search/context/search-provider.tsx`: Search state management
- `src/utils/http.ts`: HTTP client with Axios

**Testing:**
- `src/test/setup.ts`: Vitest setup
- `src/components/search/__tests__/newbie-search.test.tsx`: Search component tests
- `src/components/provider/__tests__/newbie-provider.test.tsx`: Provider tests

## Naming Conventions

**Files:**
- Components: PascalCase with "newbie-" prefix (e.g., `newbie-search.tsx`)
- Utilities: camelCase (e.g., `use-http.ts`, `merge.ts`)
- Types: kebab-case with `.ts` extension (e.g., `types.ts`)
- Tests: `.test.ts` or `.test.tsx` suffix

**Directories:**
- Components: kebab-case (e.g., `search/`, `provider/`)
- Sub-directories: plural nouns (e.g., `hooks/`, `utils/`, `components/`)

**Exports:**
- Barrel files use `index.ts` for clean imports
- Named exports preferred over default exports
- Types exported alongside implementations

## Where to Add New Code

**New Component:**
- Primary code: `src/components/{component-name}/`
- Barrel export: `src/components/{component-name}/index.ts`
- Types: `src/components/{component-name}/types.ts`
- Tests: `src/components/{component-name}/__tests__/{component-name}.test.tsx`
- Demo: `playground/src/demos/{component-name}-demo.tsx`
- Update: `src/index.ts` to export new component

**New Hook:**
- Implementation: `src/hooks/use-{hook-name}.ts`
- Tests: `src/hooks/__tests__/use-{hook-name}.test.ts`
- Update: `src/index.ts` to export new hook

**New Utility:**
- Implementation: `src/utils/{utility-name}.ts`
- Tests: `src/utils/__tests__/{utility-name}.test.ts`
- Update: `src/utils/index.ts` to export

**New Type:**
- Shared types: `src/types/index.ts`
- Component-specific types: `src/components/{component}/types.ts`

## Special Directories

**dist/:**
- Purpose: Build output
- Generated: Yes (by vite build)
- Committed: No (in .gitignore)

**playground/:**
- Purpose: Component development and testing environment
- Generated: No
- Committed: Yes

**.agent/:**
- Purpose: AI agent rules and skill definitions
- Generated: No
- Committed: Yes

**node_modules/.pnpm/:**
- Purpose: pnpm package store
- Generated: Yes
- Committed: No

---

*Structure analysis: 2025-04-07*

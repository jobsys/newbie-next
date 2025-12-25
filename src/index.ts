/**
 * @jobsys/newbie-next
 *
 * AI-friendly React components built with Ant Design 6.1
 */

// Provider
export { NewbieProvider, useNewbieContext } from "./components/provider"
export type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue, ComponentDefaults } from "./components/provider"

// Form (will be implemented)
// export { NewbieForm } from './components/form'
// export type { NewbieFormProps } from './components/form'

// Search
export { NewbieSearch, SearchProvider, useSearchContext } from "./components/search"
export type {
	NewbieProColumn as SearchFieldConfig,
	NewbieProColumn,
	QueryForm,
	FieldValue,
	Condition,
	NewbieSearchProps,
	SearchContextValue,
	SearchProviderProps,
} from "./components/search"

// Table (will be implemented)
// export { NewbieTable } from './components/table'
// export type { NewbieTableProps } from './components/table'

// Types
export type * from "./types"

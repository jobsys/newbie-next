/**
 * Search component exports
 */

export { NewbieSearch } from "./newbie-search"
export { SearchProvider } from "./context/search-provider"
export { useSearchContext } from "./context/search-context"
export { SearchItem } from "./components/search-item"
export { useSearchField } from "./hooks/use-search-field"
export { useClickOutside } from "./hooks/use-click-outside"
export type { SearchProviderProps } from "./context/search-provider"
export type { SearchContextValue } from "./context/search-context"
export type {
	SearchFieldConfig,
	QueryForm,
	FieldValue,
	Condition,
	NewbieSearchProps,
	SortFieldConfig,
	QueryItem,
	SortForm,
	SortField,
	SortOrder,
} from "./types"
export type { UseSearchFieldOptions, UseSearchFieldReturn } from "./hooks/use-search-field"
export type { SearchItemProps } from "./components/search-item"
export { getFieldConditions, getConditionLabel } from "./utils/conditions"

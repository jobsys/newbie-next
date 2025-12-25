/**
 * SearchContext
 *
 * Provides search state management and configuration
 */

import { createContext, useContext } from "react"
import type { SearchFieldConfig, QueryForm, FieldValue, SortForm, SortOrder, SortFieldConfig, SearchCondition } from "../types"

/**
 * Search context value
 */
export interface SearchContextValue {
	/** Current query form */
	queryForm: QueryForm
	/** Get field value */
	getFieldValue: (key: string) => FieldValue | undefined
	/** Update field value */
	updateFieldValue: (key: string, value: any, condition?: SearchCondition, type?: string) => void
	/** Reset field value */
	resetFieldValue: (key: string) => void
	/** Reset all fields */
	resetAll: () => void
	/** Submit search */
	submit: () => void
	/** Search field configurations */
	queryFields: SearchFieldConfig[]
	/** Sort field configurations */
	sortFields: SortFieldConfig[]
	/** Whether to disable condition selection for all fields */
	disableConditions: boolean
	/** Whether to auto query on change */
	autoQuery: boolean
	/** Helper to check if a field has valid content */
	isFieldValueValid: (key: string, value: FieldValue) => boolean
	/** Whether search has been submitted */
	hasSubmitted: boolean
	/** Submitted query form snapshot (only updated on submit) */
	submittedQueryForm: QueryForm

	/** Current sort form */
	sortForm: SortForm
	/** Submitted sort form snapshot */
	submittedSortForm: SortForm
	/** Add sort field */
	addSort: (key: string, order?: SortOrder) => void
	/** Remove sort field */
	removeSort: (key: string) => void
	/** Update sort field */
	updateSort: (key: string, order: SortOrder) => void
	/** Reorder sort field */
	reorderSort: (oldIndex: number, newIndex: number) => void
	/** Toggle sort field (add or toggle order) */
	toggleSort: (key: string) => void
}

/**
 * SearchContext
 */
export const SearchContext = createContext<SearchContextValue | null>(null)

/**
 * Hook to access SearchContext
 *
 * @returns SearchContext value
 * @throws Error if used outside SearchProvider
 *
 * @example
 * ```tsx
 * const { queryForm, updateFieldValue, submit } = useSearchContext()
 * ```
 */
export function useSearchContext(): SearchContextValue {
	const context = useContext(SearchContext)
	if (!context) {
		throw new Error("useSearchContext must be used within SearchProvider")
	}
	return context
}

/**
 * SearchContext
 *
 * Provides search state management and configuration
 */

import { createContext, useContext } from "react"
import type { SearchFieldConfig, QueryForm, FieldValue } from "../types"

/**
 * Search context value
 */
export interface SearchContextValue {
	/** Current query form */
	queryForm: QueryForm
	/** Get field value */
	getFieldValue: (key: string) => FieldValue | undefined
	/** Update field value */
	updateFieldValue: (key: string, value: FieldValue) => void
	/** Reset field value */
	resetFieldValue: (key: string) => void
	/** Reset all fields */
	resetAll: () => void
	/** Submit search */
	submit: () => void
	/** Field configurations */
	fields: SearchFieldConfig[]
	/** Helper to check if a field has valid content */
	isFieldValueValid: (key: string, value: FieldValue) => boolean
	/** Whether search has been submitted */
	hasSubmitted: boolean
	/** Submitted query form snapshot (only updated on submit) */
	submittedQueryForm: QueryForm
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

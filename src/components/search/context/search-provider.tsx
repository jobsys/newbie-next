/**
 * SearchProvider
 *
 * Provides search state management context
 */

import { useState, useCallback, useMemo, type ReactNode } from "react"
import { SearchContext, type SearchContextValue } from "./search-context"
import type { SearchFieldConfig, QueryForm, FieldValue } from "../types"

/**
 * SearchProvider props
 */
export interface SearchProviderProps {
	/** Field configurations */
	fields: SearchFieldConfig[]
	/** Submit callback */
	onSubmit?: (query: QueryForm) => void
	/** Initial query form */
	initialQueryForm?: QueryForm
	/** Children components */
	children: ReactNode
}

/**
 * SearchProvider Component
 *
 * Provides search state management context for NewbieSearch
 *
 * @param props - Component props
 * @returns Provider component
 *
 * @example
 * ```tsx
 * <SearchProvider
 *   fields={fields}
 *   onSubmit={(query) => console.log(query)}
 * >
 *   <SearchFields />
 * </SearchProvider>
 * ```
 */
export function SearchProvider(props: SearchProviderProps): JSX.Element {
	const { fields, onSubmit, initialQueryForm = {}, children } = props

	// Initialize query form from fields
	const initialForm = useMemo<QueryForm>(() => {
		const form: QueryForm = { ...initialQueryForm }
		fields.forEach((field) => {
			if (!form[field.key]) {
				form[field.key] = {
					value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
					condition: field.defaultCondition ?? "equal",
				}
			}
		})
		return form
	}, [fields, initialQueryForm])

	const [queryForm, setQueryForm] = useState<QueryForm>(initialForm)
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [submittedQueryForm, setSubmittedQueryForm] = useState<QueryForm>({})

	// Get field value
	const getFieldValue = useCallback(
		(key: string): FieldValue | undefined => {
			return queryForm[key]
		},
		[queryForm],
	)

	// Update field value
	const updateFieldValue = useCallback((key: string, value: FieldValue) => {
		setQueryForm((prev) => ({
			...prev,
			[key]: value,
		}))
	}, [])

	// Reset field value
	const resetFieldValue = useCallback(
		(key: string) => {
			const field = fields.find((f) => f.key === key)
			if (field) {
				setQueryForm((prev) => ({
					...prev,
					[key]: {
						value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
						condition: field.defaultCondition ?? "equal",
					},
				}))
				// Also remove from submitted query form if it exists
				setSubmittedQueryForm((prev) => {
					const newForm = { ...prev }
					delete newForm[key]
					// If no fields left, reset hasSubmitted
					const hasAnyFields = Object.keys(newForm).length > 0
					if (!hasAnyFields) {
						setHasSubmitted(false)
					}
					return newForm
				})
			}
		},
		[fields],
	)

	// Reset all fields
	const resetAll = useCallback(() => {
		const form: QueryForm = {}
		fields.forEach((field) => {
			form[field.key] = {
				value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
				condition: field.defaultCondition ?? "equal",
			}
		})
		setQueryForm(form)
		setHasSubmitted(false)
		setSubmittedQueryForm({})
	}, [fields])

	// Helper to check if a field has valid content
	const isFieldValueValid = useCallback(
		(fieldKey: string, fieldValue: FieldValue) => {
			const field = fields.find((f) => f.key === fieldKey)
			if (!field) return false

			const { value, condition } = fieldValue

			// Special conditions are always valid
			if (condition === "null" || condition === "notNull") {
				return true
			}

			// Check for empty values
			if (value === undefined || value === null || value === "") {
				return false
			}

			// For textarea, check if there's at least one non-empty line
			if (field.type === "textarea" && typeof value === "string") {
				const lines = value.split("\n").map((line) => line.trim()).filter((line) => line !== "")
				return lines.length > 0
			}

			if (Array.isArray(value)) {
				if (condition === "between") {
					// For range, both must be present
					return (
						value.length === 2 &&
						value[0] !== undefined &&
						value[0] !== null &&
						value[0] !== "" &&
						value[1] !== undefined &&
						value[1] !== null &&
						value[1] !== ""
					)
				}
				// For multiple select or other arrays, must have at least one item
				return value.some((v) => v !== undefined && v !== null && v !== "")
			}

			return true
		},
		[fields],
	)

	// Submit search
	const submit = useCallback(() => {
		const filteredQuery: QueryForm = {}

		Object.entries(queryForm).forEach(([key, fieldValue]) => {
			if (isFieldValueValid(key, fieldValue)) {
				// For null/notNull conditions, ensure value is undefined
				if (fieldValue.condition === "null" || fieldValue.condition === "notNull") {
					filteredQuery[key] = {
						condition: fieldValue.condition,
						value: undefined,
					}
				} else {
					// For textarea fields, convert multi-line text to array (one item per line)
					const field = fields.find((f) => f.key === key)
					if (field?.type === "textarea" && typeof fieldValue.value === "string") {
						const lines = fieldValue.value
							.split("\n")
							.map((line) => line.trim())
							.filter((line) => line !== "")
						filteredQuery[key] = {
							...fieldValue,
							value: lines,
						}
					} else {
						filteredQuery[key] = fieldValue
					}
				}
			}
		})

		// Save the submitted query form snapshot
		setSubmittedQueryForm(filteredQuery)
		setHasSubmitted(true)
		onSubmit?.(filteredQuery)
	}, [queryForm, onSubmit, isFieldValueValid, fields])

	// Context value
	const contextValue = useMemo<SearchContextValue>(
		() => ({
			queryForm,
			getFieldValue,
			updateFieldValue,
			resetFieldValue,
			resetAll,
			submit,
			fields,
			isFieldValueValid,
			hasSubmitted,
			submittedQueryForm,
		}),
		[queryForm, getFieldValue, updateFieldValue, resetFieldValue, resetAll, submit, fields, isFieldValueValid, hasSubmitted, submittedQueryForm],
	)

	return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

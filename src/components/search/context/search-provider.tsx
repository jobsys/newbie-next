/**
 * SearchProvider
 *
 * Provides search state management context
 */

import { useState, useCallback, useMemo, type ReactNode } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import { SearchContext, type SearchContextValue } from "./search-context"
import type { SearchFieldConfig, QueryForm, FieldValue, SortForm, SortOrder, SortFieldConfig, QueryItem } from "../types"

/**
 * SearchProvider props
 */
export interface SearchProviderProps {
	/** Search field configurations */
	queryFields: SearchFieldConfig[]
	/** Sort field configurations */
	sortFields?: SortFieldConfig[]
	/** Submit callback */
	onSubmit?: (query: QueryItem[], sort: SortForm) => void
	/** Initial query form */
	initialQueryForm?: QueryForm
	/** Children components */
	children: ReactNode
}

/**
 * SearchProvider Component
// ... (keeping existing comments if possible, but replace_file_content replaces block)
 */
export function SearchProvider(props: SearchProviderProps): JSX.Element {
	const { queryFields: rawQueryFields, sortFields = [], onSubmit, initialQueryForm = {}, children } = props

	// Sort query fields by order (larger number comes first)
	const queryFields = useMemo(() => {
		return [...rawQueryFields].sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
	}, [rawQueryFields])

	// ... (keep initialForm memo)
	const initialForm = useMemo<QueryForm>(() => {
		const form: QueryForm = { ...initialQueryForm }
		queryFields.forEach((field) => {
			if (!form[field.key]) {
				form[field.key] = {
					value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
					condition: field.defaultCondition ?? "equal",
				}
			}
		})
		return form
	}, [queryFields, initialQueryForm])

	const [queryForm, setQueryForm] = useState<QueryForm>(initialForm)
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [submittedQueryForm, setSubmittedQueryForm] = useState<QueryForm>({})

	// Sort state reference from fields
	const initialSortForm = useMemo<SortForm>(() => {
		return (
			sortFields
				?.filter((f) => f.direction)
				.map((f) => ({
					key: f.key,
					order: f.direction!,
				})) || []
		)
	}, [sortFields])

	const [sortForm, setSortForm] = useState<SortForm>(initialSortForm)
	const [submittedSortForm, setSubmittedSortForm] = useState<SortForm>(initialSortForm)

	// ... (keep addSort, removeSort, updateSort, toggleSort)
	// Add sort field
	const addSort = useCallback(
		(key: string) => {
			setSortForm((prev) => {
				if (prev.find((s) => s.key === key)) return prev
				const field = sortFields.find((f) => f.key === key)
				const defaultOrder = field?.direction || "asc"
				return [...prev, { key, order: defaultOrder }]
			})
		},
		[sortFields],
	)

	// Remove sort field
	const removeSort = useCallback((key: string) => {
		setSortForm((prev) => prev.filter((s) => s.key !== key))
		setSubmittedSortForm((prev) => prev.filter((s) => s.key !== key))
	}, [])

	// Update sort field
	const updateSort = useCallback((key: string, order: SortOrder) => {
		setSortForm((prev) => prev.map((s) => (s.key === key ? { ...s, order } : s)))
	}, [])

	// Reorder sort field
	const reorderSort = useCallback((oldIndex: number, newIndex: number) => {
		setSortForm((prev) => arrayMove(prev, oldIndex, newIndex))
	}, [])

	// Toggle sort field
	const toggleSort = useCallback(
		(key: string) => {
			setSortForm((prev) => {
				const existing = prev.find((s) => s.key === key)
				if (existing) {
					return prev.map((s) => (s.key === key ? { ...s, order: s.order === "asc" ? "desc" : "asc" } : s))
				}
				const field = sortFields.find((f) => f.key === key)
				return [...prev, { key, order: field?.direction || "asc" }]
			})
		},
		[sortFields],
	)

	// ... (keep getFieldValue, updateFieldValue, resetFieldValue, resetAll, isFieldValueValid)
	// Get field value
	const getFieldValue = useCallback(
		(key: string): FieldValue | undefined => {
			return queryForm[key]
		},
		[queryForm],
	)

	// Update field value
	const updateFieldValue = useCallback((key: string, valueOrFieldValue: any, condition?: string) => {
		setQueryForm((prev) => {
			let newValue: FieldValue
			if (condition !== undefined) {
				newValue = { value: valueOrFieldValue, condition }
			} else if (
				valueOrFieldValue &&
				typeof valueOrFieldValue === "object" &&
				"value" in valueOrFieldValue &&
				"condition" in valueOrFieldValue
			) {
				newValue = valueOrFieldValue
			} else {
				newValue = { value: valueOrFieldValue, condition: "equal" }
			}

			return {
				...prev,
				[key]: newValue,
			}
		})
	}, [])

	// Reset field value
	const resetFieldValue = useCallback(
		(key: string) => {
			const field = queryFields.find((f) => f.key === key)
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
		[queryFields],
	)

	// Reset all fields
	const resetAll = useCallback(() => {
		const form: QueryForm = {}
		queryFields.forEach((field) => {
			form[field.key] = {
				value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
				condition: field.defaultCondition ?? "equal",
			}
		})
		setQueryForm(form)
		setSortForm([])
		setHasSubmitted(false)
		setSubmittedQueryForm({})
		setSubmittedSortForm([])
	}, [queryFields])

	// Helper to check if a field has valid content
	const isFieldValueValid = useCallback(
		(fieldKey: string, fieldValue: FieldValue) => {
			const field = queryFields.find((f) => f.key === fieldKey)

			const { value, condition } = fieldValue

			if (!field) {
				// If not in queryFields, it's likely a custom data field from a render function
				// Use a simple non-empty check
				if (value === undefined || value === null || value === "") return false
				if (Array.isArray(value)) return value.length > 0
				return true
			}

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
				const lines = value
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line !== "")
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
		[queryFields],
	)

	// Submit search
	const submit = useCallback(() => {
		const filteredQuery: QueryForm = {}
		const queryItems: QueryItem[] = []

		Object.entries(queryForm).forEach(([key, fieldValue]) => {
			// Check if this key belongs to a field with a custom render
			const field = queryFields.find((f) => f.key === key)
			if (field?.render) return // Skip virtual/container fields

			if (isFieldValueValid(key, fieldValue)) {
				// For null/notNull conditions, ensure value is undefined
				if (fieldValue.condition === "null" || fieldValue.condition === "notNull") {
					const val = {
						condition: fieldValue.condition,
						value: undefined,
					}
					filteredQuery[key] = val
					queryItems.push({ key, ...val })
				} else {
					// For textarea fields, convert multi-line text to array (one item per line)
					if (field?.type === "textarea" && typeof fieldValue.value === "string") {
						const lines = fieldValue.value
							.split("\n")
							.map((line) => line.trim())
							.filter((line) => line !== "")
						const val = {
							...fieldValue,
							value: lines,
						}
						filteredQuery[key] = val
						queryItems.push({ key, ...val })
					} else {
						filteredQuery[key] = fieldValue
						queryItems.push({ key, ...fieldValue })
					}
				}
			}
		})

		// Save the submitted query form snapshot
		setSubmittedQueryForm(filteredQuery)
		setSubmittedSortForm(sortForm)
		setHasSubmitted(true)
		onSubmit?.(queryItems, sortForm)
	}, [queryForm, sortForm, onSubmit, isFieldValueValid, queryFields])

	// Context value
	const contextValue = useMemo<SearchContextValue>(
		() => ({
			queryForm,
			getFieldValue,
			updateFieldValue,
			resetFieldValue,
			resetAll,
			submit,
			queryFields,
			sortFields,
			isFieldValueValid,
			hasSubmitted,
			submittedQueryForm,
			sortForm,
			submittedSortForm,
			addSort,
			removeSort,
			updateSort,
			reorderSort,
			toggleSort,
		}),
		[
			queryForm,
			getFieldValue,
			updateFieldValue,
			resetFieldValue,
			resetAll,
			submit,
			queryFields,
			sortFields,
			isFieldValueValid,
			hasSubmitted,
			submittedQueryForm,
			sortForm,
			submittedSortForm,
			addSort,
			removeSort,
			updateSort,
			toggleSort,
		],
	)

	return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

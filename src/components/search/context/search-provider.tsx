/**
 * SearchProvider
 *
 * Provides search state management context
 */

import { useState, useCallback, useMemo, type ReactNode } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import { SearchContext, type SearchContextValue } from "./search-context"
import type { SearchFieldConfig, QueryForm, FieldValue, SortForm, SortOrder, SortFieldConfig, SearchCondition } from "../types"

/**
 * SearchProvider props
 */
export interface SearchProviderProps {
	/** Search field configurations */
	queryFields: SearchFieldConfig[]
	/** Sort field configurations */
	sortFields?: SortFieldConfig[]
	/** Submit callback */
	onSubmit?: (query: QueryForm, sort: SortForm) => void
	/** Initial query form */
	initialQueryForm?: QueryForm
	/** Whether to disable condition selection for all fields */
	disableConditions?: boolean
	/** Auto query on change */
	autoQuery?: boolean
	/** Children components */
	children: ReactNode
}

/**
 * SearchProvider Component
 */
export function SearchProvider(props: SearchProviderProps): JSX.Element {
	const {
		queryFields: rawQueryFields,
		sortFields = [],
		onSubmit,
		initialQueryForm = {},
		disableConditions = false,
		autoQuery = false,
		children,
	} = props

	// Sort query fields by order (larger number comes first)
	const queryFields = useMemo(() => {
		return [...rawQueryFields].sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
	}, [rawQueryFields])

	// Initialize query form with default values
	const initialForm = useMemo<QueryForm>(() => {
		const form: QueryForm = { ...initialQueryForm }
		queryFields.forEach((field) => {
			if (!form[field.key]) {
				form[field.key] = {
					value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
					condition: disableConditions ? "equal" : (field.defaultCondition ?? "equal"),
					type: field.type,
				}
			}
		})
		return form
	}, [queryFields, initialQueryForm, disableConditions])

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

	/**
	 * Internal submit implementation that consumes specific form values
	 */
	const performSubmit = useCallback(
		(qForm: QueryForm, sForm: SortForm) => {
			const filteredQuery: QueryForm = {}

			Object.entries(qForm).forEach(([key, fieldValue]) => {
				const field = queryFields.find((f) => f.key === key)

				// Helper to check if a field has valid content (logic inlined or reused)
				const isValid = (() => {
					const { value, condition } = fieldValue
					if (!field) {
						if (value === undefined || value === null || value === "") return false
						if (Array.isArray(value)) return value.length > 0
						return true
					}
					if (condition === "null" || condition === "notNull") return true
					if (value === undefined || value === null || value === "") return false
					if (field.type === "textarea" && typeof value === "string") {
						const lines = value
							.split("\n")
							.map((line) => line.trim())
							.filter((line) => line !== "")
						return lines.length > 0
					}
					if (Array.isArray(value)) {
						if (condition === "between") {
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
						return value.some((v) => v !== undefined && v !== null && v !== "")
					}
					return true
				})()

				if (isValid) {
					const fieldType = fieldValue.type || field?.type
					if (fieldValue.condition === "null" || fieldValue.condition === "notNull") {
						filteredQuery[key] = {
							condition: fieldValue.condition,
							value: undefined,
							type: fieldType,
						}
					} else {
						if (field?.type === "textarea" && typeof fieldValue.value === "string") {
							const lines = fieldValue.value
								.split("\n")
								.map((line) => line.trim())
								.filter((line) => line !== "")
							filteredQuery[key] = {
								...fieldValue,
								value: lines,
								type: fieldType,
							}
						} else {
							filteredQuery[key] = {
								...fieldValue,
								type: fieldType,
							}
						}
					}
				}
			})

			setSubmittedQueryForm({ ...qForm })
			setSubmittedSortForm([...sForm])
			setHasSubmitted(true)
			onSubmit?.(filteredQuery, sForm)
		},
		[queryFields, onSubmit],
	)

	// Helper to check if a field has valid content (for context value)
	const isFieldValueValid = useCallback(
		(fieldKey: string, fieldValue: FieldValue) => {
			const field = queryFields.find((f) => f.key === fieldKey)
			const { value, condition } = fieldValue

			if (!field) {
				if (value === undefined || value === null || value === "") return false
				if (Array.isArray(value)) return value.length > 0
				return true
			}
			if (condition === "null" || condition === "notNull") return true
			if (value === undefined || value === null || value === "") return false
			if (field.type === "textarea" && typeof value === "string") {
				const lines = value
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line !== "")
				return lines.length > 0
			}
			if (Array.isArray(value)) {
				if (condition === "between") {
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
				return value.some((v) => v !== undefined && v !== null && v !== "")
			}
			return true
		},
		[queryFields],
	)

	// Submit search
	const submit = useCallback(() => {
		performSubmit(queryForm, sortForm)
	}, [performSubmit, queryForm, sortForm])

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

	// Get field value
	const getFieldValue = useCallback(
		(key: string): FieldValue | undefined => {
			return queryForm[key]
		},
		[queryForm],
	)

	// Update field value
	const updateFieldValue = useCallback(
		(key: string, valueOrFieldValue: any, condition?: SearchCondition, type?: string) => {
			setQueryForm((prev) => {
				let newValue: FieldValue
				if (condition !== undefined) {
					newValue = { value: valueOrFieldValue, condition, type }
				} else if (
					valueOrFieldValue &&
					typeof valueOrFieldValue === "object" &&
					"value" in valueOrFieldValue &&
					"condition" in valueOrFieldValue
				) {
					newValue = { ...valueOrFieldValue }
					if (type) newValue.type = type
				} else {
					newValue = { value: valueOrFieldValue, condition: "equal", type }
				}

				if (!newValue.type) {
					const field = queryFields.find((f) => f.key === key)
					if (field) newValue.type = field.type
				}

				return {
					...prev,
					[key]: newValue,
				}
			})
		},
		[queryFields],
	)

	// Reset field value
	const resetFieldValue = useCallback(
		(key: string) => {
			const field = queryFields.find((f) => f.key === key)
			if (field) {
				const resetValue: FieldValue = {
					value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
					condition: field.defaultCondition ?? "equal",
					type: field.type,
				}

				setQueryForm((prev) => {
					const nextForm = { ...prev, [key]: resetValue }
					if (autoQuery) {
						performSubmit(nextForm, sortForm)
					}
					return nextForm
				})

				setSubmittedQueryForm((prev) => {
					const newForm = { ...prev }
					delete newForm[key]
					const hasAnyFields = Object.keys(newForm).length > 0
					if (!hasAnyFields) setHasSubmitted(false)
					return newForm
				})
			}
		},
		[queryFields, autoQuery, performSubmit, sortForm],
	)

	// Reset all fields
	const resetAll = useCallback(() => {
		const form: QueryForm = {}
		queryFields.forEach((field) => {
			form[field.key] = {
				value: field.defaultValue ?? (field.type === "number" ? undefined : ""),
				condition: field.defaultCondition ?? "equal",
				type: field.type,
			}
		})
		setQueryForm(form)
		setSortForm([])
		setHasSubmitted(false)
		setSubmittedQueryForm({})
		setSubmittedSortForm([])

		if (autoQuery) {
			performSubmit(form, [])
		}
	}, [queryFields, autoQuery, performSubmit])

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
			disableConditions,
			autoQuery,
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
			disableConditions,
			autoQuery,
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
		],
	)

	return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

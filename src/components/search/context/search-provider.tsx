import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import { SearchContext } from "./search-context"
import type { FieldValue, NewbieProColumn, QueryForm, SearchCondition, SortForm, SortOrder } from "../types"

/**
 * SearchProvider props
 */
export interface SearchProviderProps {
	/** Table columns configuration */
	columns: NewbieProColumn<any, any>[]
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
	const { columns, onSubmit, initialQueryForm = {}, disableConditions = false, autoQuery = false, children } = props

	// Internal state for dynamic field options
	const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({})
	const loadingRef = useRef<Record<string, boolean>>({})

	// 1. Parse columns into internal queryFields and sortFields
	const { queryFields, sortFields } = useMemo(() => {
		const qFields: any[] = []
		const sFields: any[] = []

		columns.forEach((col) => {
			const { dataIndex, key, sortable, fieldProps } = col
			const fieldKey = (fieldProps?.name as string) || (dataIndex as string) || (key as string)

			if (!fieldKey || fieldKey === "action" || fieldKey === "option") return

			// Handle Sort
			if (sortable) {
				sFields.push(col)
			}

			// Handle Search
			if (col.search !== false) {
				qFields.push(col)
			}
		})

		return {
			queryFields: qFields.sort((a, b) => (b.order ?? 0) - (a.order ?? 0)),
			sortFields: sFields,
		}
	}, [columns])

	// 2. Initialize query form from columns
	const initialForm = useMemo<QueryForm>(() => {
		const form: QueryForm = { ...initialQueryForm }
		queryFields.forEach((field) => {
			const fieldKey = (field.fieldProps?.name as string) || (field.dataIndex as string) || (field.key as string)
			if (!form[fieldKey]) {
				const isTextType = field.valueType === "input" || field.valueType === "textarea" || field.valueType === "password"
				form[fieldKey] = {
					value: field.initialValue ?? (isTextType ? "" : undefined),
					condition: disableConditions ? "equal" : (field.fieldProps?.defaultCondition ?? "equal"),
					type: (field.valueType as string) || "text",
				}
			}
		})
		return form
	}, [queryFields, initialQueryForm, disableConditions])

	const [queryForm, setQueryForm] = useState<QueryForm>(initialForm)
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [submittedQueryForm, setSubmittedQueryForm] = useState<QueryForm>({})

	// 3. Initialize sort form from columns (parse sortable property)
	const initialSortForm = useMemo<SortForm>(() => {
		const sorts: SortForm = []
		sortFields.forEach((field) => {
			const { sortable, fieldProps, dataIndex, key } = field
			const fieldKey = (fieldProps?.name as string) || (dataIndex as string) || (key as string)

			if (!sortable || sortable === true) return

			// Case 1: sortable = 'asc' | 'desc'
			if (typeof sortable === "string" && (sortable === "asc" || sortable === "desc")) {
				sorts.push({ key: fieldKey, order: sortable })
			}
			// Case 2: sortable = SortField
			else if (typeof sortable === "object" && "key" in sortable && "order" in sortable) {
				sorts.push({ key: sortable.key, order: sortable.order })
			}
		})
		return sorts
	}, [sortFields])

	const [sortForm, setSortForm] = useState<SortForm>(initialSortForm)
	const [submittedSortForm, setSubmittedSortForm] = useState<SortForm>(initialSortForm)

	/**
	 * Dynamic Request Handling
	 */
	const loadOptions = useCallback(async (field: NewbieProColumn, currentParams: any = {}) => {
		const fieldKey = (field.fieldProps?.name as string) || (field.dataIndex as string) || (field.key as string)
		if (!field.request || loadingRef.current[fieldKey]) return

		loadingRef.current[fieldKey] = true
		try {
			const options = await field.request(currentParams, {})
			if (Array.isArray(options)) {
				setFieldOptions((prev) => ({ ...prev, [fieldKey]: options }))
			}
		} catch (error) {
			console.error(`Failed to load options for ${fieldKey}:`, error)
		} finally {
			loadingRef.current[fieldKey] = false
		}
	}, [])

	/**
	 * Initialize field options from columns (static)
	 */
	useEffect(() => {
		const staticOptions: Record<string, any[]> = {}
		queryFields.forEach((field) => {
			const key = (field.fieldProps?.name as string) || (field.dataIndex as string) || (field.key as string)
			if (field.fieldProps?.options) {
				staticOptions[key] = field.fieldProps.options
			} else if (field.valueEnum) {
				staticOptions[key] = Object.entries(field.valueEnum).map(([value, config]) => {
					if (typeof config === "object" && config !== null) {
						return {
							label: (config as any).text,
							value: isNaN(Number(value)) ? value : Number(value),
							...(config as any),
						}
					}
					return {
						label: String(config),
						value: isNaN(Number(value)) ? value : Number(value),
					}
				})
			}
		})
		if (Object.keys(staticOptions).length > 0) {
			setFieldOptions((prev) => ({ ...prev, ...staticOptions }))
		}
	}, [queryFields])

	/**
	 * Watch for params changes and trigger requests
	 */
	useEffect(() => {
		queryFields.forEach((field) => {
			if (!field.request) return

			const deps = field.params || {}
			const currentDepValues: any = {}

			Object.keys(deps).forEach((depKey) => {
				currentDepValues[depKey] = queryForm[depKey]?.value
			})

			loadOptions(field, currentDepValues)
		})
	}, [queryFields, queryForm, loadOptions])

	/**
	 * Internal submit implementation
	 */
	const performSubmit = useCallback(
		(qForm: QueryForm, sForm: SortForm) => {
			const filteredQuery: QueryForm = {}

			Object.entries(qForm).forEach(([key, fieldValue]) => {
				const field = queryFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === key)

				const isValid = (() => {
					const { value, condition } = fieldValue
					if (!field) return value !== undefined && value !== null && value !== ""

					if (condition === "null" || condition === "notNull") return true
					if (value === undefined || value === null || value === "") return false
					if (field.valueType === "textarea" && typeof value === "string") {
						return value.trim().length > 0
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
					filteredQuery[key] = {
						...fieldValue,
						type: fieldValue.type || (field?.valueType as string) || "text",
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

	const isFieldValueValid = useCallback(
		(fieldKey: string, fieldValue: FieldValue) => {
			const field = queryFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === fieldKey)
			const { value, condition } = fieldValue

			if (!field) return value !== undefined && value !== null && value !== ""
			if (condition === "null" || condition === "notNull") return true
			if (value === undefined || value === null || value === "") return false
			if (Array.isArray(value)) return value.length > 0
			return true
		},
		[queryFields],
	)

	const submit = useCallback(() => performSubmit(queryForm, sortForm), [performSubmit, queryForm, sortForm])

	const addSort = useCallback(
		(key: string, order?: SortOrder) => {
			setSortForm((prev) => {
				if (prev.find((s) => s.key === key)) return prev
				const field = sortFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === key)

				// Determine default order from sortable property
				let defaultOrder: SortOrder = "asc"
				if (field?.sortable) {
					if (typeof field.sortable === "string") {
						defaultOrder = field.sortable
					} else if (typeof field.sortable === "object") {
						defaultOrder = field.sortable.order
					}
				}

				return [...prev, { key, order: order || defaultOrder }]
			})
		},
		[sortFields],
	)

	const removeSort = useCallback((key: string) => {
		setSortForm((prev) => prev.filter((s) => s.key !== key))
	}, [])

	const updateSort = useCallback((key: string, order: SortOrder) => {
		setSortForm((prev) => prev.map((s) => (s.key === key ? { ...s, order } : s)))
	}, [])

	const reorderSort = useCallback((oldIndex: number, newIndex: number) => {
		setSortForm((prev) => arrayMove(prev, oldIndex, newIndex))
	}, [])

	const toggleSort = useCallback(
		(key: string) => {
			setSortForm((prev) => {
				const existing = prev.find((s) => s.key === key)
				if (existing) {
					return prev.map((s) => (s.key === key ? { ...s, order: s.order === "asc" ? "desc" : "asc" } : s))
				}

				const field = sortFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === key)

				// Determine default order from sortable property
				let defaultOrder: SortOrder = "asc"
				if (field?.sortable) {
					if (typeof field.sortable === "string") {
						defaultOrder = field.sortable
					} else if (typeof field.sortable === "object") {
						defaultOrder = field.sortable.order
					}
				}

				return [...prev, { key, order: defaultOrder }]
			})
		},
		[sortFields],
	)

	const getFieldValue = useCallback((key: string) => queryForm[key], [queryForm])

	const updateFieldValue = useCallback(
		(key: string, value: any, condition?: SearchCondition, type?: string) => {
			setQueryForm((prev) => {
				const existing = prev[key] || {}
				const field = queryFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === key)
				const newValue = {
					value: condition !== undefined ? value : (value?.value ?? value),
					condition: condition ?? value?.condition ?? existing.condition ?? "equal",
					type: type ?? existing.type ?? (field?.valueType as string) ?? "text",
				}
				return { ...prev, [key]: newValue }
			})
		},
		[queryFields],
	)

	const resetFieldValue = useCallback(
		(key: string) => {
			const field = queryFields.find((f) => ((f.fieldProps?.name as string) || (f.dataIndex as string) || (f.key as string)) === key)
			if (field) {
				const isTextType = field.valueType === "input" || field.valueType === "textarea" || field.valueType === "password"
				const resetValue: FieldValue = {
					value: field.initialValue ?? (isTextType ? "" : undefined),
					condition: field.fieldProps?.defaultCondition ?? "equal",
					type: (field.valueType as string) || "text",
				}
				setQueryForm((prev) => ({ ...prev, [key]: resetValue }))
			}
		},
		[queryFields],
	)

	const resetAll = useCallback(() => {
		setQueryForm(initialForm)
		setSortForm(initialSortForm)
		setHasSubmitted(false)
		if (autoQuery) performSubmit(initialForm, initialSortForm)
	}, [initialForm, initialSortForm, autoQuery, performSubmit])

	const contextValue = useMemo(
		() => ({
			queryForm,
			getFieldValue,
			updateFieldValue,
			resetFieldValue,
			resetAll,
			submit,
			queryFields,
			sortFields,
			fieldOptions,
			columns,
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
			fieldOptions,
			columns,
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

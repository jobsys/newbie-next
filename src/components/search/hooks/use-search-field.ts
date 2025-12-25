/**
 * useSearchField Hook
 *
 * Manages search field state including value, condition, and display value
 *
 * @param options - Hook configuration options
 * @param options.field - Field configuration object
 * @returns Field state and control methods
 *
 * @example
 * ```tsx
 * const fieldState = useSearchField({
 *   field: {
 *     key: 'name',
 *     type: 'input',
 *     title: '姓名'
 *   }
 * })
 *
 * // Update value
 * fieldState.setValue('张三')
 *
 * // Update condition
 * fieldState.setCondition('include')
 * ```
 */

import { useMemo, useCallback } from "react"
import { useSearchContext } from "../context/search-context"
import { getFieldConditions, getConditionLabel } from "../utils/conditions"
import type { SearchFieldConfig, SearchCondition } from "../types"

/**
 * Hook options
 */
export interface UseSearchFieldOptions {
	/** Field configuration */
	field: SearchFieldConfig
}

/**
 * Hook return value
 */
export interface UseSearchFieldReturn {
	/** Field value */
	value: any
	/** Current condition */
	condition: SearchCondition
	/** Available conditions */
	conditions: Array<{ value: SearchCondition; label: string }>
	/** Update value */
	setValue: (value: any) => void
	/** Update condition */
	setCondition: (condition: SearchCondition) => void
	/** Display value for overlay */
	displayValue: string
	/** Whether the field is valid (has value or special condition) */
	isValid: boolean
	/** Whether input is disabled (e.g., null/notNull condition) */
	disabled: boolean
}

/**
 * useSearchField Hook
 */
export function useSearchField(options: UseSearchFieldOptions): UseSearchFieldReturn {
	const { field } = options
	const { getFieldValue, updateFieldValue } = useSearchContext()

	// Get current field value
	const fieldValue = getFieldValue(field.key)

	// Current value and condition
	const value = fieldValue?.value ?? field.defaultValue ?? ""
	const condition: SearchCondition = fieldValue?.condition ?? field.defaultCondition ?? "equal"

	// Get available conditions
	const conditions = useMemo(() => getFieldConditions(field.type, field.conditions), [field.type, field.conditions])

	// Update value
	const setValue = useCallback(
		(newValue: any) => {
			updateFieldValue(field.key, {
				value: newValue,
				condition,
				type: field.type,
			})
		},
		[field.key, condition, updateFieldValue],
	)

	// Update condition
	const setCondition = useCallback(
		(newCondition: SearchCondition) => {
			// If switching to null/notNull, clear the value
			if (newCondition === "null" || newCondition === "notNull") {
				updateFieldValue(field.key, {
					value: undefined,
					condition: newCondition,
					type: field.type,
				})
				return
			}

			// If switching from null/notNull to other condition, reset value
			const isOldNull = condition === "null" || condition === "notNull"
			let newValue = isOldNull ? (field.defaultValue ?? (field.type === "number" ? undefined : "")) : value

			// Handle value conversion based on condition type and field type
			if (field.type === "select") {
				const isNewMultiple = newCondition === "in" || newCondition === "notIn"
				const isOldMultiple = condition === "in" || condition === "notIn"

				if (isNewMultiple && !isOldMultiple) {
					// Single to multiple: wrap in array
					newValue = value !== "" && value !== null && value !== undefined ? [value] : []
				} else if (!isNewMultiple && isOldMultiple) {
					// Multiple to single: take first item
					newValue = Array.isArray(value) && value.length > 0 ? value[0] : (field.defaultValue ?? "")
				}
			} else if (field.type === "number" || field.type === "date") {
				const isNewBetween = newCondition === "between"
				const isOldBetween = condition === "between"

				if (isNewBetween && !isOldBetween) {
					// Single to range: create array with two items of the same value
					const fillValue = value !== "" && value !== null && value !== undefined ? value : undefined
					newValue = [fillValue, fillValue]
				} else if (!isNewBetween && isOldBetween) {
					// Range to single: take first item
					newValue = Array.isArray(value) && value.length > 0 ? value[0] : (field.defaultValue ?? "")
				}
			}

			updateFieldValue(field.key, {
				value: newValue,
				condition: newCondition,
				type: field.type,
			})
		},
		[field.key, field.type, field.defaultValue, value, condition, updateFieldValue],
	)

	// Format display value
	const displayValue = useMemo(() => {
		if (condition === "null" || condition === "notNull") {
			return getConditionLabel(condition, field.type)
		}
		if (condition === "between" && Array.isArray(value)) {
			if (field.type === "date") {
				return value.length === 2 && value[0] && value[1] ? `${value[0]} ~ ${value[1]}` : ""
			}
			if (field.type === "number") {
				return value.length === 2 && value[0] !== undefined && value[1] !== undefined ? `${value[0]} ~ ${value[1]}` : ""
			}
		}
		// For textarea, format multi-line text for display
		if (field.type === "textarea" && typeof value === "string") {
			const lines = value
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line !== "")
			if (lines.length === 0) {
				return ""
			}
			// Display as comma-separated list, or first line with ellipsis if too long
			if (lines.length === 1) {
				return lines[0]
			}
			const display = lines.join(", ")
			// Truncate if too long (max 50 chars)
			return display.length > 50 ? `${display.slice(0, 50)}...` : display
		}
		// For cascade, find labels from options and format as string
		if (field.type === "cascade" && Array.isArray(value) && value.length > 0) {
			const findLabels = (options: any[], path: any[]): string[] => {
				if (path.length === 0) return []
				const currentValue = path[0]
				const option = options.find((opt: any) => opt.value === currentValue)
				if (!option) return path.map(String)
				const label = option.label || option.text || String(option.value)
				if (path.length === 1) {
					return [label]
				}
				if (option.children) {
					return [label, ...findLabels(option.children, path.slice(1))]
				}
				return [label, ...path.slice(1).map(String)]
			}
			const labels = findLabels(field.options || [], value)
			return labels.join(" / ")
		}
		if (!value || (Array.isArray(value) && value.length === 0)) {
			return ""
		}
		if (typeof value === "object") {
			return JSON.stringify(value)
		}
		return String(value)
	}, [value, condition, field.type, field.options])

	// Check if field is valid
	const isValid = useMemo(() => {
		if (condition === "null" || condition === "notNull") {
			return true
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
			// For range values, both must be set
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
			return value.length > 0
		}
		// For select, 0 and false are valid values
		if (field.type === "select") {
			return value !== "" && value !== null && value !== undefined
		}
		return value !== "" && value !== null && value !== undefined
	}, [value, condition, field.type])

	// Check if input is disabled
	const disabled = useMemo(() => {
		return condition === "null" || condition === "notNull"
	}, [condition])

	return {
		value,
		condition,
		conditions,
		setValue,
		setCondition,
		displayValue,
		isValid,
		disabled,
	}
}

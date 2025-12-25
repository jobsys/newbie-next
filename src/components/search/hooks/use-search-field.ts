import { useMemo, useCallback } from "react"
import { useSearchContext } from "../context/search-context"
import { getFieldConditions, getConditionLabel } from "../utils/conditions"
import type { NewbieProColumn, SearchCondition } from "../types"

/**
 * Hook options
 */
export interface UseSearchFieldOptions {
	/** Field configuration */
	field: NewbieProColumn
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

	const fieldKey = (field.dataIndex as string) || (field.key as string)
	const valueType = (field.valueType as string) || "text"

	// Get current field value
	const fieldValue = getFieldValue(fieldKey)

	// Current value and condition
	const value = fieldValue?.value ?? field.initialValue ?? ""
	const condition: SearchCondition = fieldValue?.condition ?? field.fieldProps?.defaultCondition ?? "equal"

	// Get available conditions
	const conditions = useMemo(() => getFieldConditions(valueType, field.fieldProps?.conditions), [valueType, field.fieldProps?.conditions])

	// Update value
	const setValue = useCallback(
		(newValue: any) => {
			updateFieldValue(fieldKey, newValue, condition, valueType)
		},
		[fieldKey, condition, valueType, updateFieldValue],
	)

	// Update condition
	const setCondition = useCallback(
		(newCondition: SearchCondition) => {
			// If switching to null/notNull, clear the value
			if (newCondition === "null" || newCondition === "notNull") {
				updateFieldValue(fieldKey, undefined, newCondition, valueType)
				return
			}

			// If switching from null/notNull to other condition, reset value
			const isOldNull = condition === "null" || condition === "notNull"
			let newValue = isOldNull ? (field.initialValue ?? (valueType === "digit" ? undefined : "")) : value

			// Handle value conversion
			if (valueType === "select") {
				const isNewMultiple = newCondition === "in" || newCondition === "notIn"
				const isOldMultiple = condition === "in" || condition === "notIn"

				if (isNewMultiple && !isOldMultiple) {
					newValue = value !== "" && value !== null && value !== undefined ? [value] : []
				} else if (!isNewMultiple && isOldMultiple) {
					newValue = Array.isArray(value) && value.length > 0 ? value[0] : (field.initialValue ?? "")
				}
			} else if (valueType === "digit" || valueType === "date") {
				const isNewBetween = newCondition === "between"
				const isOldBetween = condition === "between"

				if (isNewBetween && !isOldBetween) {
					const fillValue = value !== "" && value !== null && value !== undefined ? value : undefined
					newValue = [fillValue, fillValue]
				} else if (!isNewBetween && isOldBetween) {
					newValue = Array.isArray(value) && value.length > 0 ? value[0] : (field.initialValue ?? "")
				}
			}

			updateFieldValue(fieldKey, newValue, newCondition, valueType)
		},
		[fieldKey, valueType, field.initialValue, value, condition, updateFieldValue],
	)

	// Format display value
	const displayValue = useMemo(() => {
		if (condition === "null" || condition === "notNull") {
			return getConditionLabel(condition, valueType)
		}
		if (condition === "between" && Array.isArray(value)) {
			if (valueType === "date") {
				return value.length === 2 && value[0] && value[1] ? `${value[0]} ~ ${value[1]}` : ""
			}
			if (valueType === "digit") {
				return value.length === 2 && value[0] !== undefined && value[1] !== undefined ? `${value[0]} ~ ${value[1]}` : ""
			}
		}
		if (valueType === "textarea" && typeof value === "string") {
			const lines = value
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line !== "")
			if (lines.length === 0) return ""
			const display = lines.join(", ")
			return display.length > 50 ? `${display.slice(0, 50)}...` : display
		}
		if (valueType === "cascader" && Array.isArray(value) && value.length > 0) {
			// Logic simplified here, SearchItem will handle complex display if needed
			return value.join(" / ")
		}

		if (!value || (Array.isArray(value) && value.length === 0)) return ""
		return String(value)
	}, [value, condition, valueType])

	// Check if field is valid
	const isValid = useMemo(() => {
		if (condition === "null" || condition === "notNull") return true
		if (valueType === "textarea" && typeof value === "string") {
			return value.split("\n").some((line) => line.trim().length > 0)
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
			return value.length > 0
		}
		return value !== "" && value !== null && value !== undefined
	}, [value, condition, valueType])

	const disabled = useMemo(() => condition === "null" || condition === "notNull", [condition])

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

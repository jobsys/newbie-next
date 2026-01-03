import { useMemo, useCallback } from "react"
import { useSearchContext } from "../context/search-context"
import { getFieldConditions, getConditionLabel } from "../utils/conditions"
import type { NewbieProColumn, SearchCondition } from "../types"

/**
 * SearchField Hook 配置项
 */
export interface UseSearchFieldOptions {
	/** 字段配置信息 (Field configuration) */
	field: NewbieProColumn
}

/**
 * SearchField Hook 返回值
 */
export interface UseSearchFieldReturn {
	/** 当前字段的值 (Current field value) */
	value: any
	/** 当前选择的检索条件 (Current search condition, e.g., 'equal', 'include') */
	condition: SearchCondition
	/** 该字段支持的所有检索条件列表 (Available conditions for this field) */
	conditions: Array<{ value: SearchCondition; label: string }>
	/** 更新字段值的方法 (Method to update field value) */
	setValue: (value: any) => void
	/** 更新检索条件的方法 (Method to update search condition) */
	setCondition: (condition: SearchCondition) => void
	/** 用于在界面上显示的格式化后的值 (Formatted value for display in the UI) */
	displayValue: string
	/** 该字段当前是否有效（即是否有值或属于特殊条件如“为空”） (Whether the field is valid) */
	isValid: boolean
	/** 该字段的输入控件是否应禁用（如选择“为空”时） (Whether the input should be disabled) */
	disabled: boolean
}

/**
 * 搜索字段状态管理 Hook (Search Field State Management Hook)
 *
 * 此 Hook 封装了单个搜索字段的复杂逻辑，包括：
 * 1. 自动从 SearchContext 中获取和同步字段值与条件。
 * 2. 处理不同 valueType（如 select, date, digit）在切换条件时的值转换逻辑。
 * 3. 自动计算格式化的显示文本。
 * 4. 判定字段的有效性和禁用状态。
 *
 * @param options - 配置项，包含字段定义
 * @returns 包含值、条件、控制方法和状态的 UseSearchFieldReturn 对象
 *
 * @example
 * ```tsx
 * const SearchItem = ({ field }) => {
 *   const { value, condition, setValue, setCondition, displayValue } = useSearchField({ field });
 *
 *   return (
 *     <div>
 *       <span>{field.title}: {displayValue}</span>
 *       <Input value={value} onChange={e => setValue(e.target.value)} />
 *       <ConditionSelect options={conditions} value={condition} onChange={setCondition} />
 *     </div>
 *   );
 * };
 * ```
 */
export function useSearchField(options: UseSearchFieldOptions): UseSearchFieldReturn {
	const { field } = options
	const { getFieldValue, updateFieldValue } = useSearchContext()

	const fieldKey = (field.dataIndex as string) || (field.key as string)
	const valueType = (field.valueType as string) || "input"

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

		if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return ""
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

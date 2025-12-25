/**
 * Search conditions utilities
 */

import type { Condition, SearchCondition } from "../types"

/**
 * Default conditions for different field types
 */
export const DEFAULT_CONDITIONS: Record<string, Condition[]> = {
	input: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "include", label: "包含" },
		{ value: "exclude", label: "不包含" },
		{ value: "null", label: "为空" },
		{ value: "notNull", label: "不为空" },
	],
	number: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "greaterThan", label: "大于" },
		{ value: "lessThan", label: "小于" },
		{ value: "between", label: "介于" },
		{ value: "null", label: "为空" },
		{ value: "notNull", label: "不为空" },
	],
	date: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "greaterThan", label: "大于" },
		{ value: "lessThan", label: "小于" },
		{ value: "between", label: "介于" },
		{ value: "null", label: "为空" },
		{ value: "notNull", label: "不为空" },
	],
	textarea: [
		{ value: "equal", label: "等于" },
		{ value: "exclude", label: "不包含" },
	],
	select: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "in", label: "包含任一" },
		{ value: "notIn", label: "不包含任一" },
		{ value: "null", label: "为空" },
		{ value: "notNull", label: "不为空" },
	],
	cascade: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "include", label: "包括子级" },
	],
}

/**
 * Get conditions for a field type
 *
 * @param fieldType - Field type
 * @param customConditions - Custom condition values
 * @returns Condition array
 *
 * @example
 * ```ts
 * const conditions = getFieldConditions('input', ['equal', 'include'])
 * ```
 */
export function getFieldConditions(fieldType: string, customConditions?: SearchCondition[]): Condition[] {
	if (customConditions) {
		const allConditions = DEFAULT_CONDITIONS[fieldType] || []
		return allConditions.filter((c) => customConditions.includes(c.value as SearchCondition))
	}
	return DEFAULT_CONDITIONS[fieldType] || DEFAULT_CONDITIONS.input
}

/**
 * Get condition label by value
 *
 * @param value - Condition value
 * @param fieldType - Field type
 * @returns Condition label
 */
export function getConditionLabel(value: SearchCondition, fieldType: string = "input"): string {
	const conditions = DEFAULT_CONDITIONS[fieldType] || DEFAULT_CONDITIONS.input
	const condition = conditions.find((c) => c.value === value)
	return condition?.label || value
}

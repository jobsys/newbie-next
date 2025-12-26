/**
 * Search conditions utilities
 */

import type { Condition, SearchCondition } from "../types"

/**
 * 不同字段类型所对应的默认检索条件 (Default conditions for different field types)
 *
 * 每一项包含 value (条件标识) 和 label (显示的中文名称)。
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
	text: [
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
	digit: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "greaterThan", label: "大于" },
		{ value: "lessThan", label: "小于" },
		{ value: "between", label: "介于" },
		{ value: "null", label: "为空" },
		{ value: "notNull", label: "不为空" },
	],
	money: [
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
	dateTime: [
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
	cascader: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "include", label: "包括子级" },
	],
	cascade: [
		{ value: "equal", label: "等于" },
		{ value: "notEqual", label: "不等于" },
		{ value: "include", label: "包括子级" },
	],
}

/**
 * 根据字段类型获取可用的检索条件 (Get conditions for a field type)
 *
 * 如果提供了 customConditions，则会根据该列表过滤出默认支持的条件。
 * 如果字段类型不存在，则默认返回 'input' 类型的条件。
 *
 * @param fieldType - 字段类型，如 'text', 'digit', 'select', 'date' 等
 * @param customConditions - 可选，自定义的条件值列表，用于限制显示的条件
 * @returns 包含具体条件对象的数组
 *
 * @example
 * ```ts
 * // 1. 获取日期字段的所有默认条件
 * const conditions = getFieldConditions('date');
 * // returns [{ value: "equal", label: "等于" }, ...]
 *
 * // 2. 限制某个输入框只能用“等于”和“包含”
 * const limited = getFieldConditions('input', ['equal', 'include']);
 * // returns [{ value: "equal", label: "等于" }, { value: "include", label: "包含" }]
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
 * 获取特定条件下显示的标签名称 (Get condition label by value)
 *
 * @param value - 条件标识符，如 'greaterThan'
 * @param fieldType - 字段类型，用于准确定位标签（不同类型的同名条件可能有不同标签）
 * @returns 条件的显示名称，若未找到则返回 value 自生
 *
 * @example
 * ```ts
 * const label = getConditionLabel('between', 'date');
 * // label: "介于"
 * ```
 */
export function getConditionLabel(value: SearchCondition, fieldType: string = "input"): string {
	const conditions = DEFAULT_CONDITIONS[fieldType] || DEFAULT_CONDITIONS.input
	const condition = conditions.find((c) => c.value === value)
	return condition?.label || value
}

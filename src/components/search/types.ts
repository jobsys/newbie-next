/**
 * NewbieSearch component types
 */

/**
 * Search condition type
 *
 * @example
 * ```tsx
 * const condition: Condition = {
 *   value: 'equal',
 *   label: '等于'
 * }
 * ```
 */
export interface Condition {
	/** Condition value */
	value: string
	/** Condition label */
	label: string
}

/**
 * Field value structure
 *
 * @example
 * ```tsx
 * const fieldValue: FieldValue = {
 *   value: '张三',
 *   condition: 'equal'
 * }
 * ```
 */
export interface FieldValue {
	/** Field value */
	value: any
	/** Search condition */
	condition: string
}

/**
 * Search field configuration
 *
 * @example
 * ```tsx
 * const field: SearchFieldConfig = {
 *   key: 'name',
 *   type: 'input',
 *   title: '姓名',
 *   conditions: ['equal', 'include']
 * }
 * ```
 */
export interface SearchFieldConfig {
	/** Field unique identifier */
	key: string
	/** Field type */
	type: "input" | "number" | "date" | "select" | "cascade" | "textarea"
	/** Field title */
	title: string
	/** Available conditions */
	conditions?: string[]
	/** Default value */
	defaultValue?: any
	/** Default condition */
	defaultCondition?: string
	/** Whether to disable condition selection */
	disableConditions?: boolean
	/** Whether to show options as tiled (for type: 'select') */
	expandable?: boolean | "single" | "multiple"
	/** Additional field-specific props */
	[key: string]: any
}

/**
 * Query form structure
 *
 * Maps field keys to field values
 *
 * @example
 * ```tsx
 * const queryForm: QueryForm = {
 *   name: { value: '张三', condition: 'equal' },
 *   age: { value: 18, condition: 'equal' }
 * }
 * ```
 */
export interface QueryForm {
	[fieldKey: string]: FieldValue
}

/**
 * NewbieSearch component props
 *
 * @example
 * ```tsx
 * <NewbieSearch
 *   fields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   onSubmit={(query) => console.log(query)}
 * />
 * ```
 */
export interface NewbieSearchProps {
	/** Search field configurations */
	fields: SearchFieldConfig[]
	/** Submit callback */
	onSubmit?: (query: QueryForm) => void
	/** Whether to disable condition selection */
	disableConditions?: boolean
	/** Auto query on change */
	autoQuery?: boolean
	/** Gutter between fields */
	gutter?: number | string
	/** Persistence configuration */
	persistence?: boolean | string
}

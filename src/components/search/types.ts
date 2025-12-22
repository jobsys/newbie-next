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
/**
 * Sort order type
 */
export type SortOrder = "asc" | "desc"

/**
 * Sort field configuration
 */
export interface SortFieldConfig {
	/** Field unique identifier */
	key: string
	/** Field title */
	title: string
	/** Default sort direction */
	direction?: SortOrder
}

/**
 * Sort field structure
 */
export interface SortField {
	/** Field key */
	key: string
	/** Sort order */
	order: SortOrder
}

/**
 * Sort form structure (array of sort fields)
 */
export type SortForm = SortField[]

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
 * Query item structure for submission
 */
export interface QueryItem {
	/** Field key */
	key: string
	/** Field value */
	value: any
	/** Search condition */
	condition: string
}

/**
 * NewbieSearch component props
 *
 * @example
 * ```tsx
 * <NewbieSearch
 *   queryFields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   sortFields={[
 *     { key: 'createdAt', title: '创建时间', direction: 'desc' }
 *   ]}
 *   onSubmit={(query, sort) => console.log(query, sort)}
 * />
 * ```
 */
export interface NewbieSearchProps {
	/** Search field configurations */
	queryFields: SearchFieldConfig[]
	/** Sort field configurations */
	sortFields?: SortFieldConfig[]
	/** Submit callback */
	onSubmit?: (query: QueryItem[], sort: SortForm) => void
	/** Whether to disable condition selection */
	disableConditions?: boolean
	/** Auto query on change */
	autoQuery?: boolean
	/** Gutter between fields */
	gutter?: number | string
	/** Persistence configuration */
	persistence?: boolean | string
}

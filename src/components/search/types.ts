/**
 * NewbieSearch component types
 */

/**
 * Search condition type
 */
import type { ProColumns } from "@ant-design/pro-components"

/**
 * Enhanced ProColumns for NewbieSearch
 */
export type NewbieProColumn<T = any, ValueType = "text"> = ProColumns<T, ValueType> & {
	/**
	 * Field-level configuration for NewbieSearch
	 */
	fieldProps?: any & {
		/** Available conditions for this field */
		conditions?: SearchCondition[]
		/** Default condition for this field */
		defaultCondition?: SearchCondition
		/** Whether to disable condition selection for this field */
		disableConditions?: boolean
		/** Whether to show options as tiled (for select fields) */
		expandable?: boolean | "single" | "multiple"
	}
}

/**
 * Search condition type
 */
export type SearchCondition =
	| "equal"
	| "notEqual"
	| "include"
	| "exclude"
	| "greaterThan"
	| "lessThan"
	| "greaterThanOrEqual"
	| "lessThanOrEqual"
	| "between"
	| "in"
	| "notIn"
	| "null"
	| "notNull"

/**
 * Search condition structure
 */
export interface Condition {
	/** Condition value */
	value: SearchCondition
	/** Condition label */
	label: string
}

/**
 * Field value structure
 */
export interface FieldValue {
	/** Field value */
	value: any
	/** Search condition */
	condition: SearchCondition
	/** Field type (corresponds to valueType) */
	type?: string
}

/**
 * Sort order type
 */
export type SortOrder = "asc" | "desc"

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
 * Query form structure
 */
export interface QueryForm {
	[fieldKey: string]: FieldValue
}

/**
 * NewbieSearch component props
 */
export interface NewbieSearchProps {
	/**
	 * Table columns configuration (Ant Design ProTable style)
	 */
	columns: NewbieProColumn<any, any>[]
	/**
	 * Submit callback
	 */
	onSubmit?: (query: QueryForm, sort: SortForm) => void
	/**
	 * Whether to disable condition selection for all fields
	 */
	disableConditions?: boolean
	/**
	 * Auto query on change
	 */
	autoQuery?: boolean
}

/**
 * Common types for @jobsys/newbie-next
 */

/**
 * Base configuration interface
 */
export interface BaseConfig {
	/** Component key for identification */
	key?: string
	/** Component title/label */
	title?: string
	/** Whether the component is disabled */
	disabled?: boolean
	/** Whether the component is hidden */
	hidden?: boolean
}

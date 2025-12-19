/**
 * NewbieProvider configuration types
 */

import type { ReactNode } from "react"

/**
 * Component default props configuration
 *
 * Allows overriding default props for any component
 *
 * @example
 * ```tsx
 * const config = {
 *   defaults: {
 *     NewbieForm: {
 *       layout: 'vertical',
 *       labelCol: { span: 6 }
 *     },
 *     ProFormText: {
 *       placeholder: '请输入'
 *     }
 *   }
 * }
 * ```
 */
export interface ComponentDefaults {
	/** Default props for NewbieForm */
	NewbieForm?: Record<string, any>
	/** Default props for NewbieSearch */
	NewbieSearch?: Record<string, any>
	/** Default props for NewbieTable */
	NewbieTable?: Record<string, any>
	/** Default props for ProForm components */
	ProForm?: Record<string, any>
	ProFormText?: Record<string, any>
	ProFormSelect?: Record<string, any>
	ProFormDatePicker?: Record<string, any>
	ProFormNumber?: Record<string, any>
	/** Default props for ProTable */
	ProTable?: Record<string, any>
	/** Allow any component name */
	[key: string]: Record<string, any> | undefined
}

/**
 * NewbieProvider configuration
 *
 * @example
 * ```tsx
 * <NewbieProvider
 *   config={{
 *     locale: 'zh_CN',
 *     defaults: {
 *       NewbieForm: {
 *         layout: 'vertical'
 *       }
 *     }
 *   }}
 * >
 *   <App />
 * </NewbieProvider>
 * ```
 */
export interface NewbieProviderConfig {
	/** Locale configuration */
	locale?: string
	/** Component default props */
	defaults?: ComponentDefaults
	/** Custom configuration */
	[key: string]: any
}

/**
 * NewbieProvider props
 */
export interface NewbieProviderProps {
	/** Provider configuration */
	config?: NewbieProviderConfig
	/** Children components */
	children: ReactNode
}

/**
 * NewbieContext value
 */
export interface NewbieContextValue {
	/** Current configuration */
	config: NewbieProviderConfig
	/** Get default props for a component */
	getDefaultProps: (componentName: string) => Record<string, any>
	/** Merge default props with provided props */
	mergeProps: <T extends Record<string, any>>(componentName: string, props: T) => T
}

/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components
 *
 * @example
 * ```tsx
 * <NewbieProvider
 *   config={{
 *     locale: 'zh_CN',
 *     defaults: {
 *       NewbieForm: {
 *         layout: 'vertical',
 *         labelCol: { span: 6 }
 *       },
 *       ProFormText: {
 *         placeholder: '请输入'
 *       }
 *     }
 *   }}
 * >
 *   <App />
 * </NewbieProvider>
 * ```
 */

import { createContext, useContext, useMemo } from "react"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue } from "./types"
import { deepMerge } from "../../utils/merge"

/**
 * NewbieContext
 *
 * Provides access to global configuration and default props
 */
const NewbieContext = createContext<NewbieContextValue | null>(null)

/**
 * Default configuration
 */
const defaultConfig: NewbieProviderConfig = {
	locale: "zh_CN",
	defaults: {},
}

/**
 * Hook to access NewbieContext
 *
 * @returns NewbieContext value
 * @throws Error if used outside NewbieProvider
 *
 * @example
 * ```tsx
 * const { config, getDefaultProps, mergeProps } = useNewbieContext()
 *
 * const defaultProps = getDefaultProps('NewbieForm')
 * const mergedProps = mergeProps('NewbieForm', { layout: 'horizontal' })
 * ```
 */
export function useNewbieContext(): NewbieContextValue {
	const context = useContext(NewbieContext)
	if (!context) {
		throw new Error("useNewbieContext must be used within NewbieProvider")
	}
	return context
}

/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components.
 * Wraps the application with Ant Design ConfigProvider and custom context.
 *
 * @param props - Component props
 * @returns Provider component
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
export function NewbieProvider(props: NewbieProviderProps): JSX.Element {
	const { config: userConfig = {}, children } = props

	// Merge user config with default config
	const config = useMemo<NewbieProviderConfig>(() => deepMerge(defaultConfig, userConfig), [userConfig])

	// Get default props for a component
	const getDefaultProps = useMemo(
		() =>
			(componentName: string): Record<string, any> => {
				return config.defaults?.[componentName] || {}
			},
		[config.defaults],
	)

	// Merge default props with provided props
	const mergeProps = useMemo(
		() =>
			<T extends Record<string, any>>(componentName: string, props: T): T => {
				const defaultProps = getDefaultProps(componentName)
				return deepMerge(defaultProps, props) as T
			},
		[getDefaultProps],
	)

	// Context value
	const contextValue = useMemo<NewbieContextValue>(
		() => ({
			config,
			getDefaultProps,
			mergeProps,
		}),
		[config, getDefaultProps, mergeProps],
	)

	// Get Ant Design locale
	const antdLocale = useMemo(() => {
		if (config.locale === "zh_CN") {
			return zhCN
		}
		// Add more locales as needed
		return zhCN
	}, [config.locale])

	return (
		<ConfigProvider locale={antdLocale}>
			<NewbieContext.Provider value={contextValue}>{children}</NewbieContext.Provider>
		</ConfigProvider>
	)
}

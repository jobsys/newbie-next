/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components.
 * Acts as a UI adapter to handle themes, colors, and density across different antd versions.
 */

import { useMemo } from "react"

import type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue } from "./types"
import { NewbieContext } from "./context"
import { deepMerge } from "../../utils/merge"

/**
 * Default configuration
 */
const defaultConfig: NewbieProviderConfig = {
	locale: "zh_CN",
	themeMode: "light",
	density: "normal",
	defaults: {},
}

/**
 * NewbieProvider Component
 */
export function NewbieProvider(props: NewbieProviderProps): JSX.Element {
	const { config: userConfig = {}, children } = props

	// Merge user config with props and default config
	const config = useMemo<NewbieProviderConfig>(() => {
		return deepMerge(defaultConfig, userConfig)
	}, [userConfig])

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

	return <NewbieContext.Provider value={contextValue}>{children}</NewbieContext.Provider>
}

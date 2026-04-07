/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components.
 * Acts as a UI adapter to handle themes, colors, and density across different antd versions.
 */

import { useMemo } from "react"
import { ConfigProvider, App as AntApp, theme as antdTheme } from "antd"

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

	// Build AntD theme config based on Newbie config
	const antdThemeConfig = useMemo(() => {
		const isDark = config.themeMode === "dark"
		const algorithm = isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm

		const token: Record<string, any> = {}

		// Apply primary color if provided
		if (config.primaryColor) {
			token.colorPrimary = config.primaryColor
		}

		// Apply density settings
		if (config.density === "compact") {
			token.controlHeight = 30
			token.fontSize = 13
			token.padding = 12
		} else if (config.density === "loose") {
			token.controlHeight = 34
			token.fontSize = 14
			token.padding = 16
		}

		return { algorithm, token }
	}, [config.themeMode, config.primaryColor, config.density])

	// Map density to AntD componentSize
	const componentSize = useMemo(() => {
		if (config.density === "compact") return "small"
		if (config.density === "loose") return "large"
		return "middle"
	}, [config.density])

	return (
		<NewbieContext.Provider value={contextValue}>
			<ConfigProvider theme={antdThemeConfig} componentSize={componentSize}>
				<AntApp>{children}</AntApp>
			</ConfigProvider>
		</NewbieContext.Provider>
	)
}

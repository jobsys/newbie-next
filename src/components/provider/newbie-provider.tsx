/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components.
 * Acts as a UI adapter to handle themes, colors, and density across different antd versions.
 */

import { createContext, useContext, useMemo } from "react"
import { ConfigProvider, theme as antdTheme, App as AntApp } from "antd"
import { StyleProvider } from "@ant-design/cssinjs"
import zhCN from "antd/locale/zh_CN"
import type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue } from "./types"
import { deepMerge } from "../../utils/merge"

/**
 * NewbieContext
 */
const NewbieContext = createContext<NewbieContextValue | null>(null)

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
 * Hook to access NewbieContext
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
 */
export function NewbieProvider(props: NewbieProviderProps): JSX.Element {
	const { config: userConfig = {}, themeMode, primaryColor, density, children } = props

	// Merge user config with props and default config
	const config = useMemo<NewbieProviderConfig>(() => {
		const merged = deepMerge(defaultConfig, userConfig)
		if (themeMode) merged.themeMode = themeMode
		if (primaryColor) merged.primaryColor = primaryColor
		if (density) merged.density = density
		return merged
	}, [userConfig, themeMode, primaryColor, density])

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

	// Build Ant Design Theme
	const antdThemeConfig = useMemo(() => {
		const isDark = config.themeMode === "dark"
		const theme = {
			algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
			token: {} as Record<string, any>,
		}

		const getColor = (color?: string) => {
			if (!color) return undefined
			if (color.startsWith("#")) return color
			const colorMap: Record<string, string> = {
				blue: "#1677ff",
				green: "#52c41a",
				orange: "#fa8c16",
				red: "#ff4d4f",
				rose: "#eb2f96",
				violet: "#722ed1",
				yellow: "#fadb14",
				default: "#1677ff",
			}
			return colorMap[color] || color
		}

		if (config.primaryColor) {
			theme.token.colorPrimary = getColor(config.primaryColor)
		}

		// Density translation
		if (config.density === "compact") {
			theme.token.controlHeight = 28
			theme.token.fontSize = 12
			theme.token.padding = 12
		} else if (config.density === "loose") {
			theme.token.controlHeight = 36
			theme.token.fontSize = 15
			theme.token.padding = 18
		}

		return theme
	}, [config.themeMode, config.primaryColor, config.density])

	const antdLocale = useMemo(() => {
		if (config.locale === "zh_CN") return zhCN
		return zhCN
	}, [config.locale])

	// Calculate componentSize
	const componentSize = useMemo(() => {
		if (config.density === "compact") return "small"
		if (config.density === "loose") return "large"
		return "middle"
	}, [config.density])

	return (
		<StyleProvider hashPriority="high">
			<ConfigProvider locale={antdLocale} theme={antdThemeConfig} componentSize={componentSize}>
				<AntApp>
					<NewbieContext.Provider value={contextValue}>{children}</NewbieContext.Provider>
				</AntApp>
			</ConfigProvider>
		</StyleProvider>
	)
}

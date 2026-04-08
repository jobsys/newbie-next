/**
 * NewbieProvider Component
 *
 * Provides global configuration and default props override for all components.
 * Acts as a UI adapter to handle themes, colors, and density across different antd versions.
 *
 * 注意：此组件不再包裹 ConfigProvider，因为主应用应该在外层配置 ConfigProvider
 * 这样可以确保主题动态切换时不会被重新挂载
 */

import { useMemo } from "react"
import { App as AntApp } from "antd"

import type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue } from "./types"
import { NewbieContext } from "./context"
import { deepMerge } from "@/utils/merge"

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
 *
 * 支持动态主题切换，通过接收变化的 config 自动更新上下文
 * 注意：需要在 ConfigProvider 内部使用
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

	// Context value - 当 config 变化时自动更新
	const contextValue = useMemo<NewbieContextValue>(
		() => ({
			config,
			getDefaultProps,
			mergeProps,
		}),
		[config, getDefaultProps, mergeProps],
	)

	return (
		<NewbieContext.Provider value={contextValue}>
			<AntApp>{children}</AntApp>
		</NewbieContext.Provider>
	)
}

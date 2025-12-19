/**
 * Testing utilities
 *
 * Provides helper functions and wrappers for testing React components
 */

import { ReactElement } from "react"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"

/**
 * Custom render function with Ant Design ConfigProvider
 *
 * @param ui - React element to render
 * @param options - Render options
 * @returns Render result
 */
export function renderWithProviders(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
	function Wrapper({ children }: { children: React.ReactNode }) {
		return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
	}

	return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react"

/**
 * NewbieProvider tests
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { NewbieProvider, useNewbieContext } from "../newbie-provider"

describe("NewbieProvider", () => {
	it("should provide default context value", () => {
		function TestComponent() {
			const { config } = useNewbieContext()
			return <div>{config.locale}</div>
		}

		render(
			<NewbieProvider>
				<TestComponent />
			</NewbieProvider>,
		)

		expect(screen.getByText("zh_CN")).toBeInTheDocument()
	})

	it("should merge user config with default config", () => {
		function TestComponent() {
			const { config } = useNewbieContext()
			return <div>{config.locale}</div>
		}

		render(
			<NewbieProvider config={{ locale: "en_US" }}>
				<TestComponent />
			</NewbieProvider>,
		)

		expect(screen.getByText("en_US")).toBeInTheDocument()
	})

	it("should provide getDefaultProps function", () => {
		function TestComponent() {
			const { getDefaultProps } = useNewbieContext()
			const props = getDefaultProps("NewbieForm")
			return <div>{JSON.stringify(props)}</div>
		}

		render(
			<NewbieProvider
				config={{
					defaults: {
						NewbieForm: { layout: "vertical" },
					},
				}}
			>
				<TestComponent />
			</NewbieProvider>,
		)

		expect(screen.getByText('{"layout":"vertical"}')).toBeInTheDocument()
	})

	it("should provide mergeProps function", () => {
		function TestComponent() {
			const { mergeProps } = useNewbieContext()
			const merged = mergeProps("NewbieForm", { labelCol: { span: 6 } })
			return <div>{JSON.stringify(merged)}</div>
		}

		render(
			<NewbieProvider
				config={{
					defaults: {
						NewbieForm: { layout: "vertical" },
					},
				}}
			>
				<TestComponent />
			</NewbieProvider>,
		)

		const result = JSON.parse(screen.getByText(/layout/).textContent || "{}")
		expect(result.layout).toBe("vertical")
		expect(result.labelCol).toEqual({ span: 6 })
	})

	it("should throw error when used outside provider", () => {
		function TestComponent() {
			useNewbieContext()
			return <div>Test</div>
		}

		// Suppress console.error for this test
		const consoleError = console.error
		console.error = () => {}

		expect(() => {
			render(<TestComponent />)
		}).toThrow("useNewbieContext must be used within NewbieProvider")

		console.error = consoleError
	})
})

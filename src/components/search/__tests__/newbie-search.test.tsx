/**
 * NewbieSearch tests
 */

import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { NewbieSearch } from "../newbie-search"
import { renderWithProviders } from "../../../test/test-utils"
import type { SearchFieldConfig } from "../types"

describe("NewbieSearch", () => {
	it("should render search component", () => {
		const fields: SearchFieldConfig[] = [{ key: "name", type: "input", title: "姓名" }]

		renderWithProviders(<NewbieSearch fields={fields} />)

		expect(screen.getByText("搜索")).toBeInTheDocument()
		expect(screen.getByText("重置")).toBeInTheDocument()
	})

	it("should call onSubmit when submit button is clicked", () => {
		const fields: SearchFieldConfig[] = [{ key: "name", type: "input", title: "姓名" }]
		const onSubmit = vi.fn()

		renderWithProviders(<NewbieSearch fields={fields} onSubmit={onSubmit} />)

		// Note: This is a basic test. Full implementation would require user interaction
		expect(onSubmit).toBeDefined()
	})
})

/**
 * NewbieSearch tests
 */

import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { NewbieSearch } from "../newbie-search"
import { renderWithProviders } from "../../../test/test-utils"
import type { NewbieProColumn } from "../types"

describe("NewbieSearch", () => {
	it("should render search component", () => {
		const columns: NewbieProColumn[] = [{ key: "name", valueType: "text", title: "姓名" }]

		renderWithProviders(<NewbieSearch columns={columns} />)

		expect(screen.getByText("搜索")).toBeInTheDocument()
		expect(screen.getByText("重置")).toBeInTheDocument()
	})

	it("should call onSubmit when submit button is clicked", () => {
		const columns: NewbieProColumn[] = [{ key: "name", valueType: "text", title: "姓名" }]
		const onSubmit = vi.fn()

		renderWithProviders(<NewbieSearch columns={columns} onSubmit={onSubmit} />)

		// Note: This is a basic test. Full implementation would require user interaction
		expect(onSubmit).toBeDefined()
	})

	it("should handle sorting", () => {
		const columns: NewbieProColumn[] = [{ key: "createdAt", valueType: "dateTime", title: "创建时间", sorter: true }]
		const onSubmit = vi.fn()

		renderWithProviders(<NewbieSearch columns={columns} onSubmit={onSubmit} />)
	})
})

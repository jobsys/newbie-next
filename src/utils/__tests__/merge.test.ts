/**
 * Merge utility tests
 */

import { describe, it, expect } from "vitest"
import { deepMerge } from "../merge"

describe("deepMerge", () => {
	it("should merge two objects", () => {
		const target = { a: 1, b: { c: 2 } }
		const source = { b: { d: 3 } }
		const result = deepMerge(target, source)

		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } })
	})

	it("should return target if source is null", () => {
		const target = { a: 1 }
		const result = deepMerge(target, null)

		expect(result).toEqual(target)
	})

	it("should return target if source is undefined", () => {
		const target = { a: 1 }
		const result = deepMerge(target, undefined)

		expect(result).toEqual(target)
	})

	it("should override arrays", () => {
		const target = { items: [1, 2] }
		const source = { items: [3, 4] }
		const result = deepMerge(target, source)

		expect(result).toEqual({ items: [3, 4] })
	})
})

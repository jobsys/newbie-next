/**
 * Test setup file
 *
 * Configures the testing environment for Vitest
 */

import "@testing-library/jest-dom"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// Mock @ant-design/pro-components to avoid ESM/CJS issues
vi.mock("@ant-design/pro-components", async () => {
	return {
		ProConfigProvider: ({ children }: any) => children,
	}
})

// Cleanup after each test
afterEach(() => {
	cleanup()
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: any) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => {},
	}),
})

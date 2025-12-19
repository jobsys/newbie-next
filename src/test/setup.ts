/**
 * Test setup file
 *
 * Configures the testing environment for Vitest
 */

import "@testing-library/jest-dom"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// Cleanup after each test
afterEach(() => {
	cleanup()
})

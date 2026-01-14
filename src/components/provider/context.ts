/**
 * NewbieContext Definition
 *
 * Separated from NewbieProvider to support Fast Refresh
 */

import { createContext, useContext } from "react"
import type { NewbieContextValue } from "./types"

/**
 * NewbieContext
 */
export const NewbieContext = createContext<NewbieContextValue | null>(null)

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

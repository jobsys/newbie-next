/**
 * useClickOutside Hook
 *
 * Detects clicks outside of a referenced element
 *
 * @param ref - React ref to the element
 * @param handler - Callback function when click outside
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * useClickOutside(ref, () => {
 *   setIsOpen(false)
 * })
 * ```
 */

import { useEffect, type RefObject } from "react"

export function useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void): void {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			const el = ref?.current
			if (!el || el.contains(event.target as Node)) {
				return
			}
			handler(event)
		}

		document.addEventListener("mousedown", listener)
		document.addEventListener("touchstart", listener)

		return () => {
			document.removeEventListener("mousedown", listener)
			document.removeEventListener("touchstart", listener)
		}
	}, [ref, handler])
}

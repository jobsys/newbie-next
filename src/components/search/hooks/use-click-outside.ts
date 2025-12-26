/**
 * 点击外部触发 Hook (Click Outside Hook)
 *
 * 此 Hook 用于监听并在用户点击指定元素外部时触发回调函数。
 * 常用于关闭弹窗、下拉菜单、Popover 等交互组件。
 *
 * @param ref - 需要监听的元素的 React Ref
 * @param handler - 点击外部时执行的回调函数
 *
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const containerRef = useRef<HTMLDivElement>(null);
 *
 *   // 当点击 containerRef 之外的区域时，关闭下拉菜单
 *   useClickOutside(containerRef, () => {
 *     if (isOpen) setIsOpen(false);
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <ul><li>Option 1</li></ul>}
 *     </div>
 *   );
 * }
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

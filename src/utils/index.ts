/**
 * 合并类名
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ")
}

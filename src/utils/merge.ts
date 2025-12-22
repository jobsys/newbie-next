/**
 * Deep merge utility
 *
 * Merges two objects deeply, with the second object taking precedence
 *
 * @param target - Target object to merge into
 * @param source - Source object to merge from
 * @returns Merged object
 *
 * @example
 * ```ts
 * const merged = deepMerge(
 *   { a: 1, b: { c: 2 } },
 *   { b: { d: 3 } }
 * )
 * // Result: { a: 1, b: { c: 2, d: 3 } }
 * ```
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T> | Record<string, any> | undefined | null): T {
	if (!source) {
		return target
	}

	const result = { ...target } as any

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const sourceValue = source[key]
			const targetValue = result[key]

			if (
				sourceValue &&
				typeof sourceValue === "object" &&
				!Array.isArray(sourceValue) &&
				targetValue &&
				typeof targetValue === "object" &&
				!Array.isArray(targetValue)
			) {
				result[key] = deepMerge(targetValue, sourceValue)
			} else {
				result[key] = sourceValue
			}
		}
	}

	return result as T
}

/**
 * 深度合并工具函数 (Deep Merge Utility)
 *
 * 此工具用于深度递归合并两个对象。如果第二个对象中存在相同的属性，其值将覆盖第一个对象的值。
 * 对于对象类型的属性，会进行递归合并；对于基本类型、数组或 undefined/null，则直接覆盖。
 *
 * @param target - 目标对象，合并的基础
 * @param source - 源对象，其中的属性将合并到目标对象中
 * @returns 合并后的新对象（浅拷贝原 target 结构，递归部分深度拷贝）
 *
 * @example
 * ```ts
 * // 1. 基础对象合并
 * const base = { a: 1, b: { c: 2 } };
 * const extra = { b: { d: 3 }, e: 4 };
 * const result = deepMerge(base, extra);
 * // result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * // 2. 覆盖现有属性
 * const obj1 = { theme: 'dark', settings: { notifications: true } };
 * const obj2 = { theme: 'light', settings: { notifications: false } };
 * const merged = deepMerge(obj1, obj2);
 * // merged: { theme: 'light', settings: { notifications: false } }
 *
 * // 3. 处理 null/undefined
 * deepMerge({ a: 1 }, null); // 返回 { a: 1 }
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

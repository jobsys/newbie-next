import { useCallback, useState } from "react"
import { type HttpInstance } from "../utils/http"

/**
 * HTTP 请求状态接口 (HTTP Request State Interface)
 * 用于追踪异步请求的进度、结果和错误。
 */
export interface HttpState<T = any> {
	/** 成功返回的数据 (Data returned from a successful request) */
	data?: T
	/** 是否正在加载中 (Whether the request is ongoing) */
	loading: boolean
	/** 请求失败时的错误信息 (Error object if the request failed) */
	error?: any
}

/**
 * HTTP 请求 Hook (HTTP Request Hook)
 *
 * 这是一个通用的 Hook，结合 `createHttpClient` 生成的实例使用。
 * 它自动管理 `loading` 状态和 `error` 状态，简化组件内的异步逻辑。
 *
 * @param http - 通过 createHttpClient 创建的 HttpInstance 实例
 * @returns 包含状态（data, loading, error）和请求方法（get, post, put, delete）的对象
 *
 * @example
 * ```tsx
 * // 1. 初始化 http 实例 (建议在单独的 api 文件中)
 * const httpInstance = createHttpClient({ baseUrl: '/api' });
 *
 * // 2. 在组件中使用
 * function UserProfile() {
 *   const { data, loading, error, get } = useHttp(httpInstance);
 *
 *   useEffect(() => {
 *     get('/user/info');
 *   }, []);
 *
 *   if (loading) return <div>加载中...</div>;
 *   if (error) return <div>出错了: {error.message}</div>;
 *
 *   return <div>用户名: {data?.name}</div>;
 * }
 * ```
 */
export function useHttp<T = any>(http: HttpInstance) {
	const [state, setState] = useState<HttpState<T>>({
		data: undefined,
		loading: false,
		error: undefined,
	})

	const start = () =>
		setState((s) => ({
			...s,
			loading: true,
			error: undefined,
		}))

	const finish = (data?: T, error?: any) =>
		setState({
			data,
			error,
			loading: false,
		})

	const get = useCallback(
		async (url: string, config?: any): Promise<T> => {
			try {
				start()
				const res = await http.get<T>(url, config)
				finish(res, undefined)
				return res
			} catch (err) {
				finish(undefined, err)
				throw err
			}
		},
		[http],
	)

	const post = useCallback(
		async (url: string, data?: any, config?: any): Promise<T> => {
			try {
				start()
				const res = await http.post<T>(url, data, config)
				finish(res, undefined)
				return res
			} catch (err) {
				finish(undefined, err)
				throw err
			}
		},
		[http],
	)

	const put = useCallback(
		async (url: string, data?: any, config?: any): Promise<T> => {
			try {
				start()
				const res = await http.put<T>(url, data, config)
				finish(res, undefined)
				return res
			} catch (err) {
				finish(undefined, err)
				throw err
			}
		},
		[http],
	)

	const del = useCallback(
		async (url: string, config?: any): Promise<T> => {
			try {
				start()
				const res = await http.delete<T>(url, config)
				finish(res, undefined)
				return res
			} catch (err) {
				finish(undefined, err)
				throw err
			}
		},
		[http],
	)

	return {
		...state,
		get,
		post,
		put,
		delete: del,
		setState,
	}
}

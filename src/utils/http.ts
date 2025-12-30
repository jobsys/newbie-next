import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

/**
 * HTTP 客户端配置选项 (HTTP Client Options)
 */
export interface HttpOptions {
	/** 基础路径 (Base URL) */
	baseUrl?: string
	/** 是否禁用默认的全局错误提示 (Whether to disable default global error notifications) */
	disabledError?: boolean
	/** 自定义错误处理回调 (Custom error handler) */
	onError?: (message: string, error: AxiosError) => void
	/** 未授权处理回调，通常处理 401 错误 (Unauthorized handler, e.g. handle 401) */
	onUnauthorized?: (error: AxiosError) => void
}

/**
 * 增强的 Axios 实例接口 (Enhanced Axios Instance)
 * get/post/put/patch/delete 方法被重写以直接返回 Promise<T> 而不是 AxiosResponse<T>
 */
export interface HttpInstance extends AxiosInstance {
	get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
	delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
}

/**
 * 创建配置化的 HTTP 客户端 (Create a configured Axios instance)
 *
 * 此工具封装了 Axios，提供了统一的错误处理、响应拦截（如直接提取 data）、
 * 以及对 Inertia.js 响应的兼容。
 *
 * @param options - 配置选项
 * @returns 增强的 HttpInstance 实例
 *
 * @example
 * ```ts
 * const http = createHttpClient({
 *   baseUrl: '/api',
 *   onError: (msg) => message.error(msg),
 *   onUnauthorized: () => window.location.href = '/login'
 * });
 *
 * // 使用示例
 * const data = await http.get<{ name: string }>('/user/profile');
 * console.log(data.name);
 * ```
 */
/**
 * 默认 HTTP 实例 (Default Singleton Instance)
 */
export const defaultHttp = axios.create() as HttpInstance

/**
 * 全局配置 HTTP 客户端 (Global Configuration for HTTP Client)
 *
 * 用于初始化默认的 HTTP 实例，通常在应用入口调用。
 *
 * @param options - 配置选项
 */
export function setupHttp(options: HttpOptions = {}): void {
	createHttpClient(options, defaultHttp)
}

/**
 * 创建或配置 HTTP 客户端 (Create or configure an Axios instance)
 *
 * @param options - 配置选项
 * @param instance - 可选的现有实例，如果提供则对其进行配置
 * @returns HttpInstance 实例
 */
export function createHttpClient(options: HttpOptions = {}, instance?: HttpInstance): HttpInstance {
	const http = instance || (axios.create() as HttpInstance)

	http.defaults.baseURL = options.baseUrl ?? "/"
	http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
	http.defaults.withCredentials = true

	// 清除旧的拦截器 (Clear old interceptors if any)
	// 注意：axios 没有官方 API 清除所有，这里仅针对简单场景
	// 如果是全新实例则无所谓

	http.interceptors.response.use(
		(response: AxiosResponse) => {
			// Handle Inertia responses
			if (response.headers["x-inertia"]) {
				return response as any
			}

			// 兼容处理：如果返回包含 status 和 result (Laravel standard success response)
			const data = response.data
			if (data && typeof data === "object" && "status" in data && "result" in data) {
				if (data.status === "SUCCESS") {
					return data.result
				}
				// 业务逻辑错误 (Business Logic Error)
				const msg = data.result || "操作失败"
				if (options.onError) {
					options.onError(msg, null as any)
				}
				throw new Error(msg)
			}

			// Return data directly for normal requests
			return data as any
		},
		(error: AxiosError) => {
			if ((error as any).code === "ERR_CANCELED") {
				return Promise.reject(error)
			}

			const status = error.response?.status
			const responseData = error.response?.data as any
			const errorMessage = responseData?.message || error.message || "请求失败"

			if (status === 401) {
				if (options.onUnauthorized) {
					options.onUnauthorized(error)
				} else if (options.onError) {
					options.onError("登录状态已失效，请重新登录", error)
				}
			} else if (status === 403) {
				if (options.onError) {
					options.onError("您没有权限访问该页面", error)
				}
			} else if (!options.disabledError) {
				const finalMessage = status ? `${errorMessage} (HTTP ${status})` : `网络出错: ${errorMessage}`

				if (options.onError) {
					options.onError(finalMessage, error)
				}
			}

			return Promise.reject(error)
		},
	)

	return http
}

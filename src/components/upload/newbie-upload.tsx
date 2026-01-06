import { UploadOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Upload, message, Image } from "antd"
import type { UploadFile, UploadProps, GetProp } from "antd"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (file: FileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = (error) => reject(error)
	})

import React, { useState } from "react"
import { useNewbieContext } from "../provider"

/**
 * 媒体文件接口
 */
export interface MediaItem {
	id: number | string
	uuid?: string
	uid?: string
	url: string
	thumb_url?: string
	thumbUrl?: string
	file_name?: string
	name?: string
	size?: number
	mime_type?: string
}

/**
 * NewbieUpload 组件属性
 * @example
 * ```tsx
 * <NewbieUpload action="/api/upload" onChange={(id) => console.log(id)} />
 * ```
 */
export interface NewbieUploadProps extends Omit<UploadProps, "value" | "onChange" | "fileList"> {
	/** 当前值（Media ID 或 UUID，或者它们的数组） */
	value?: number | string | (number | string)[]
	/** 值变更回调 */
	onChange?: (value: number | string | (number | string)[] | null) => void
	/** 是否支持多文件上传 */
	multiple?: boolean
	/** 最大文件数量 */
	maxCount?: number
	/** 最大文件大小 (MB) */
	maxSize?: number
	/** 允许的文件类型 */
	accept?: string
	/** 上传接口地址 */
	action?: string
	/** 自定义请求头 */
	headers?: Record<string, string>
	/** 解析上传接口返回的结果 */
	parseResponse?: (response: any) => MediaItem
}

/**
 * NewbieUpload 多媒体上传组件
 *
 * 封装了 Ant Design Upload，支持单文件和多文件上传模式。
 */
export const NewbieUpload: React.FC<NewbieUploadProps> = (props) => {
	const { mergeProps } = useNewbieContext()

	// Filter undefined props so they don't overwrite context defaults
	const cleanProps = Object.fromEntries(Object.entries(props).filter(([_, v]) => v !== undefined))

	// Merge global defaults with passed props
	const propsWithDefaults = mergeProps("NewbieUpload", cleanProps)

	// Destructure merged props
	const {
		value,
		onChange: mergedOnChange,
		multiple: mergedMultiple,
		maxCount: mergedMaxCount,
		maxSize: mergedMaxSize,
		accept: mergedAccept,
		action: mergedAction,
		headers: mergedHeaders,
		listType,
		parseResponse: mergedParseResponse,
		...rest
	} = propsWithDefaults

	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewImage, setPreviewImage] = useState("")
	const [previewTitle, setPreviewTitle] = useState("")

	const isImage = (file: UploadFile) => {
		if (file.type?.startsWith("image/")) return true
		const url = file.url || (file.thumbUrl as string)
		const extension = url?.substring(url.lastIndexOf(".") + 1).toLowerCase()
		return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(extension || "")
	}

	const handlePreview = async (file: UploadFile) => {
		if (!isImage(file)) {
			if (file.url) {
				window.open(file.url, "_blank")
			}
			return
		}

		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType)
		}

		setPreviewImage(file.url || (file.preview as string))
		setPreviewOpen(true)
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1))
	}

	// Sync value to fileList
	React.useEffect(() => {
		if (value === undefined || value === null) {
			setFileList([])
			return
		}

		const values = Array.isArray(value) ? value : [value]

		const newFileList: UploadFile[] = values.map((val: any, index: number) => {
			// If it's already an object that looks like MediaItem, use its properties
			if (typeof val === "object" && val !== null) {
				const item = val as any
				return {
					uid: String(item.id || item.uid || index),
					name: item.file_name || item.name || "file",
					status: "done" as const,
					url: item.url || item.original_url,
					thumbUrl: item.thumb_url || item.thumbUrl || item.url || item.original_url,
					response: item,
				}
			}

			// If it's a string that looks like a URL
			if (typeof val === "string" && (val.startsWith("http") || val.startsWith("/"))) {
				return {
					uid: String(index),
					name: "image",
					status: "done" as const,
					url: val,
					thumbUrl: val,
					response: { url: val },
				}
			}

			// If it's just an ID
			return {
				uid: String(val),
				name: "file",
				status: "done" as const,
				response: { id: val },
			}
		})

		// Only update if the content actually changed
		setFileList((prevFileList) => {
			const prevKeys = prevFileList.map((f) => String(f.response?.id || f.uid || f.url)).join(",")
			const newKeys = newFileList.map((f) => String(f.response?.id || f.uid || f.url)).join(",")

			if (prevKeys === newKeys) {
				return prevFileList
			}

			return newFileList
		})
	}, [value])

	const handleChange: UploadProps["onChange"] = (info) => {
		let newFileList = [...info.fileList]

		// Normalize response for each file
		newFileList = newFileList.map((file) => {
			if (file.response && !file.url) {
				const parsed = mergedParseResponse ? mergedParseResponse(file.response) : (file.response as MediaItem)

				file.url = parsed.url
				// Also update response in file object to the parsed one for consistency
				if (mergedParseResponse) {
					file.response = parsed
				}
			}
			return file
		})

		// Handle maxCount / multiple
		if (!mergedMultiple) {
			newFileList = newFileList.slice(-1)
		} else if (mergedMaxCount) {
			newFileList = newFileList.slice(0, mergedMaxCount)
		}

		setFileList(newFileList)

		// Trigger onChange when all files are done or removed
		const isAllDone = newFileList.every((f) => f.status === "done" || f.status === "error" || !f.status)
		if (isAllDone && mergedOnChange) {
			const results = newFileList
				.filter((f) => f.status === "done" || (!f.status && f.url)) // Include successful uploads and initial values
				.map((f) => f.response?.id || f.uid)
				.filter(Boolean) as (string | number)[]

			if (mergedMultiple) {
				mergedOnChange(results)
			} else {
				mergedOnChange(results[0] || null)
			}
		}
	}

	// 获取 CSRF token（用于 Upload 组件的请求）
	const getCSRFToken = (): string | null => {
		// 优先从 meta 标签获取
		const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
		if (metaToken) return metaToken

		// 从 cookie 获取（Laravel 默认使用 XSRF-TOKEN）
		const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
		if (cookieMatch) {
			return decodeURIComponent(cookieMatch[1])
		}

		return null
	}

	const csrfToken = getCSRFToken()
	const uploadHeaders = {
		...mergedHeaders,
		...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
	}

	const uploadProps: UploadProps = {
		...rest,
		name: "file",
		fileList,
		listType: listType || "text",
		action: mergedAction,
		headers: uploadHeaders,
		onChange: handleChange,
		onPreview: handlePreview,
		accept: mergedAccept,
		multiple: mergedMultiple,
		beforeUpload: (file) => {
			const isLtMax = file.size / 1024 / 1024 < (mergedMaxSize || 10)
			if (!isLtMax) {
				message.error(`文件大小不能超过 ${mergedMaxSize || 10}MB!`)
			}
			return isLtMax || Upload.LIST_IGNORE
		},
	}

	// Logic to show/hide upload button
	const showUploadButton = (() => {
		// If maxCount is specified, use it
		if (mergedMaxCount !== undefined) {
			return fileList.length < mergedMaxCount
		}
		// If multiple is false (single mode), default behavior is always show button to allow replace?
		// But user requested behavior implies hiding it.
		// AntD 'picture-card' usually hides if maxCount reached.
		// Let's stick to standard maxCount. If user wants single file list with button hiding, maxCount=1 should be set.
		return true
	})()

	return (
		<>
			<Upload {...uploadProps}>
				{rest.children
					? rest.children
					: showUploadButton &&
						(listType === "picture-card" || listType === "picture-circle" ? (
							<button
								style={{
									border: 0,
									background: "none",
									cursor: "pointer",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									width: "100%",
									height: "100%",
								}}
								type="button"
							>
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>上传</div>
							</button>
						) : (
							<Button icon={<UploadOutlined />}>点击上传</Button>
						))}
			</Upload>
			{previewImage && (
				<Image
					wrapperStyle={{ display: "none" }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(""),
						title: previewTitle,
					}}
					src={previewImage}
				/>
			)}
		</>
	)
}

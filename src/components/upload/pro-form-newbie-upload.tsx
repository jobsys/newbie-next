import { Form } from "antd"
import type { FormItemProps } from "antd"
import React from "react"
import { NewbieUpload } from "./newbie-upload"
import type { NewbieUploadProps } from "./newbie-upload"

/**
 * ProFormNewbieUpload 属性
 */
export interface ProFormNewbieUploadProps extends FormItemProps {
	/** 透传给 NewbieUpload 的属性 */
	fieldProps?: NewbieUploadProps
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
	/** 列表展现方式 */
	listType?: NewbieUploadProps["listType"]
	/** 解析上传接口返回的结果 */
	parseResponse?: NewbieUploadProps["parseResponse"]
}

/**
 * ProFormNewbieUpload 表单上传组件
 *
 * @deprecated 由于在 ProForm 中存在 Context 和 Value 注入的兼容性问题，该组件已被废弃。
 * 请直接使用 Ant Design 的 Form.Item 或 ProFormItem 配合 NewbieUpload 使用。
 *
 * @example
 * ```tsx
 * // 推荐写法：
 * <ProFormItem name="avatar">
 *   <NewbieUpload action="/api/upload" />
 * </ProFormItem>
 * ```
 */
export const ProFormNewbieUpload: React.FC<ProFormNewbieUploadProps> = (props) => {
	const { fieldProps, multiple, maxCount, maxSize, accept, action, listType, parseResponse, ...rest } = props

	React.useEffect(() => {
		console.warn("[jobsys-newbie-next] ProFormNewbieUpload is deprecated. Please use Form.Item or ProFormItem with NewbieUpload instead.")
	}, [])

	return (
		<Form.Item {...rest}>
			<NewbieUpload
				{...fieldProps}
				multiple={multiple}
				maxCount={maxCount}
				maxSize={maxSize}
				accept={accept}
				action={action}
				listType={listType}
				parseResponse={parseResponse}
			/>
		</Form.Item>
	)
}

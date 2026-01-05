import { ProFormItem } from "@ant-design/pro-components"
import type { FormItemProps } from "antd"
import React from "react"
import { NewbieUpload } from "./newbie-upload"
import type { NewbieUploadProps } from "./newbie-upload"

/**
 * ProFormNewbieUpload 属性
 */
export interface ProFormNewbieUploadProps extends FormItemProps {
	/** 透传给 NewbieUpload 的属性 */
	fieldProps?: Omit<NewbieUploadProps, "value" | "onChange">
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
 * 适配 Ant Design Pro Form 的上传组件。
 *
 * @example
 * ```tsx
 * <ProFormNewbieUpload
 *   name="avatar"
 *   label="头像"
 *   action="/api/upload"
 * />
 * ```
 */
export const ProFormNewbieUpload: React.FC<ProFormNewbieUploadProps> = (props) => {
	const { fieldProps, multiple, maxCount, maxSize, accept, action, listType, parseResponse, ...rest } = props

	return (
		<ProFormItem {...rest}>
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
		</ProFormItem>
	)
}

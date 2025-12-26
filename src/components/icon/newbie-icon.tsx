import React from "react"
import Icon from "@ant-design/icons"
import type { LucideIcon } from "lucide-react"

/**
 * NewbieIcon 组件属性 (NewbieIcon Props)
 */
export interface NewbieIconProps {
	/** Lucide 图标组件 (Lucide icon component) */
	icon: LucideIcon
	/** 图标大小 (Icon size, default: 14) */
	size?: number | string
	/** 笔触粗细 (Stroke width, default: 2) */
	strokeWidth?: number
	/** 自定义类名 (Custom class name) */
	className?: string
	/** 自定义样式 (Custom style) */
	style?: React.CSSProperties
	/** 旋转角度 (Rotate angle) */
	rotate?: number
	/** 是否有旋转动画 (Whether there is a rotate animation) */
	spin?: boolean
}

/**
 * NewbieIcon 组件 (NewbieIcon Component)
 *
 * 这是一个适配 Ant Design 规范的 Lucide 图标包装组件。
 * 它通过 @ant-design/icons 的 Icon 组件进行封装，确保在 Antd 的 Button、Menu 等组件中
 * 具有一致的尺寸对齐、颜色继承和样式表现。
 *
 * @param props - 组件属性
 * @returns 适配 Antd 规范的图标组件
 *
 * @example
 * ```tsx
 * import { User } from 'lucide-react';
 * import { NewbieIcon } from '@jobsys/newbie-next';
 *
 * // 在按钮中使用 (Use in Button)
 * <Button icon={<NewbieIcon icon={User} />}>用户</Button>
 *
 * // 自定义尺寸和粗细 (Custom size and stroke width)
 * <NewbieIcon icon={User} size={16} strokeWidth={1.5} />
 * ```
 */
export const NewbieIcon: React.FC<NewbieIconProps> = ({ icon: LucideIcon, size = 14, strokeWidth = 2, ...rest }) => {
	return <Icon component={() => <LucideIcon size={size} strokeWidth={strokeWidth} />} {...rest} />
}

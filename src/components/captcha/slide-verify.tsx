import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react"
import { SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { theme } from "antd"
import { classNames } from "@/utils"

export type TrailPoint = {
	x: number
	y: number
	t: number
}

export interface SlideVerifyProps {
	/** 是否激活，未激活时不可滑动 */
	active?: boolean
	/** 滑动成功后的回调 */
	onVerify?: (x: number, trail: TrailPoint[]) => void
	/** 轨道高度，默认 48 */
	height?: number
	/** 滑块宽度，默认 40 */
	handleWidth?: number
	/** 默认提示文字 */
	text?: string
	/** 验证通过后的提示文字 */
	successText?: string
	/** 额外的容器类名 */
	className?: string
	/** 容器样式 */
	style?: React.CSSProperties
}

export interface SlideVerifyRef {
	/** 重置验证码状态 */
	reset: () => void
}

const SlideVerify = forwardRef<SlideVerifyRef, SlideVerifyProps>((props, ref) => {
	const { active = true, onVerify, height = 48, handleWidth = 40, text = "向右滑动完成验证", successText = "验证通过", className, style } = props

	const { token } = theme.useToken()
	const [dragging, setDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [currentX, setCurrentX] = useState(0)
	const [status, setStatus] = useState<"idle" | "success">("idle")
	const trackRef = useRef<HTMLDivElement>(null)
	const currentXRef = useRef(0)
	const trailRef = useRef<TrailPoint[]>([])

	useImperativeHandle(ref, () => ({
		reset: () => {
			setCurrentX(0)
			currentXRef.current = 0
			trailRef.current = []
			setStatus("idle")
		},
	}))

	const handleDragStart = (clientX: number, clientY: number) => {
		if (!active || status === "success") return
		setDragging(true)
		setStartX(clientX - currentX)
		trailRef.current = [{ x: currentX, y: clientY, t: Date.now() }]
	}

	const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY)
	const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)

	useEffect(() => {
		const handleMove = (clientX: number, clientY: number) => {
			if (!dragging) return
			const diff = clientX - startX
			const trackWidth = trackRef.current?.offsetWidth || 0
			const maxMove = trackWidth - handleWidth - 8 // 8 is total padding (4+4)
			const moveX = Math.max(0, Math.min(diff, maxMove))

			setCurrentX(moveX)
			currentXRef.current = moveX

			// Record trail point
			trailRef.current.push({ x: moveX, y: clientY, t: Date.now() })
		}

		const handleEnd = () => {
			if (!dragging) return
			setDragging(false)
			const trackWidth = trackRef.current?.offsetWidth || 0
			const threshold = trackWidth - handleWidth - 8

			if (currentXRef.current >= threshold - 5) {
				setCurrentX(threshold)
				currentXRef.current = threshold
				setStatus("success")
				onVerify?.(currentXRef.current, trailRef.current)
			} else {
				setCurrentX(0)
				currentXRef.current = 0
				trailRef.current = []
			}
		}

		const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
		const onTouchMove = (e: TouchEvent) => {
			if (dragging) e.preventDefault()
			handleMove(e.touches[0].clientX, e.touches[0].clientY)
		}

		if (dragging) {
			window.addEventListener("mousemove", onMouseMove)
			window.addEventListener("mouseup", handleEnd)
			window.addEventListener("touchmove", onTouchMove, { passive: false })
			window.addEventListener("touchend", handleEnd)
		}
		return () => {
			window.removeEventListener("mousemove", onMouseMove)
			window.removeEventListener("mouseup", handleEnd)
			window.removeEventListener("touchmove", onTouchMove)
			window.removeEventListener("touchend", handleEnd)
		}
	}, [dragging, startX, onVerify, handleWidth])

	const isSuccess = status === "success"

	// 轨道样式
	const trackStyle: React.CSSProperties = {
		position: "relative",
		height,
		borderRadius: token.borderRadiusLG,
		border: `1px solid ${isSuccess ? token.colorSuccessBorder : token.colorBorderSecondary}`,
		backgroundColor: isSuccess ? token.colorSuccessBg : token.colorFillAlter,
		transition: "all 0.3s",
		overflow: "hidden",
		boxShadow: isSuccess ? "none" : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
	}

	// 进度条样式
	const progressStyle: React.CSSProperties = {
		position: "absolute",
		left: 0,
		top: 0,
		height: "100%",
		backgroundColor: isSuccess ? token.colorSuccessBgHover : "rgba(255, 165, 0, 0.1)",
		transition: dragging ? "none" : "all 0.3s",
		width: currentX + handleWidth + 4,
	}

	// 滑块样式
	const handleStyle: React.CSSProperties = {
		position: "absolute",
		zIndex: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: token.colorBgContainer,
		borderRadius: token.borderRadius,
		border: `1px solid ${isSuccess ? token.colorSuccess : dragging ? token.colorPrimary : token.colorBorder}`,
		boxShadow: dragging ? token.boxShadowSecondary : token.boxShadowTertiary,
		transition: dragging ? "none" : "all 0.3s",
		cursor: isSuccess ? "default" : dragging ? "grabbing" : "grab",
		left: currentX + 4,
		width: handleWidth,
		height: height - 8,
		top: 4,
		touchAction: "none",
		transform: dragging ? "scale(1.05)" : "scale(1)",
	}

	// 文字样式
	const textStyle: React.CSSProperties = {
		width: "100%",
		textAlign: "center",
		fontWeight: 500,
		userSelect: "none",
		position: "relative",
		zIndex: 0,
		transition: "opacity 0.3s",
		lineHeight: `${height}px`,
		fontSize: "13px",
		color: isSuccess ? token.colorSuccessText : token.colorTextDescription,
	}

	return (
		<div className={classNames("nb-slide-verify", className)} style={{ ...style, position: "relative" }}>
			<div ref={trackRef} style={trackStyle}>
				{/* Progress Overlay */}
				<div style={progressStyle} />

				{/* Handle */}
				<div onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} style={handleStyle} className="nb-slide-verify-handle">
					{isSuccess ? (
						<CheckCircleOutlined style={{ color: token.colorSuccess, fontSize: "18px" }} />
					) : (
						<SafetyOutlined style={{ color: dragging ? token.colorPrimary : token.colorTextQuaternary, fontSize: "18px" }} />
					)}
				</div>

				<div style={textStyle}>{isSuccess ? successText : dragging ? "" : text}</div>
			</div>
		</div>
	)
})

export default SlideVerify

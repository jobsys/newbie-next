import React, { useRef, useState } from "react"
import { Card, Typography, Space, Button, message, Table, Divider, Tag } from "antd"
import { SlideVerify, SlideVerifyRef, TrailPoint } from "../../../src"
import { ShieldCheck, RotateCcw } from "lucide-react"
import { NewbieIcon } from "../../../src"

const { Title, Paragraph, Text } = Typography

export function CaptchaDemo() {
	const verifyRef = useRef<SlideVerifyRef>(null)
	const [lastResult, setLastResult] = useState<{ x: number; trail: TrailPoint[] } | null>(null)

	const handleVerify = (x: number, trail: TrailPoint[]) => {
		message.success(`验证成功！最终位置：${x.toFixed(2)}px，采集到 ${trail.length} 个轨迹点`)
		setLastResult({ x, trail })
	}

	const handleReset = () => {
		verifyRef.current?.reset()
		setLastResult(null)
	}

	// 轨迹表格列定义
	const columns = [
		{ title: "X 坐标", dataIndex: "x", key: "x", render: (val: number) => val.toFixed(1) },
		{ title: "Y 坐标", dataIndex: "y", key: "y", render: (val: number) => val.toFixed(1) },
		{ title: "时间戳 (ms)", dataIndex: "t", key: "t" },
	]

	return (
		<div style={{ maxWidth: 800, margin: "0 auto" }}>
			<Title level={2}>SlideVerify 滑块验证</Title>
			<Paragraph>
				SlideVerify 是一个高性能、支持人机校验（轨迹追踪）的滑动验证码组件。它支持高性能的拖拽响应、触摸事件以及完整的行为特征数据采集。
			</Paragraph>

			<Card title="基础演示" variant="outlined" style={{ marginBottom: 24 }}>
				<div style={{ maxWidth: 400, margin: "20px auto" }}>
					<SlideVerify ref={verifyRef} onVerify={handleVerify} />

					<div style={{ textAlign: "center", marginTop: 16 }}>
						<Button icon={<NewbieIcon icon={RotateCcw} size={14} />} onClick={handleReset}>
							重置验证码
						</Button>
					</div>
				</div>
			</Card>

			<Card title="参数定制演示" variant="outlined" style={{ marginBottom: 24 }}>
				<Paragraph>支持自定义高度、滑块宽度、提示文字等。</Paragraph>
				<Space direction="vertical" style={{ width: "100%" }} size="large">
					<div>
						<Text strong>大尺寸 (height=60, handleWidth=60)</Text>
						<div style={{ marginTop: 8 }}>
							<SlideVerify
								height={60}
								handleWidth={60}
								text="请用力向右滑动"
								successText="太棒了，验证通过"
								onVerify={(x) => message.info(`大滑块验证通过: ${x}`)}
							/>
						</div>
					</div>

					<div>
						<Text strong>紧凑型 (height=32, handleWidth=32)</Text>
						<div style={{ marginTop: 8 }}>
							<SlideVerify height={32} handleWidth={32} text="Slide..." onVerify={(x) => message.info(`小滑块验证通过: ${x}`)} />
						</div>
					</div>
				</Space>
			</Card>

			{lastResult && (
				<Card
					title={
						<Space>
							<ShieldCheck size={18} /> 采集到的行为轨迹数据
						</Space>
					}
					variant="outlined"
					extra={<Tag color="green">人机特征已采集</Tag>}
				>
					<Paragraph>
						验证通过后，组件会返回用户的滑动 X 坐标偏移量以及完整的轨迹数组 <Text code>(x, y, timestamp)</Text>。
						后端可以通过分析这些轨迹点来识别是否为脚本模拟。
					</Paragraph>
					<Table
						dataSource={lastResult.trail.slice(-10)} // 只显示最后10个点作为演示
						columns={columns}
						rowKey="t"
						pagination={false}
						size="small"
						bordered
						footer={() => `共采集 ${lastResult.trail.length} 个轨迹点 (由于演示仅显示最后 10 个)`}
					/>
				</Card>
			)}

			<Divider />

			<Title level={3}>API 参考</Title>
			<Table
				pagination={false}
				rowKey="property"
				dataSource={[
					{ property: "active", type: "boolean", default: "true", description: "是否激活，未激活时无法拖动" },
					{ property: "onVerify", type: "(x: number, trail: TrailPoint[]) => void", default: "-", description: "验证通过后的回调" },
					{ property: "height", type: "number", default: "48", description: "轨道高度" },
					{ property: "handleWidth", type: "number", default: "40", description: "滑块宽度" },
					{ property: "text", type: "string", default: "向右滑动完成验证", description: "默认提示文字" },
					{ property: "successText", type: "string", default: "验证通过", description: "成功提示文字" },
					{ property: "className", type: "string", default: "-", description: "容器类名" },
				]}
				columns={[
					{ title: "属性", dataIndex: "property", key: "property" },
					{ title: "类型", dataIndex: "type", key: "type", render: (t) => <Text code>{t}</Text> },
					{ title: "默认值", dataIndex: "default", key: "default" },
					{ title: "描述", dataIndex: "description", key: "description" },
				]}
			/>
		</div>
	)
}

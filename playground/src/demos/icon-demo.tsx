import React from "react"
import { Typography, Card, Space, Button, Table, Tag, Divider, Alert } from "antd"
import { NewbieIcon } from "../../../src/components/icon"
import {
	User,
	Settings,
	LogOut,
	Search,
	Bell,
	Mail,
	Calendar,
	CheckCircle,
	AlertTriangle,
	Info,
	ArrowRight,
	Heart,
	Share2,
	Download,
	Plus,
} from "lucide-react"

const { Title, Paragraph, Text } = Typography

/**
 * IconDemo Component
 */
export function IconDemo() {
	const iconData = [
		{ property: "icon", type: "LucideIcon", description: "任意从 lucide-react 导出的图标组件 (Any icon component from lucide-react)" },
		{ property: "size", type: "number | string", description: "图标大小 (Icon size)，支持数字或字符串，默认 14" },
		{ property: "strokeWidth", type: "number", description: "笔触粗细 (Stroke width)，默认 2" },
		{ property: "spin", type: "boolean", description: "是否旋转 (Whether to spin)，常用于加载状态" },
		{ property: "rotate", type: "number", description: "旋转角度 (Rotation angle)" },
		{ property: "className", type: "string", description: "自定义类名 (Custom CSS class)" },
		{ property: "style", type: "React.CSSProperties", description: "自定义内联样式 (Custom inline style)" },
	]

	return (
		<div style={{ maxWidth: 1000, margin: "0 auto" }}>
			<Title level={2}>NewbieIcon</Title>
			<Paragraph>
				<Text code>NewbieIcon</Text> 是对 <Text strong>Lucide Icons</Text> 的封装，使其完美符合 Ant Design 的视觉规范。 它解决了原生 SVG
				图标在 Antd 组件（如按钮、菜单、表单项）中常见的对齐不正、无法继承颜色等问题。
			</Paragraph>

			<Alert
				message="为什么需要这个组件？"
				description={
					<ul>
						<li>
							<strong>自动对齐</strong>：基于 @ant-design/icons 封装，获得与 Antd 原生图标完全一致的垂直对齐。
						</li>
						<li>
							<strong>颜色继承</strong>：图标颜色自动跟随父级元素的文本颜色（通过 currentColor 控制）。
						</li>
						<li>
							<strong>风格统一</strong>：默认 14px 尺寸和 2px 笔触，完美贴合 Antd 默认风格。
						</li>
					</ul>
				}
				type="info"
				showIcon
				style={{ marginBottom: 24 }}
			/>

			<Card title="基础展示 (Basic Usage)" style={{ marginBottom: 24 }}>
				<Space direction="vertical" size="middle" style={{ width: "100%" }}>
					<Space size="large">
						<Space direction="vertical" align="center">
							<NewbieIcon icon={User} />
							<Text type="secondary">User</Text>
						</Space>
						<Space direction="vertical" align="center">
							<NewbieIcon icon={Settings} />
							<Text type="secondary">Settings</Text>
						</Space>
						<Space direction="vertical" align="center">
							<NewbieIcon icon={Bell} />
							<Text type="secondary">Bell</Text>
						</Space>
						<Space direction="vertical" align="center">
							<NewbieIcon icon={Mail} />
							<Text type="secondary">Mail</Text>
						</Space>
						<Space direction="vertical" align="center">
							<NewbieIcon icon={CheckCircle} />
							<Text type="secondary">Check</Text>
						</Space>
					</Space>
					<Card styles={{ body: { padding: "12px", background: "#001529" } }}>
						<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
							{`import { User } from 'lucide-react';
import { NewbieIcon } from '@jobsys/newbie-next';

// 基础用法
<NewbieIcon icon={User} />`}
						</pre>
					</Card>
				</Space>
			</Card>

			<Card title="Ant Design 组件集成 (Antd Integration)" style={{ marginBottom: 24 }}>
				<Space direction="vertical" size="middle" style={{ width: "100%" }}>
					<Space wrap>
						<Button type="primary" icon={<NewbieIcon icon={Search} />}>
							搜索用户
						</Button>
						<Button icon={<NewbieIcon icon={Settings} />}>系统设置</Button>
						<Button danger icon={<NewbieIcon icon={LogOut} />}>
							退出登录
						</Button>
						<Button shape="circle" icon={<NewbieIcon icon={Plus} />}></Button>
						<Button type="dashed" icon={<NewbieIcon icon={Download} />}>
							下载报表
						</Button>
					</Space>

					<Divider orientation="left" plain>
						带颜色的标签 (Colored Tags)
					</Divider>
					<Space wrap>
						<Tag icon={<NewbieIcon icon={CheckCircle} />} color="success">
							已完成
						</Tag>
						<Tag icon={<NewbieIcon icon={AlertTriangle} />} color="warning">
							待检查
						</Tag>
						<Tag icon={<NewbieIcon icon={Info} />} color="processing">
							处理中
						</Tag>
					</Space>

					<Card styles={{ body: { padding: "12px", background: "#001529" } }}>
						<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
							{`<Button type="primary" icon={<NewbieIcon icon={Search} />}>搜索</Button>

<Tag icon={<NewbieIcon icon={CheckCircle} />} color="success">已完成</Tag>`}
						</pre>
					</Card>
				</Space>
			</Card>

			<Card title="属性定制 (Custom Attributes)" style={{ marginBottom: 24 }}>
				<Space direction="vertical" size="middle" style={{ width: "100%" }}>
					<Space direction="vertical" size="large">
						<Space size="large" align="center">
							<NewbieIcon icon={Heart} size={14} />
							<NewbieIcon icon={Heart} size={20} />
							<NewbieIcon icon={Heart} size={32} />
							<Text type="secondary">不同尺寸 (Sizes: 14, 20, 32)</Text>
						</Space>

						<Space size="large" align="center">
							<NewbieIcon icon={Share2} strokeWidth={1} />
							<NewbieIcon icon={Share2} strokeWidth={2} />
							<NewbieIcon icon={Share2} strokeWidth={3} />
							<Text type="secondary">不同笔触 (Stroke Widths: 1, 2, 3)</Text>
						</Space>

						<Space size="large" align="center">
							<NewbieIcon icon={Settings} spin />
							<NewbieIcon icon={ArrowRight} rotate={45} />
							<Text type="secondary">动画与旋转 (Spin & Rotate)</Text>
						</Space>
					</Space>

					<Card styles={{ body: { padding: "12px", background: "#001529" } }}>
						<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
							{`// 尺寸与加粗
<NewbieIcon icon={Heart} size={32} strokeWidth={3} />

// 动画与旋转
<NewbieIcon icon={Settings} spin />
<NewbieIcon icon={ArrowRight} rotate={45} />`}
						</pre>
					</Card>
				</Space>
			</Card>

			<Title level={3}>API 参考 (Props)</Title>
			<Table
				dataSource={iconData}
				pagination={false}
				rowKey="property"
				columns={[
					{ title: "属性", dataIndex: "property", key: "property", width: "25%", render: (text) => <Text code>{text}</Text> },
					{ title: "类型", dataIndex: "type", key: "type", width: "25%", render: (text) => <Text type="secondary">{text}</Text> },
					{ title: "描述", dataIndex: "description", key: "description" },
				]}
				size="small"
				bordered
			/>
		</div>
	)
}

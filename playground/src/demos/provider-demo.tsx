/**
 * NewbieProvider Demo
 */

import React from "react"
import { Typography, Card, Space, Divider, Table, Tag } from "antd"
import { NewbieIcon } from "../../../src/components/icon"
import { Settings } from "lucide-react"

const { Title, Paragraph, Text } = Typography

export function ProviderDemo() {
	const providerData = [
		{ property: "config", type: "NewbieProviderConfig", default: "{}", required: "否", description: "全局配置对象" },
		{ property: "themeMode", type: "'light' | 'dark' | 'system'", default: "'light'", required: "否", description: "主题模式" },
		{ property: "primaryColor", type: "string", default: "'#1677ff'", required: "否", description: "全局主色" },
		{ property: "density", type: "'loose' | 'normal' | 'compact'", default: "'normal'", required: "否", description: "UI 密度" },
		{ property: "children", type: "ReactNode", default: "-", required: "是", description: "子组件" },
	]

	const configData = [
		{ property: "locale", type: "string", default: "'zh_CN'", required: "否", description: "语言配置" },
		{ property: "themeMode", type: "'light' | 'dark' | 'system'", default: "'light'", required: "否", description: "主题模式" },
		{ property: "primaryColor", type: "string", default: "-", required: "否", description: "全局主色" },
		{ property: "density", type: "'loose' | 'normal' | 'compact'", default: "'normal'", required: "否", description: "UI 密度" },
		{ property: "defaults", type: "ComponentDefaults", default: "{}", required: "否", description: "各组件的默认属性覆盖" },
	]

	return (
		<div style={{ maxWidth: 1000, margin: "0 auto" }}>
			<Title level={2}>NewbieProvider</Title>
			<Paragraph>
				<Text code>NewbieProvider</Text> 是整个组件库的核心配置容器。它基于 Ant Design 的 <Text code>ConfigProvider</Text>
				进行封装， 提供了全局的主题切换、颜色配置、密度控制以及所有组件的默认属性（Default Props）统筹功能。
			</Paragraph>

			<Card title="全局配置能力" style={{ marginBottom: 24 }}>
				<Space direction="vertical" size="middle" style={{ width: "100%" }}>
					<div>
						<Text strong>1. 统一属性覆盖 (Default Props Override)</Text>
						<Paragraph type="secondary">
							允许在最顶层为特定组件设置全局默认值，例如让所有的 <Text code>NewbieUpload</Text> 默认使用同一个上传接口。
						</Paragraph>
					</div>
					<div>
						<Text strong>2. 样式适配 (UI Adapter)</Text>
						<Paragraph type="secondary">
							自动处理不同密度（Compact/Loose）下的间距、字体大小，并确保 Lucide 图标与 Antd 组件完美对齐。
						</Paragraph>
					</div>
				</Space>
			</Card>

			<Title level={3}>基本用法</Title>
			<Card styles={{ body: { padding: "12px", background: "#001529" } }}>
				<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
					{`import { NewbieProvider } from '@jobsys/newbie-next';

function App() {
  return (
    <NewbieProvider 
      themeMode="light" 
      density="normal"
      config={{
        defaults: {
          NewbieUpload: { action: '/api/v1/files/upload' }
        }
      }}
    >
      <MainLayout />
    </NewbieProvider>
  );
}`}
				</pre>
			</Card>

			<Divider />

			<Title level={3}>API 参考</Title>

			<Title level={4}>NewbieProvider Props</Title>
			<Table
				dataSource={providerData}
				pagination={false}
				rowKey="property"
				columns={[
					{ title: "属性", dataIndex: "property", key: "property", render: (text) => <Text code>{text}</Text> },
					{ title: "类型", dataIndex: "type", key: "type", render: (text) => <Text type="secondary">{text}</Text> },
					{ title: "默认值", dataIndex: "default", key: "default" },
					{ title: "必填", dataIndex: "required", key: "required" },
					{ title: "描述", dataIndex: "description", key: "description" },
				]}
				size="small"
				bordered
				style={{ marginBottom: 32 }}
			/>

			<Title level={4}>NewbieProviderConfig</Title>
			<Table
				dataSource={configData}
				pagination={false}
				rowKey="property"
				columns={[
					{ title: "属性", dataIndex: "property", key: "property", render: (text) => <Text code>{text}</Text> },
					{ title: "类型", dataIndex: "type", key: "type", render: (text) => <Text type="secondary">{text}</Text> },
					{ title: "默认值", dataIndex: "default", key: "default" },
					{ title: "必填", dataIndex: "required", key: "required" },
					{ title: "描述", dataIndex: "description", key: "description" },
				]}
				size="small"
				bordered
			/>
		</div>
	)
}

/**
 * Playground App
 *
 * Main application for component development and testing
 */

import React, { useState } from "react"
import { NewbieProvider } from "../../src/components/provider"
import { SearchDemo } from "./demos/search-demo"
import { TableDemo } from "./demos/table-demo"
import { IconDemo } from "./demos/icon-demo"
import { CaptchaDemo } from "./demos/captcha-demo"
import { Layout, Menu, Typography, Card, theme, Space, Segmented } from "antd"
import { Search, Table, Smile, ShieldCheck } from "lucide-react"

const { Header, Sider, Content } = Layout
const { Title } = Typography

export function App() {
	const [currentDemo, setCurrentDemo] = useState("search")
	const [themeMode, setThemeMode] = useState<"light" | "dark">("light")
	const [density, setDensity] = useState<"loose" | "normal" | "compact">("normal")

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	const menuItems = [
		{
			key: "search",
			icon: <Search size={16} />,
			label: "NewbieSearch",
		},
		{
			key: "table",
			icon: <Table size={16} />,
			label: "ProTable + Search",
		},
		{
			key: "icon",
			icon: <Smile size={16} />,
			label: "NewbieIcon",
		},
		{
			key: "captcha",
			icon: <ShieldCheck size={16} />,
			label: "SlideVerify",
		},
	]

	const renderDemo = () => {
		switch (currentDemo) {
			case "search":
				return <SearchDemo />
			case "table":
				return <TableDemo />
			case "icon":
				return <IconDemo />
			case "captcha":
				return <CaptchaDemo />
			default:
				return <div>Select a demo</div>
		}
	}

	return (
		<NewbieProvider
			themeMode={themeMode}
			density={density}
			config={{
				locale: "zh_CN",
				defaults: {
					NewbieForm: {
						layout: "vertical",
					},
				},
			}}
		>
			<Layout style={{ minHeight: "100vh" }}>
				<Header
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						background: themeMode === "light" ? "#fff" : "#001529",
						borderBottom: "1px solid #f0f0f0",
						padding: "0 24px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<div
							style={{
								width: "32px",
								height: "32px",
								background: "#1890ff",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#fff",
								fontWeight: "bold",
							}}
						>
							N
						</div>
						<Title level={4} style={{ margin: 0, color: themeMode === "light" ? "inherit" : "#fff" }}>
							Newbie Next Playground
						</Title>
					</div>

					<Space size="middle">
						<Segmented
							options={[
								{ label: "Light", value: "light" },
								{ label: "Dark", value: "dark" },
							]}
							value={themeMode}
							onChange={(v) => setThemeMode(v as any)}
						/>
						<Segmented
							options={[
								{ label: "宽松", value: "loose" },
								{ label: "正常", value: "normal" },
								{ label: "紧凑", value: "compact" },
							]}
							value={density}
							onChange={(v) => setDensity(v as any)}
						/>
					</Space>
				</Header>
				<Layout>
					<Sider width={200} style={{ background: colorBgContainer }}>
						<Menu
							mode="inline"
							selectedKeys={[currentDemo]}
							style={{ height: "100%", borderRight: 0 }}
							items={menuItems}
							onClick={({ key }) => setCurrentDemo(key)}
						/>
					</Sider>
					<Layout style={{ padding: "24px" }}>
						<Content
							style={{
								padding: 24,
								margin: 0,
								minHeight: 280,
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
								overflow: "auto",
							}}
						>
							{renderDemo()}
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</NewbieProvider>
	)
}

/**
 * Playground App
 *
 * Main application for component development and testing
 */

import React, { useState } from "react"
import { NewbieProvider } from "../../src/components/provider"
import { SearchDemo } from "./demos/search-demo"
import { Layout, Menu, Typography, Card, theme } from "antd"
import { Search } from "lucide-react"

const { Header, Sider, Content } = Layout
const { Title } = Typography

export function App() {
	const [currentDemo, setCurrentDemo] = useState("search")
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken()

	const menuItems = [
		{
			key: "search",
			icon: <Search size={16} />,
			label: "NewbieSearch",
		},
	]

	const renderDemo = () => {
		switch (currentDemo) {
			case "search":
				return <SearchDemo />
			default:
				return <div>Select a demo</div>
		}
	}

	return (
		<NewbieProvider
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
				<Header style={{ display: "flex", alignItems: "center", background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px" }}>
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
						<Title level={4} style={{ margin: 0 }}>
							Newbie Next Playground
						</Title>
					</div>
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

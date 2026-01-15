/**
 * Playground App
 *
 * Main application for component development and testing
 */

import React, { useState } from "react"
import { NewbieProvider } from "../../src/components/provider"

import { SearchDemo } from "./demos/search-demo"
import { TableDemo } from "./demos/table-demo"
import { UploadDemo } from "./demos/upload-demo"
import { IconDemo } from "./demos/icon-demo"
import { CaptchaDemo } from "./demos/captcha-demo"
import { ProviderDemo } from "./demos/provider-demo"
import { HooksDemo } from "./demos/hooks-demo"
import { StyleProvider } from "@ant-design/cssinjs"
import { ProConfigProvider } from "@ant-design/pro-components"
import { ConfigProvider, App as AntApp, theme as antdTheme, Layout, Menu, Typography, theme, Space, Segmented, type MenuProps } from "antd"
import zhCN from "antd/locale/zh_CN"
import { Search, Table, Smile, ShieldCheck, CloudUpload, Settings as SettingsIcon, Webhook } from "lucide-react"

const { Header, Sider, Content } = Layout
const { Title } = Typography

interface PlaygroundLayoutProps {
	themeMode: "light" | "dark"
	setThemeMode: (mode: "light" | "dark") => void
	density: "loose" | "normal" | "compact"
	setDensity: (density: "loose" | "normal" | "compact") => void
}

function PlaygroundLayout({ themeMode, setThemeMode, density, setDensity }: PlaygroundLayoutProps) {
	const [currentDemo, setCurrentDemo] = useState("search")

	const {
		token: { colorBgContainer, borderRadiusLG, colorBorderSecondary, colorText, colorPrimary, colorWhite },
	} = theme.useToken()

	const menuItems: MenuProps["items"] = [
		{
			key: "provider",
			icon: <SettingsIcon size={16} />,
			label: "NewbieProvider",
		},
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
		{
			key: "upload",
			icon: <CloudUpload size={16} />,
			label: "NewbieUpload",
		},
		{
			type: "divider",
		},
		{
			key: "hooks",
			icon: <Webhook size={16} />,
			label: "Hooks",
		},
	]

	const renderDemo = () => {
		switch (currentDemo) {
			case "provider":
				return <ProviderDemo />
			case "hooks":
				return <HooksDemo />
			case "search":
				return <SearchDemo />
			case "table":
				return <TableDemo />
			case "icon":
				return <IconDemo />
			case "captcha":
				return <CaptchaDemo />
			case "upload":
				return <UploadDemo />
			default:
				return <div>Select a demo</div>
		}
	}

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					background: colorBgContainer,
					borderBottom: `1px solid ${colorBorderSecondary}`,
					padding: "0 24px",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<div
						style={{
							width: "32px",
							height: "32px",
							background: colorPrimary,
							borderRadius: "8px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: colorWhite,
							fontWeight: "bold",
						}}
					>
						N
					</div>
					<Title level={4} style={{ margin: 0, color: colorText }}>
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
	)
}

export function App() {
	const [themeMode, setThemeMode] = useState<"light" | "dark">("light")
	const [density, setDensity] = useState<"loose" | "normal" | "compact">("normal")

	const isDark = themeMode === "dark"

	// Construct Ant Design Theme Config
	const antdThemeConfig = React.useMemo(() => {
		const themeConfig = {
			algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
			token: {} as Record<string, any>,
		}

		// Density translation
		if (density === "compact") {
			themeConfig.token.controlHeight = 30
			themeConfig.token.fontSize = 13
			themeConfig.token.padding = 12
		} else if (density === "loose") {
			themeConfig.token.controlHeight = 34
			themeConfig.token.fontSize = 14
			themeConfig.token.padding = 16
		}

		return themeConfig
	}, [isDark, density])

	const componentSize = density === "compact" ? "small" : density === "loose" ? "large" : "middle"

	return (
		<StyleProvider hashPriority="high">
			<ConfigProvider locale={zhCN} theme={antdThemeConfig} componentSize={componentSize}>
				<ProConfigProvider dark={isDark} token={{ ...antdThemeConfig.token }}>
					<AntApp>
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
							<PlaygroundLayout themeMode={themeMode} setThemeMode={setThemeMode} density={density} setDensity={setDensity} />
						</NewbieProvider>
					</AntApp>
				</ProConfigProvider>
			</ConfigProvider>
		</StyleProvider>
	)
}

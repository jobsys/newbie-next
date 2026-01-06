import React from "react"
import { Typography, Card, Table, Tag, Alert, Divider } from "antd"
import { useRegexRule, useHttp } from "../../../src/index"

const { Title, Paragraph, Text } = Typography

export function HooksDemo() {
	// Example usage of hooks (just for type checking, not actual execution in doc render)
	const { pattern: emailPattern } = useRegexRule("email")
	const http = useHttp()

	const regexColumns = [
		{
			title: "类型",
			dataIndex: "type",
			key: "type",
			render: (text: string) => <Tag color="blue">{text}</Tag>,
		},
		{
			title: "说明",
			dataIndex: "desc",
			key: "desc",
		},
		{
			title: "示例",
			dataIndex: "example",
			key: "example",
			render: (text: string) => <Text code>{text}</Text>,
		},
	]

	const regexData = [
		{ type: "email", desc: "邮箱", example: 'useRegexRule("email")' },
		{ type: "phone", desc: "手机号 (支持 strict 模式)", example: 'useRegexRule("phone", { mode: "strict" })' },
		{ type: "ID / id", desc: "身份证 (中国 v1/v2, 港澳台)", example: 'useRegexRule("ID", { version: "v2" })' },
		{ type: "password", desc: "密码强度校验", example: 'useRegexRule("password")' },
		{ type: "url", desc: "URL 链接 (支持 image/video 模式)", example: 'useRegexRule("url")' },
		{ type: "ip", desc: "IP 地址 (v4/v6)", example: 'useRegexRule("ip")' },
	]

	const CodeBlock = ({ children }: { children: string }) => (
		<pre
			style={{
				background: "#1e1e1e",
				color: "#d4d4d4",
				padding: "16px",
				borderRadius: "8px",
				overflowX: "auto",
				fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
			}}
		>
			<code>{children}</code>
		</pre>
	)

	return (
		<div style={{ maxWidth: 1200, margin: "0 auto" }}>
			<Title level={2}>Hooks</Title>
			<Paragraph>Newbie Next 提供了一组常用的 React Hooks，用于简化开发流程。</Paragraph>

			<Divider />

			<section id="use-http">
				<Title level={3}>useHttp</Title>
				<Paragraph>基于 axios 封装的 HTTP 请求 Hook，提供统一的请求状态管理。</Paragraph>

				<Card title="基本用法" style={{ marginBottom: 24 }}>
					<CodeBlock>
						{`import { useHttp } from "jobsys-newbie-next"

export function MyComponent() {
  const { data, loading, error, get, post } = useHttp()

  const fetchData = async () => {
    try {
      const res = await get("/api/user")
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button loading={loading} onClick={fetchData}>
      Fetch Data
    </Button>
  )
}`}
					</CodeBlock>
				</Card>

				<Title level={4}>API</Title>
				<Paragraph>
					<Text strong>参数：</Text>
					<ul>
						<li>
							<Text code>http</Text> (可选): 自定义的 <Text code>HttpInstance</Text>，默认为全局配置的实例。
						</li>
					</ul>
				</Paragraph>
				<Paragraph>
					<Text strong>返回值：</Text>
					<ul>
						<li>
							<Text code>data</Text>: 请求成功返回的数据
						</li>
						<li>
							<Text code>loading</Text>: boolean，是否正在请求中
						</li>
						<li>
							<Text code>error</Text>: 请求失败的错误对象
						</li>
						<li>
							<Text code>get(url, config)</Text>: 发起 GET 请求
						</li>
						<li>
							<Text code>post(url, data, config)</Text>: 发起 POST 请求
						</li>
						<li>
							<Text code>put(url, data, config)</Text>: 发起 PUT 请求
						</li>
						<li>
							<Text code>delete(url, config)</Text>: 发起 DELETE 请求
						</li>
					</ul>
				</Paragraph>
			</section>

			<Divider />

			<section id="use-regex-rule">
				<Title level={3}>useRegexRule</Title>
				<Paragraph>提供常用的正则表达式校验规则，可直接用于 Ant Design Form 的 rules 属性中。</Paragraph>

				<Alert
					message="提示"
					description="useRegexRule 返回的是 { pattern, message } 对象，可以直接作为 Rule 对象的一员，或者解构使用。"
					type="info"
					showIcon
					style={{ marginBottom: 24 }}
				/>

				<Card title="基本用法" style={{ marginBottom: 24 }}>
					<CodeBlock>
						{`import { useRegexRule } from "jobsys-newbie-next"
import { ProFormText } from "@ant-design/pro-components"

// 在 ProForm 中使用
<ProFormText
  name="email"
  label="邮箱"
  rules={[
    { required: true, message: "请输入邮箱" },
    useRegexRule("email"), // 自动包含 pattern 和默认 message
  ]}
/>

<ProFormText
  name="phone"
  label="手机号"
  rules={[
    useRegexRule("phone", { mode: "strict" }),
  ]}
/>`}
					</CodeBlock>
				</Card>

				<Title level={4}>支持的规则类型</Title>
				<Table dataSource={regexData} columns={regexColumns} pagination={false} size="small" bordered />

				<Paragraph style={{ marginTop: 20 }}>
					<Text type="secondary">
						支持的完整类型列表：email, phone, tel, ID, passport, credit-code, bank, stock, url, md5, base64, currency, chinese, name,
						decimal, number, date, time, car, version, ip, qq, wechat, alpha-numeric, username, password, zip, mac.
					</Text>
				</Paragraph>
			</section>
		</div>
	)
}

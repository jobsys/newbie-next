import React, { useState } from "react"
import { Typography, Card, Space, Divider, Form, Button } from "antd"
import { NewbieUpload, ProFormNewbieUpload } from "../../../src/index"
import { ProForm, ProFormText } from "@ant-design/pro-components"

const { Title, Paragraph, Text } = Typography

/**
 * Upload Demo Component
 * contains:
 * 1. Basic Usage
 * 2. With NewbieProvider Defaults
 * 3. ProForm Integration
 */
export const UploadDemo: React.FC = () => {
	const [basicId, setBasicId] = useState<string | number | null>(null)

	return (
		<div style={{ maxWidth: 800, margin: "0 auto" }}>
			<Title level={2}>NewbieUpload 上传组件</Title>
			<Paragraph>一个标准化的上传组件，集成了 NewbieProvider 架构，支持全局配置默认上传地址、最大文件大小等。</Paragraph>

			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				{/* Case 1: 基础用法 */}
				<Card title="1. 基础用法 (非受控)">
					<Paragraph>脱离表单的原始用法。直接传递 `action`, `onChange` 等属性，支持单文件上传和状态预览。</Paragraph>
					<NewbieUpload
						action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
						onChange={(val: string | number | (string | number)[] | null) => {
							setBasicId(val as any)
							console.log("上传成功:", val)
						}}
					/>
					<div style={{ marginTop: 16 }}>
						当前值: <Text code>{basicId || "null"}</Text>
					</div>
				</Card>

				{/* Case 2: 多文件上传 */}
				<Card title="2. 多文件上传">
					<Paragraph>
						开启 <Text code>multiple</Text> 属性以支持多文件。组件内部会维护文件列表状态。 你也可以通过 <Text code>maxCount</Text>{" "}
						限制文件选取的数量。
					</Paragraph>
					<NewbieUpload
						multiple
						maxCount={5}
						action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
						onChange={(ids) => {
							console.log("多文件上传 IDs:", ids)
						}}
					/>
					<Paragraph style={{ marginTop: 8 }} type="secondary">
						注：尝试逐个上传文件，可以观察到文件列表的动态增加。
					</Paragraph>
				</Card>

				{/* Case 3: ProForm 集成 */}
				<Card title="3. ProForm 表单集成 (ProFormNewbieUpload)">
					<Paragraph>
						在 Ant Design ProForm 中配合 <Text code>ProFormNewbieUpload</Text> 使用。 它支持完整的校验逻辑，并且可以快捷配置 `multiple`,
						`maxCount` 等常用项。
					</Paragraph>
					<ProForm
						onFinish={async (values) => {
							console.log("表单提交:", values)
							alert(JSON.stringify(values, null, 2))
						}}
					>
						<ProFormText name="name" label="用户名" required />
						<ProFormNewbieUpload
							name="avatar"
							label="头像"
							action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
							rules={[{ required: true, message: "请上传头像" }]}
						/>
						<ProFormNewbieUpload
							name="attachments"
							label="附件"
							multiple
							maxCount={3}
							action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
						/>
					</ProForm>
				</Card>

				<Divider />

				<Title level={3}>API 文档</Title>
				<Paragraph>
					<Text code>NewbieUpload</Text> 属性。
				</Paragraph>
				<Card styles={{ body: { padding: 0 } }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", textAlign: "left" }}>
								<th style={{ padding: "12px 16px" }}>属性</th>
								<th style={{ padding: "12px 16px" }}>类型</th>
								<th style={{ padding: "12px 16px" }}>默认值</th>
								<th style={{ padding: "12px 16px" }}>必填</th>
								<th style={{ padding: "12px 16px" }}>说明</th>
							</tr>
						</thead>
						<tbody>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>action</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">string</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>上传接口地址。支持通过 NewbieProvider 全局配置。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>multiple</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">boolean</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text code>false</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>是否支持多文件上传。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>maxCount</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">number</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>多选模式下允许的最大文件数量。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>maxSize</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">number</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text code>10</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>最大文件大小 (MB)。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>accept</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">string</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text code>"*"</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>接受的文件类型。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>value</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">MediaValue</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>当前媒体 ID 或 ID 数组。</td>
							</tr>
							<tr>
								<td style={{ padding: "12px 16px" }}>
									<Text code>onChange</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">{"(val) => void"}</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>值改变回调。返回媒体 ID 或 ID 数组。</td>
							</tr>
						</tbody>
					</table>
				</Card>
				<Title level={4} style={{ marginTop: 24 }}>
					ProFormNewbieUpload 属性
				</Title>
				<Paragraph>
					继承自 Ant Design <Text code>ProFormItem</Text>，并包含以下额外属性。
				</Paragraph>
				<Card styles={{ body: { padding: 0 } }}>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", textAlign: "left" }}>
								<th style={{ padding: "12px 16px" }}>属性</th>
								<th style={{ padding: "12px 16px" }}>类型</th>
								<th style={{ padding: "12px 16px" }}>默认值</th>
								<th style={{ padding: "12px 16px" }}>必填</th>
								<th style={{ padding: "12px 16px" }}>说明</th>
							</tr>
						</thead>
						<tbody>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>name</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">string</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>是</td>
								<td style={{ padding: "12px 16px" }}>表单字段名。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>label</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">string</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>标签文字。</td>
							</tr>
							<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
								<td style={{ padding: "12px 16px" }}>
									<Text code>fieldProps</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">NewbieUploadProps</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>-</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>透传给内部 NewbieUpload 的属性。</td>
							</tr>
							<tr>
								<td style={{ padding: "12px 16px" }}>
									<Text code>multiple</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text type="secondary">boolean</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>
									<Text code>false</Text>
								</td>
								<td style={{ padding: "12px 16px" }}>否</td>
								<td style={{ padding: "12px 16px" }}>是否支持多文件（快捷入口）。</td>
							</tr>
						</tbody>
					</table>
				</Card>
			</Space>
		</div>
	)
}

/**
 * Playground App
 *
 * Main application for component development and testing
 */

import React, { useState } from "react"
import { NewbieProvider } from "../../src/components/provider"
import { NewbieSearch } from "../../src/components/search"
import type { SearchFieldConfig, QueryForm } from "../../src/components/search"
import { Card, Typography, Space, Divider } from "antd"

const { Title, Paragraph, Text } = Typography

export function App() {
	const [searchResult, setSearchResult] = useState<QueryForm | null>(null)

	const searchFields: SearchFieldConfig[] = [
		{ key: "name", type: "input", title: "姓名" },
		{ key: "age", type: "number", title: "年龄" },
		{
			key: "category",
			type: "select",
			title: "类别选择",
			expandable: "multiple",
			options: [
				{ label: "数码", value: "digital" },
				{ label: "家电", value: "appliance" },
				{ label: "食品", value: "food" },
				{ label: "衣服", value: "clothing" },
				{ label: "图书", value: "books" },
			],
		},
		{
			key: "status",
			type: "select",
			title: "状态",
			expandable: "single",
			options: [
				{ label: "在读", value: "studying" },
				{ label: "毕业", value: "graduated" },
				{ label: "休学", value: "suspended" },
				{ label: "退学", value: "dropped" },
			],
		},
		{
			key: "tags",
			type: "textarea",
			title: "标签",
		},
		{
			key: "region",
			type: "cascade",
			title: "地区",
			options: [
				{
					value: "zhejiang",
					label: "浙江",
					children: [
						{
							value: "hangzhou",
							label: "杭州",
							children: [
								{ value: "xihu", label: "西湖" },
								{ value: "xiasha", label: "下沙" },
							],
						},
						{
							value: "ningbo",
							label: "宁波",
							children: [
								{ value: "jiangbei", label: "江北" },
								{ value: "haishu", label: "海曙" },
							],
						},
					],
				},
				{
					value: "jiangsu",
					label: "江苏",
					children: [
						{
							value: "nanjing",
							label: "南京",
							children: [
								{ value: "xuanwu", label: "玄武" },
								{ value: "qinhuai", label: "秦淮" },
							],
						},
						{
							value: "suzhou",
							label: "苏州",
							children: [
								{ value: "gusu", label: "姑苏" },
								{ value: "wuzhong", label: "吴中" },
							],
						},
					],
				},
			],
		},
		{
			key: "birth_day",
			type: "date",
			title: "出生日期",
		},
	]

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
			<div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: "24px" }}>
					<Title level={2}>NewbieSearch 组件演示</Title>
					<Paragraph style={{ color: "#666" }}>支持多种字段类型和条件筛选的高级搜索组件</Paragraph>
				</div>

				<Card>
					<Space orientation="vertical" size="large" style={{ width: "100%" }}>
						<div>
							<Paragraph>
								<Text strong>字段类型：</Text> Input、Number、Select、Textarea、Cascade、Date
							</Paragraph>
							<Paragraph>
								<Text strong>Textarea：</Text> 支持多行输入，每行一个值，条件为"等于"或"不包含"
							</Paragraph>
							<Paragraph>
								<Text strong>Cascade：</Text> 支持级联选择，条件为"等于"、"不等于"或"包括子级"
							</Paragraph>
						</div>

						<Divider />

						<NewbieSearch
							fields={searchFields}
							onSubmit={(query) => {
								setSearchResult(query)
								console.log("Search query:", query)
							}}
						/>

						{searchResult && (
							<>
								<Divider />
								<div>
									<Title level={4}>查询结果</Title>
									<Card>
										<pre style={{ margin: 0, background: "#f5f5f5", padding: "16px", borderRadius: "4px", fontSize: "12px" }}>
											{JSON.stringify(searchResult, null, 2)}
										</pre>
									</Card>
								</div>
							</>
						)}
					</Space>
				</Card>
			</div>
		</NewbieProvider>
	)
}

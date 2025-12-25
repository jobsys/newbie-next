/**
 * Table Demo
 *
 * Demonstrates the integration of NewbieSearch with ProTable
 */

import React, { useState, useMemo } from "react"
import { ProTable } from "@ant-design/pro-components"
import { NewbieSearch } from "../../../src/components/search"
import type { NewbieProColumn, QueryForm, SortForm } from "../../../src/components/search"
import { Typography, Space, Card, Tag, Badge, Divider } from "antd"

const { Title, Paragraph, Text } = Typography

// Define the data type
interface UserItem {
	id: number
	name: string
	age: number
	email: string
	status: "active" | "inactive" | "suspended"
	role: "admin" | "user" | "guest"
	score: number
	created_at: string
}

// Mock data
const mockData: UserItem[] = [
	{
		id: 1,
		name: "张三",
		age: 25,
		email: "zhangsan@example.com",
		status: "active",
		role: "admin",
		score: 95,
		created_at: "2023-01-01 10:00:00",
	},
	{
		id: 2,
		name: "李四",
		age: 30,
		email: "lisi@example.com",
		status: "inactive",
		role: "user",
		score: 82,
		created_at: "2023-02-05 11:30:00",
	},
	{
		id: 3,
		name: "王五",
		age: 22,
		email: "wangwu@example.com",
		status: "active",
		role: "user",
		score: 88,
		created_at: "2023-03-10 09:15:00",
	},
	{
		id: 4,
		name: "赵六",
		age: 35,
		email: "zhaoliu@example.com",
		status: "suspended",
		role: "guest",
		score: 75,
		created_at: "2023-04-20 14:00:00",
	},
	{
		id: 5,
		name: "钱七",
		age: 28,
		email: "qianqi@example.com",
		status: "active",
		role: "user",
		score: 91,
		created_at: "2023-05-15 16:45:00",
	},
	{
		id: 6,
		name: "孙八",
		age: 40,
		email: "sunba@example.com",
		status: "inactive",
		role: "admin",
		score: 89,
		created_at: "2023-06-25 08:20:00",
	},
	{
		id: 7,
		name: "周九",
		age: 24,
		email: "zhoujiu@example.com",
		status: "active",
		role: "guest",
		score: 78,
		created_at: "2023-07-30 13:10:00",
	},
	{
		id: 8,
		name: "吴十",
		age: 32,
		email: "wushi@example.com",
		status: "suspended",
		role: "user",
		score: 85,
		created_at: "2023-08-05 17:00:00",
	},
	{
		id: 9,
		name: "郑十一",
		age: 27,
		email: "zheng11@example.com",
		status: "active",
		role: "user",
		score: 93,
		created_at: "2023-09-12 10:45:00",
	},
	{
		id: 10,
		name: "冯十二",
		age: 31,
		email: "feng12@example.com",
		status: "active",
		role: "admin",
		score: 97,
		created_at: "2023-10-18 15:20:00",
	},
]

export function TableDemo() {
	const [params, setParams] = useState<{ query: QueryForm; sort: SortForm }>({
		query: {},
		sort: [],
	})

	const columns: NewbieProColumn<UserItem>[] = [
		{
			title: "ID",
			dataIndex: "id",
			valueType: "digit",
			width: 80,
			search: false,
		},
		{
			title: "姓名",
			dataIndex: "name",
			valueType: "text",
			width: 120,
		},
		{
			title: "年龄",
			dataIndex: "age",
			valueType: "digit",
			width: 100,
			sorter: true,
		},
		{
			title: "邮箱",
			dataIndex: "email",
			valueType: "text",
			copyable: true,
			ellipsis: true,
		},
		{
			title: "角色",
			dataIndex: "role",
			valueType: "select",
			width: 120,
			valueEnum: {
				admin: { text: "管理员", color: "red" },
				user: { text: "普通用户", color: "blue" },
				guest: { text: "访客", color: "green" },
			},
			render: (_: any, record: UserItem) => {
				const colors: Record<string, string> = { admin: "red", user: "blue", guest: "green" }
				const labels: Record<string, string> = { admin: "管理员", user: "普通用户", guest: "访客" }
				return <Tag color={colors[record.role]}>{labels[record.role]}</Tag>
			},
		},
		{
			title: "得分",
			dataIndex: "score",
			valueType: "digit",
			width: 100,
			sorter: true,
		},
		{
			title: "状态",
			dataIndex: "status",
			valueType: "select",
			width: 120,
			valueEnum: {
				active: { text: "活跃", status: "Success" },
				inactive: { text: "禁用", status: "Error" },
				suspended: { text: "停用", status: "Default" },
			},
			fieldProps: {
				expandable: "single",
			},
		},
		{
			title: "创建时间",
			dataIndex: "created_at",
			valueType: "dateTime",
			width: 180,
			sorter: true,
		},
	]

	// Manual filtering and sorting for demonstration
	const filteredData = useMemo(() => {
		let result = [...mockData]

		// Apply query filters
		Object.entries(params.query).forEach(([key, field]) => {
			const { value, condition } = field
			if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === "") return

			result = result.filter((item) => {
				const itemValue = item[key as keyof UserItem]

				switch (condition) {
					case "equal":
						return itemValue == value
					case "notEqual":
						return itemValue != value
					case "include":
						return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					case "exclude":
						return !String(itemValue).toLowerCase().includes(String(value).toLowerCase())
					case "greaterThan":
						if (field.type === "digit" || field.type === "money") {
							return Number(itemValue) > Number(value)
						}
						return String(itemValue) > String(value)
					case "lessThan":
						if (field.type === "digit" || field.type === "money") {
							return Number(itemValue) < Number(value)
						}
						return String(itemValue) < String(value)
					case "greaterThanOrEqual":
						if (field.type === "digit" || field.type === "money") {
							return Number(itemValue) >= Number(value)
						}
						return String(itemValue) >= String(value)
					case "lessThanOrEqual":
						if (field.type === "digit" || field.type === "money") {
							return Number(itemValue) <= Number(value)
						}
						return String(itemValue) <= String(value)
					case "between":
						if (Array.isArray(value) && value.length === 2) {
							const [min, max] = value
							if (field.type === "digit" || field.type === "money") {
								return Number(itemValue) >= Number(min) && Number(itemValue) <= Number(max)
							}
							return String(itemValue) >= String(min) && String(itemValue) <= String(max)
						}
						return true
					case "in":
						if (Array.isArray(value)) {
							return value.includes(itemValue)
						}
						return itemValue == value
					case "notIn":
						if (Array.isArray(value)) {
							return !value.includes(itemValue)
						}
						return itemValue != value
					case "null":
						return itemValue === null || itemValue === undefined
					case "notNull":
						return itemValue !== null && itemValue !== undefined
					default:
						return true
				}
			})
		})

		// Apply sorting
		if (params.sort && params.sort.length > 0) {
			result.sort((a, b) => {
				for (const s of params.sort) {
					const aVal = a[s.key as keyof UserItem]
					const bVal = b[s.key as keyof UserItem]

					if (aVal === bVal) continue

					// Simple comparison
					const isAsc = s.order === "asc"
					if (aVal > bVal) return isAsc ? 1 : -1
					if (aVal < bVal) return isAsc ? -1 : 1
				}
				return 0
			})
		}

		return result
	}, [params])

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<Card bordered={false} bodyStyle={{ padding: "0 0 24px 0" }}>
				<Title level={3}>ProTable + NewbieSearch 联动演示</Title>
				<Paragraph>
					这是一个将 <Text strong>NewbieSearch</Text> 与 <Text strong>ProTable</Text> 结合使用的典型案例。 我们将 ProTable
					自带的搜索框关闭，使用 NewbieSearch 来提供更强大的高级搜索能力，包括多字段配置、复合条件筛选以及多维度排序。
				</Paragraph>
				<div>
					<Tag color="blue">高级筛选</Tag>
					<Tag color="green">多字段排序</Tag>
					<Tag color="orange">持久化支持</Tag>
					<Tag color="purple">响应式布局</Tag>
				</div>
			</Card>

			<NewbieSearch
				columns={columns}
				onSubmit={(query, sort) => {
					console.log("Submit query:", query)
					console.log("Submit sort:", sort)
					setParams({ query, sort })
				}}
			/>

			<Divider dashed style={{ margin: "12px 0" }} />

			<ProTable<UserItem>
				headerTitle={
					<Space>
						<span>用户列表</span>
						{filteredData.length < mockData.length && (
							<Badge count={`已过滤: ${filteredData.length} / ${mockData.length}`} style={{ backgroundColor: "#108ee9" }} />
						)}
					</Space>
				}
				columns={columns as any}
				dataSource={filteredData}
				search={false} // 关闭自带搜索
				rowKey="id"
				pagination={{
					pageSize: 5,
					showQuickJumper: true,
				}}
				toolBarRender={() => []}
				tableAlertRender={false}
				options={{
					density: true,
					fullScreen: true,
					reload: () => {
						setParams({ query: {}, sort: [] })
					},
					setting: {
						draggable: true,
						checkable: true,
					},
				}}
			/>
		</Space>
	)
}

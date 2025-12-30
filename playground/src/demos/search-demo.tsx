/**
 * NewbieSearch Demo
 */

import React, { useState } from "react"
import { NewbieSearch } from "../../../src/components/search"
import type { NewbieProColumn, QueryForm, SortForm } from "../../../src/components/search"
import { Card, Typography, Space, Divider, Button, InputNumber } from "antd"

const { Title, Paragraph, Text, Link } = Typography

export function SearchDemo() {
	const [searchResult, setSearchResult] = useState<{ query: QueryForm; sort: SortForm } | null>(null)

	const columns: NewbieProColumn[] = [
		{
			title: "姓名",
			dataIndex: "name",
			valueType: "text",
		},
		{
			title: "年龄",
			dataIndex: "age",
			valueType: "digit",
			sorter: true,
		},
		{
			title: "类别选择",
			dataIndex: "category",
			valueType: "select",
			fieldProps: {
				expandable: "multiple",
			},
			valueEnum: {
				digital: { text: "数码" },
				appliance: { text: "家电" },
				food: { text: "食品" },
				clothing: { text: "衣服" },
				books: { text: "图书" },
			},
		},
		{
			title: "状态",
			dataIndex: "status",
			valueType: "select",
			fieldProps: {
				expandable: "single",
			},
			valueEnum: {
				studying: { text: "在读" },
				graduated: { text: "毕业" },
				suspended: { text: "休学" },
				dropped: { text: "退学" },
			},
		},
		{
			title: "标签",
			dataIndex: "tags",
			valueType: "textarea",
		},
		{
			title: "地区",
			dataIndex: "region",
			valueType: "cascader",
			fieldProps: {
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
		},
		{
			title: "出生日期",
			dataIndex: "birth_day",
			valueType: "date",
			sorter: true,
			defaultSortOrder: "descend",
		},
		{
			title: "创建时间",
			dataIndex: "created_at",
			valueType: "dateTime",
			sorter: true,
			defaultSortOrder: "descend",
			hideInSearch: true,
		},
	]

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<div>
				<Title level={3}>NewbieSearch 组件演示</Title>
				<Paragraph style={{ color: "#666" }}>
					一个功能强大的高级搜索组件，支持多种字段类型、丰富的条件筛选、多字段排序以及搜索记录持久化。
				</Paragraph>
				<div>
					<Paragraph>
						<Text strong>核心功能：</Text>
					</Paragraph>
					<ul style={{ marginLeft: 20, marginTop: 8 }}>
						<li>
							<Text strong>条件筛选：</Text>支持等于、包含、大于、小于等多种条件类型
						</li>
						<li>
							<Text strong>多字段排序：</Text>支持添加多个排序规则，并可拖拽调整优先级
						</li>
						<li>
							<Text strong>搜索持久化：</Text>支持将搜索条件保存到 localStorage，刷新页面后自动恢复
						</li>
						<li>
							<Text strong>自定义渲染：</Text>支持完全自定义字段的渲染方式和显示逻辑
						</li>
						<li>
							<Text strong>响应式布局：</Text>自动适配不同屏幕尺寸，支持展开/收起更多筛选
						</li>
					</ul>
					<Paragraph style={{ marginTop: 12 }}>
						<Text strong>使用场景：</Text>数据表格筛选、列表搜索、报表查询、管理后台筛选等
					</Paragraph>
				</div>
			</div>

			<Divider />

			<NewbieSearch
				columns={columns}
				autoQuery={false}
				onSubmit={(query, sort) => {
					setSearchResult({ query, sort })
					console.log("Search query:", query)
					console.log("Sort config:", sort)
				}}
			/>

			{searchResult && (
				<>
					<Divider />
					<div>
						<Title level={4}>查询结果 (onSubmit Payload)</Title>
						<div style={{ display: "flex", gap: 16 }}>
							<Card title="Query (Object Format)" style={{ flex: 1 }}>
								<pre
									style={{
										margin: 0,
										background: "#f5f5f5",
										padding: "16px",
										borderRadius: "4px",
										fontSize: "12px",
										overflow: "auto",
									}}
								>
									{JSON.stringify(searchResult.query, null, 2)}
								</pre>
							</Card>
							<Card title="Sort Rules" style={{ flex: 1 }}>
								<pre
									style={{
										margin: 0,
										background: "#f5f5f5",
										padding: "16px",
										borderRadius: "4px",
										fontSize: "12px",
										overflow: "auto",
									}}
								>
									{JSON.stringify(searchResult.sort, null, 2)}
								</pre>
							</Card>
						</div>
					</div>
				</>
			)}

			<Divider />

			<div style={{ maxWidth: 1000, marginTop: 40 }}>
				<Title level={2}>API 文档</Title>

				<Title level={3}>NewbieSearch 属性</Title>
				<Paragraph>主组件的配置项，定义了搜索字段、排序规则以及提交行为。</Paragraph>
				<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
					<thead>
						<tr style={{ borderBottom: "1px solid #f0f0f0", textAlign: "left" }}>
							<th style={{ padding: "12px 8px" }}>属性</th>
							<th style={{ padding: "12px 8px" }}>类型</th>
							<th style={{ padding: "12px 8px" }}>描述</th>
						</tr>
					</thead>
					<tbody>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>columns</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">NewbieProColumn[]</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>表格列配置（Ant Design ProTable 风格）。包含搜索字段和排序规则的统一配置。</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>onSubmit</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">{"(query: QueryForm, sort: SortForm) => void"}</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>提交搜索时的回调</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>autoQuery</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">boolean</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>某些字段变化时是否自动触发 onSubmit (默认 false)</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>disableConditions</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">boolean</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>是否在全局禁用条件选择</td>
						</tr>
					</tbody>
				</table>

				<Title level={3}>NewbieProColumn (列配置)</Title>
				<Paragraph>
					继承自 ProTable 的 <Text code>ProColumns</Text>，扩展了 NewbieSearch 特有的配置。主要用于定义字段类型、显示名称、排序行为等。
				</Paragraph>
				<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
					<thead>
						<tr style={{ borderBottom: "1px solid #f0f0f0", textAlign: "left" }}>
							<th style={{ padding: "12px 8px" }}>属性</th>
							<th style={{ padding: "12px 8px" }}>类型</th>
							<th style={{ padding: "12px 8px" }}>必填</th>
							<th style={{ padding: "12px 8px" }}>描述</th>
						</tr>
					</thead>
					<tbody>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>title</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">string</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>✓</td>
							<td style={{ padding: "12px 8px" }}>字段选择器显示的名称</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>dataIndex / key</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">string | string[]</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>✓</td>
							<td style={{ padding: "12px 8px" }}>字段的唯一标识，在 QueryForm 中作为键名</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>valueType</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">'text' | 'digit' | 'select' | 'date' | 'dateTime' | 'cascader' | 'textarea'</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>字段类型，决定输入组件和默认筛选条件</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>valueEnum</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">Object</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>枚举配置，用于 select 类型自动生成选项</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>fieldProps</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">Object</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>
								组件原始属性，在此处可配置 NewbieSearch 特有项：
								<br />- <Text code>expandable</Text>: select 平铺显示
								<br />- <Text code>conditions</Text>: 自定义可用条件
								<br />- <Text code>disableConditions</Text>: 禁用条件选择
							</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>sorter</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">boolean</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>是否开启该字段的排序功能</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>defaultSortOrder</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">'ascend' | 'descend'</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>默认排序方向</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>request / params</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">Function / Object</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>配合 valueType="select" 实现远程数据加载和级联搜索</td>
						</tr>
					</tbody>
				</table>

				<Title level={4} style={{ marginTop: 24 }}>
					字段类型详解
				</Title>
				<Paragraph>不同字段类型支持不同的输入方式和条件：</Paragraph>
				<Card styles={{ body: { padding: "16px" } }}>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Text strong>input (文本输入)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用单行文本输入框</li>
								<li>支持条件：等于、不等于、包含、不包含、为空、不为空</li>
								<li>适用于：姓名、标题、描述等文本字段</li>
							</ul>
						</div>
						<div>
							<Text strong>number (数字输入)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用数字输入框，支持小数</li>
								<li>支持条件：等于、不等于、大于、小于、大于等于、小于等于、介于、为空、不为空</li>
								<li>适用于：年龄、价格、数量、评分等数值字段</li>
							</ul>
						</div>
						<div>
							<Text strong>date (日期选择)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用日期选择器，支持日期范围</li>
								<li>支持条件：等于、不等于、大于、小于、介于、为空、不为空</li>
								<li>适用于：创建时间、生日、截止日期等日期字段</li>
							</ul>
						</div>
						<div>
							<Text strong>select (下拉选择)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用下拉选择框，支持单选和多选</li>
								<li>支持条件：等于、不等于、包含任一、不包含任一、为空、不为空</li>
								<li>支持 expandable 属性，可平铺展示选项（适合选项较少的情况）</li>
								<li>适用于：状态、类别、标签等枚举字段</li>
							</ul>
						</div>
						<div>
							<Text strong>cascade (级联选择)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用级联选择器，支持多级联动</li>
								<li>支持条件：等于、不等于、包括子级</li>
								<li>需要提供嵌套的 options 结构（包含 children）</li>
								<li>适用于：省市区、分类层级等有层级关系的字段</li>
							</ul>
						</div>
						<div>
							<Text strong>textarea (多行文本)</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>使用多行文本输入框</li>
								<li>支持条件：等于、不包含</li>
								<li>适用于：备注、详细描述等长文本字段</li>
							</ul>
						</div>
					</Space>
				</Card>

				<Title level={3}>提交数据结构 (onSubmit Payload)</Title>
				<Paragraph>
					<Text code>onSubmit</Text> 回调会接收两个参数：<Text code>query</Text> 和 <Text code>sort</Text>，分别表示搜索条件和排序规则。
				</Paragraph>

				<Title level={4}>QueryForm 结构</Title>
				<Paragraph>
					<Text code>query</Text> 是一个对象，键为字段的 <Text code>key</Text>，值包含搜索值、条件和类型：
				</Paragraph>
				<Card styles={{ body: { padding: "16px", background: "#fafafa" } }}>
					<pre style={{ margin: 0, fontSize: "13px" }}>
						{`{
  [fieldKey: string]: {
    value: any,           // 搜索值
    condition: string,    // 搜索条件 (equal, include, between...)
    type: string         // 字段类型 (input, number, date...)
  }
}

// 示例：
{
  "name": {
    "value": "张三",
    "condition": "include",
    "type": "input"
  },
  "age": {
    "value": 25,
    "condition": "greaterThan",
    "type": "number"
  }
}`}
					</pre>
				</Card>

				<Title level={4} style={{ marginTop: 24 }}>
					SortForm 结构
				</Title>
				<Paragraph>
					<Text code>sort</Text> 是一个数组，包含多个排序规则，按优先级排序：
				</Paragraph>
				<Card styles={{ body: { padding: "16px", background: "#fafafa" } }}>
					<pre style={{ margin: 0, fontSize: "13px" }}>
						{`Array<{
  key: string,      // 排序字段
  order: 'asc' | 'desc'  // 排序方向
}>

// 示例：
[
  { "key": "created_at", "order": "desc" },
  { "key": "age", "order": "asc" }
]`}
					</pre>
				</Card>

				<Title level={3} style={{ marginTop: 32 }}>
					SortFieldConfig (排序字段配置)
				</Title>
				<Paragraph>定义可用的排序字段。用户可以通过"排序"按钮添加多个排序规则，并拖拽调整优先级。</Paragraph>
				<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
					<thead>
						<tr style={{ borderBottom: "1px solid #f0f0f0", textAlign: "left" }}>
							<th style={{ padding: "12px 8px" }}>属性</th>
							<th style={{ padding: "12px 8px" }}>类型</th>
							<th style={{ padding: "12px 8px" }}>必填</th>
							<th style={{ padding: "12px 8px" }}>描述</th>
						</tr>
					</thead>
					<tbody>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>key</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">string</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>✓</td>
							<td style={{ padding: "12px 8px" }}>排序字段的唯一标识，对应数据字段名</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>title</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">string</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>✓</td>
							<td style={{ padding: "12px 8px" }}>排序字段的显示名称</td>
						</tr>
						<tr style={{ borderBottom: "1px solid #f0f0f0" }}>
							<td style={{ padding: "12px 8px" }}>
								<Text code>direction</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>
								<Text type="secondary">'asc' | 'desc'</Text>
							</td>
							<td style={{ padding: "12px 8px" }}>-</td>
							<td style={{ padding: "12px 8px" }}>默认排序方向，不设置时默认为 'asc'（升序）</td>
						</tr>
					</tbody>
				</table>
				<Paragraph style={{ color: "#666" }}>
					💡{" "}
					<Text type="secondary">提示：排序规则按添加顺序排列，可以通过拖拽调整优先级。在 SortForm 中，数组的第一个元素优先级最高。</Text>
				</Paragraph>

				<Divider />

				<Title level={3}>进阶用法：自定义渲染 (Custom Render)</Title>
				<Paragraph>
					如果内置的输入组件无法满足需求，可以通过 <Text code>render</Text> 属性完全自定义弹层中的内容。
				</Paragraph>

				<Title level={4}>1. render 函数</Title>
				<Paragraph>允许你渲染任意 React 节点，并提供了工具方法来更新搜索状态：</Paragraph>
				<Card styles={{ body: { padding: "16px", background: "#001529" } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`render: ({ updateFieldValue, getFieldValue, close }) => {
  return (
    <Space>
      <Button onClick={() => updateFieldValue('key', 'value', 'equal')}>
        设置值
      </Button>
      <Button onClick={close}>关闭</Button>
    </Space>
  )
}`}
					</pre>
				</Card>
				<Paragraph style={{ marginTop: 12 }}>
					<Text strong>参数说明：</Text>
				</Paragraph>
				<ul style={{ marginLeft: 20 }}>
					<li>
						<Text code>updateFieldValue(key, value, condition?, type?)</Text> - 更新指定字段的值
					</li>
					<li>
						<Text code>getFieldValue(key)</Text> - 获取指定字段的当前值
					</li>
					<li>
						<Text code>close()</Text> - 关闭弹层
					</li>
				</ul>

				<Title level={4} style={{ marginTop: 24 }}>
					2. getDisplayValue 函数
				</Title>
				<Paragraph>
					当你在 <Text code>render</Text> 中更新了多个字段或者使用了复杂数据结构时，可以使用 <Text code>getDisplayValue</Text>{" "}
					来自定义搜索项标签中显示的文字。
				</Paragraph>
				<Card styles={{ body: { padding: "16px", background: "#001529" } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`getDisplayValue: (getFieldValue) => {
  const min = getFieldValue('min_price')?.value;
  const max = getFieldValue('max_price')?.value;
  if (min && max) return \`\${min} - \${max}\`;
  if (min) return \`≥ \${min}\`;
  if (max) return \`≤ \${max}\`;
  return '';
}`}
					</pre>
				</Card>
				<Paragraph style={{ marginTop: 12 }}>
					<Text strong>使用场景：</Text>
				</Paragraph>
				<ul style={{ marginLeft: 20 }}>
					<li>自定义字段更新了多个内部字段（如价格范围使用了 min_price 和 max_price）</li>
					<li>需要格式化显示值（如日期格式化、数值格式化）</li>
					<li>需要显示友好的文本而不是原始值（如显示"已选择 3 项"而不是选项值数组）</li>
				</ul>
				<Paragraph style={{ marginTop: 12, color: "#666" }}>
					💡{" "}
					<Text type="secondary">
						提示：上面的价格范围示例可以在本页面的演示中找到。如果不提供 getDisplayValue，组件会尝试自动格式化显示值。
					</Text>
				</Paragraph>

				<Divider />

				<Title level={3}>使用示例</Title>
				<Paragraph>以下是一些常见的使用场景和代码示例：</Paragraph>

				<Title level={4}>基础用法</Title>
				<Card styles={{ body: { padding: "16px", background: "#001529", marginBottom: 16 } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`import { NewbieSearch } from '@newbie/next'

function MyComponent() {
  const queryFields = [
    { key: 'name', type: 'input', title: '姓名' },
    { key: 'age', type: 'number', title: '年龄' },
    { 
      key: 'status', 
      type: 'select', 
      title: '状态',
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  ]

  return (
    <NewbieSearch
      queryFields={queryFields}
      onSubmit={(query, sort) => {
        console.log('查询条件:', query)
        console.log('排序规则:', sort)
        // 发送请求到后端
      }}
    />
  )
}`}
					</pre>
				</Card>

				<Title level={4}>启用搜索持久化</Title>
				<Card styles={{ body: { padding: "16px", background: "#001529", marginBottom: 16 } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`<NewbieSearch
  queryFields={queryFields}
  persistence="my-search-key"  // 使用自定义 key
  // 或 persistence={true}      // 使用默认 key
  onSubmit={(query, sort) => {
    // 处理搜索
  }}
/>`}
					</pre>
				</Card>
				<Paragraph style={{ color: "#666" }}>
					💡{" "}
					<Text type="secondary">
						启用持久化后，搜索条件会自动保存到 localStorage，刷新页面后会自动恢复。适合需要保持用户搜索状态的场景。
					</Text>
				</Paragraph>

				<Title level={4}>自定义字段条件</Title>
				<Card styles={{ body: { padding: "16px", background: "#001529", marginBottom: 16 } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`const queryFields = [
  {
    key: 'name',
    type: 'input',
    title: '姓名',
    conditions: ['equal', 'include'],  // 只允许"等于"和"包含"
    defaultCondition: 'include'        // 默认使用"包含"
  },
  {
    key: 'age',
    type: 'number',
    title: '年龄',
    conditions: ['greaterThan', 'lessThan', 'between'],  // 只允许比较条件
    disableConditions: true  // 禁用条件选择，始终使用默认条件
  }
]`}
					</pre>
				</Card>

				<Title level={4}>平铺展示选项（expandable）</Title>
				<Card styles={{ body: { padding: "16px", background: "#001529", marginBottom: 16 } }}>
					<pre style={{ margin: 0, color: "#fff", fontSize: "13px" }}>
						{`const queryFields = [
  {
    key: 'category',
    type: 'select',
    title: '类别',
    expandable: 'multiple',  // 平铺展示，支持多选
    options: [
      { label: '数码', value: 'digital' },
      { label: '家电', value: 'appliance' },
      { label: '食品', value: 'food' }
    ]
  },
  {
    key: 'status',
    type: 'select',
    title: '状态',
    expandable: 'single',  // 平铺展示，仅单选
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]`}
					</pre>
				</Card>
				<Paragraph style={{ color: "#666" }}>
					💡{" "}
					<Text type="secondary">
						expandable 适合选项较少的场景（通常少于 10 个），可以提供更好的用户体验，用户无需打开下拉框即可看到所有选项。
					</Text>
				</Paragraph>

				<Divider />

				<Title level={3}>搜索条件 (SearchCondition)</Title>
				<Paragraph>
					组件支持多种搜索条件，不同字段类型默认支持的条件不同。你也可以通过 <Text code>conditions</Text> 属性自定义某个字段可用的条件。
				</Paragraph>
				<Card styles={{ body: { padding: "16px", marginBottom: 24 } }}>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Text strong>文本条件：</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									<Text code>equal</Text> - 等于：完全匹配文本内容
								</li>
								<li>
									<Text code>notEqual</Text> - 不等于：排除完全匹配的内容
								</li>
								<li>
									<Text code>include</Text> - 包含：文本中包含指定内容（模糊匹配）
								</li>
								<li>
									<Text code>exclude</Text> - 不包含：文本中不包含指定内容
								</li>
								<li>
									<Text code>null</Text> - 为空：字段值为空或 null
								</li>
								<li>
									<Text code>notNull</Text> - 不为空：字段值不为空
								</li>
							</ul>
						</div>
						<div>
							<Text strong>数值/日期条件：</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									<Text code>equal</Text> - 等于：精确匹配数值或日期
								</li>
								<li>
									<Text code>notEqual</Text> - 不等于：排除精确匹配的值
								</li>
								<li>
									<Text code>greaterThan</Text> - 大于：值大于指定值
								</li>
								<li>
									<Text code>lessThan</Text> - 小于：值小于指定值
								</li>
								<li>
									<Text code>greaterThanOrEqual</Text> - 大于等于：值大于或等于指定值
								</li>
								<li>
									<Text code>lessThanOrEqual</Text> - 小于等于：值小于或等于指定值
								</li>
								<li>
									<Text code>between</Text> - 介于：值在指定范围内（需要两个值）
								</li>
								<li>
									<Text code>null</Text> - 为空：字段值为空或 null
								</li>
								<li>
									<Text code>notNull</Text> - 不为空：字段值不为空
								</li>
							</ul>
						</div>
						<div>
							<Text strong>选择条件：</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									<Text code>equal</Text> - 等于：值等于指定选项
								</li>
								<li>
									<Text code>notEqual</Text> - 不等于：值不等于指定选项
								</li>
								<li>
									<Text code>in</Text> - 包含任一：值在指定选项列表中（多选）
								</li>
								<li>
									<Text code>notIn</Text> - 不包含任一：值不在指定选项列表中
								</li>
								<li>
									<Text code>null</Text> - 为空：字段值为空或 null
								</li>
								<li>
									<Text code>notNull</Text> - 不为空：字段值不为空
								</li>
							</ul>
						</div>
						<div>
							<Text strong>级联条件：</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									<Text code>equal</Text> - 等于：精确匹配级联路径
								</li>
								<li>
									<Text code>notEqual</Text> - 不等于：排除精确匹配的路径
								</li>
								<li>
									<Text code>include</Text> - 包括子级：匹配指定路径及其所有子级路径
								</li>
							</ul>
						</div>
					</Space>
				</Card>

				<Divider />

				<Title level={3}>最佳实践</Title>
				<Card bodyStyle={{ padding: "16px" }}>
					<Space direction="vertical" size="middle" style={{ width: "100%" }}>
						<div>
							<Text strong>1. 字段顺序规划</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									将最常用的字段放在前面，使用 <Text code>order</Text> 属性控制顺序
								</li>
								<li>将 expandable 的 select 字段放在顶部，它们会独占一行显示</li>
								<li>将不常用的字段放在后面，利用"更多筛选"功能收起</li>
							</ul>
						</div>
						<div>
							<Text strong>2. 条件选择</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									对于文本搜索，通常使用 <Text code>include</Text>（包含）条件更符合用户习惯
								</li>
								<li>
									对于精确匹配的字段（如 ID、编码），使用 <Text code>equal</Text>（等于）条件
								</li>
								<li>
									对于数值范围查询，使用 <Text code>between</Text>（介于）或组合使用 <Text code>greaterThanOrEqual</Text> 和{" "}
									<Text code>lessThanOrEqual</Text>
								</li>
							</ul>
						</div>
						<div>
							<Text strong>3. 自定义渲染</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									当内置组件无法满足需求时，使用 <Text code>render</Text> 自定义
								</li>
								<li>
									记得同时提供 <Text code>getDisplayValue</Text> 来显示友好的标签文字
								</li>
								<li>
									在自定义渲染中，可以使用 <Text code>updateFieldValue</Text> 更新多个字段（如价格范围）
								</li>
							</ul>
						</div>
						<div>
							<Text strong>4. 性能优化</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>如果选项数据量大（超过 100 项），避免使用 expandable，使用下拉选择更合适</li>
								<li>对于级联选择，确保数据结构正确，避免过深的嵌套（建议不超过 3 级）</li>
								<li>
									启用 <Text code>autoQuery</Text> 时要谨慎，避免频繁触发请求
								</li>
							</ul>
						</div>
						<div>
							<Text strong>5. 用户体验</Text>
							<ul style={{ marginLeft: 20, marginTop: 8 }}>
								<li>
									为字段提供清晰的 <Text code>title</Text>，让用户理解字段含义
								</li>
								<li>为 select 和 cascade 类型提供完整的选项列表</li>
								<li>
									在 <Text code>onSubmit</Text> 中处理加载状态和错误提示
								</li>
								<li>
									考虑启用 <Text code>persistence</Text> 来保存用户的搜索习惯
								</li>
							</ul>
						</div>
					</Space>
				</Card>
			</div>
		</Space>
	)
}

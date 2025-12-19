/**
 * NewbieSearch Component
 *
 * Advanced search component with condition filtering, sorting, and persistence
 *
 * @example
 * ```tsx
 * <NewbieSearch
 *   fields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   onSubmit={(query) => console.log(query)}
 * />
 * ```
 */

import { useState } from "react"
import { Button, Space, Tag } from "antd"
import { Search, RotateCw, ChevronDown, ChevronUp, XCircle } from "lucide-react"
import { SearchProvider } from "./context/search-provider"
import { useSearchContext } from "./context/search-context"
import { SearchItem } from "./components/search-item"
import { getConditionLabel } from "./utils/conditions"
import type { NewbieSearchProps } from "./types"

/**
 * SearchFields Component
 *
 * Internal component that renders search fields
 */
function SearchFields(): JSX.Element {
	const { fields, submit, resetAll, resetFieldValue, isFieldValueValid, hasSubmitted, submittedQueryForm } = useSearchContext()
	const [expanded, setExpanded] = useState(false)

	// Split fields into expandable and standard
	const expandableFields = fields.filter((f) => f.type === "select" && f.expandable)
	const standardFields = fields.filter((f) => !(f.type === "select" && f.expandable))

	// Get active search conditions from submitted query form snapshot
	const activeConditions = fields
		.map((field) => {
			const fieldValue = submittedQueryForm[field.key]
			if (!fieldValue) return null

			// For null/notNull conditions, they are always valid regardless of value
			const isValid = fieldValue.condition === "null" || fieldValue.condition === "notNull" ? true : isFieldValueValid(field.key, fieldValue)

			if (!isValid) return null

			const conditionLabel = getConditionLabel(fieldValue.condition, field.type)

			// For null/notNull conditions, don't show value
			if (fieldValue.condition === "null" || fieldValue.condition === "notNull") {
				return {
					key: field.key,
					label: `${field.title}${conditionLabel}`,
					field,
				}
			}

			// Format value display
			let valueDisplay = ""
			if (field.type === "select" && field.options) {
				// For select, show label instead of value
				if (Array.isArray(fieldValue.value)) {
					const labels = fieldValue.value
						.map((val: any) => {
							const option = field.options?.find((opt: any) => opt.value === val)
							return option?.label || option?.text || String(val)
						})
						.filter(Boolean)
					valueDisplay = labels.join(", ")
				} else {
					const option = field.options.find((opt: any) => opt.value === fieldValue.value)
					valueDisplay = option?.label || option?.text || String(fieldValue.value)
				}
			} else if (field.type === "cascade" && field.options && Array.isArray(fieldValue.value)) {
				// For cascade, find labels from options recursively
				const findLabels = (options: any[], path: any[]): string[] => {
					if (!path.length) return []
					const currentVal = path[0]
					const option = options.find((opt: any) => opt.value === currentVal)
					if (!option) return path.map(String)
					const label = option.label || option.text || String(option.value)
					if (path.length === 1) return [label]
					if (option.children) return [label, ...findLabels(option.children, path.slice(1))]
					return [label, ...path.slice(1).map(String)]
				}
				const labels = findLabels(field.options, fieldValue.value)
				valueDisplay = labels.join(" / ")
			} else if (Array.isArray(fieldValue.value)) {
				valueDisplay = fieldValue.value.join(", ")
			} else if (fieldValue.value !== undefined && fieldValue.value !== null && fieldValue.value !== "") {
				valueDisplay = String(fieldValue.value)
			}

			// Only show value if it exists
			const label = valueDisplay ? `${field.title}${conditionLabel}: ${valueDisplay}` : `${field.title}${conditionLabel}`

			return {
				key: field.key,
				label,
				field,
			}
		})
		.filter(Boolean) as Array<{ key: string; label: string; field: any }>

	// Calculate visible standard fields
	const initialVisibleCount = 4
	const visibleStandardFields = expanded ? standardFields : standardFields.slice(0, initialVisibleCount)
	const hasMoreStandard = standardFields.length > initialVisibleCount

	return (
		<div
			style={{
				background: "#fff",
				padding: "16px",
				borderRadius: "8px",
				boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
				border: "1px solid #f0f0f0",
			}}
		>
			{/* Expandable (Tiled) fields - Full width rows */}
			{expandableFields.length > 0 && (
				<div style={{ marginBottom: standardFields.length > 0 ? "16px" : "0" }}>
					{expandableFields.map((field) => (
						<SearchItem key={field.key} field={field} />
					))}
				</div>
			)}

			{/* Standard fields - Grid layout */}
			{standardFields.length > 0 && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
						gap: "16px",
						alignItems: "end",
					}}
				>
					{visibleStandardFields.map((field) => (
						<SearchItem key={field.key} field={field} />
					))}
				</div>
			)}

			{/* Action area */}
			<div
				style={{
					marginTop: "16px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderTop: "1px solid #f5f5f5",
					paddingTop: "12px",
				}}
			>
				<div>
					{hasMoreStandard && (
						<Button
							type="link"
							size="small"
							onClick={() => setExpanded(!expanded)}
							icon={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
							style={{ paddingLeft: 0 }}
						>
							{expanded ? "收起更多" : `更多筛选 (${standardFields.length - initialVisibleCount})`}
						</Button>
					)}
				</div>

				<Space>
					<Button icon={<RotateCw size={14} />} onClick={resetAll} disabled={activeConditions.length === 0 && !hasSubmitted}>
						重置
					</Button>
					<Button type="primary" icon={<Search size={14} />} onClick={submit}>
						搜索
					</Button>
				</Space>
			</div>

			{/* Active conditions tags */}
			{hasSubmitted && activeConditions.length > 0 && (
				<div
					style={{
						marginTop: "12px",
						padding: "10px 12px",
						background: "#fafafa",
						borderRadius: "4px",
						display: "flex",
						alignItems: "flex-start",
						gap: "8px",
					}}
				>
					<div style={{ fontSize: "12px", color: "#8c8c8c", fontWeight: 500, marginTop: "2px", whiteSpace: "nowrap" }}>
						当前筛选:
					</div>
					<div style={{ flex: 1 }}>
						<Space size={[8, 8]} wrap>
							{activeConditions.map((condition) => (
								<Tag
									key={condition.key}
									closable
									onClose={() => resetFieldValue(condition.key)}
									color="processing"
									style={{
										margin: 0,
										borderRadius: "4px",
										background: "#fff",
										border: "1px solid #d1e9ff",
										padding: "2px 8px",
									}}
								>
									{condition.label}
								</Tag>
							))}
							<Button
								type="link"
								size="small"
								danger
								icon={<XCircle size={12} />}
								onClick={resetAll}
								style={{ height: "auto", padding: "0 4px", fontSize: "12px" }}
							>
								清空全部
							</Button>
						</Space>
					</div>
				</div>
			)}
		</div>
	)
}

/**
 * NewbieSearch Component
 *
 * Advanced search component with condition filtering, sorting, and persistence
 *
 * @param props - Component props
 * @returns Search component
 *
 * @example
 * ```tsx
 * <NewbieSearch
 *   fields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   onSubmit={(query) => console.log(query)}
 * />
 * ```
 */
export function NewbieSearch(props: NewbieSearchProps): JSX.Element {
	const { fields, onSubmit } = props

	return (
		<SearchProvider fields={fields} onSubmit={onSubmit}>
			<SearchFields />
		</SearchProvider>
	)
}

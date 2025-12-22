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
import { Button, Space, Tag, Popover, Select, Divider, Typography } from "antd"
import { Search, RotateCw, ChevronDown, ChevronUp, XCircle, ArrowUpDown, SortAsc, SortDesc, Trash2, Plus, GripVertical } from "lucide-react"
import { SearchProvider } from "./context/search-provider"
import { useSearchContext } from "./context/search-context"
import { SearchItem } from "./components/search-item"
import { getConditionLabel } from "./utils/conditions"
import type { NewbieSearchProps, SortField, SortFieldConfig } from "./types"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/**
 * SortableItem Component
 */
function SortableItem({ sort, field }: { sort: SortField; field: SortFieldConfig }): JSX.Element {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sort.key })
	const { removeSort, updateSort } = useSearchContext()

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		background: isDragging ? "#fafafa" : "#fff",
		padding: "8px 12px",
		borderRadius: 6,
		border: "1px solid #f0f0f0",
		marginBottom: 8,
		zIndex: isDragging ? 1 : 0,
		position: isDragging ? "relative" : ("static" as any),
		boxShadow: isDragging ? "0 5px 15px rgba(0,0,0,0.1)" : "none",
	}

	return (
		<div ref={setNodeRef} style={style}>
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<div {...attributes} {...listeners} style={{ cursor: "grab", display: "flex", alignItems: "center", color: "#999" }}>
					<GripVertical size={14} />
				</div>
				<span style={{ fontWeight: 500 }}>{field.title}</span>
			</div>
			<Space size={4}>
				<Button
					size="small"
					type={sort.order === "asc" ? "primary" : "default"}
					icon={<SortAsc size={14} />}
					onClick={() => updateSort(sort.key, "asc")}
					style={{ width: 32, padding: 0 }}
				/>
				<Button
					size="small"
					type={sort.order === "desc" ? "primary" : "default"}
					icon={<SortDesc size={14} />}
					onClick={() => updateSort(sort.key, "desc")}
					style={{ width: 32, padding: 0 }}
				/>
				<Divider type="vertical" style={{ margin: "0 4px" }} />
				<Button
					size="small"
					type="text"
					danger
					icon={<Trash2 size={14} />}
					onClick={() => removeSort(sort.key)}
					style={{ width: 32, padding: 0 }}
				/>
			</Space>
		</div>
	)
}

/**
 * SortPopoverContent Component
 *
 * Internal component that renders sort configuration
 */
function SortPopoverContent(): JSX.Element {
	const { sortFields, sortForm, addSort, reorderSort } = useSearchContext()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (active.id !== over?.id) {
			const oldIndex = sortForm.findIndex((item) => item.key === active.id)
			const newIndex = sortForm.findIndex((item) => item.key === over?.id)
			reorderSort(oldIndex, newIndex)
		}
	}

	// Get available fields for sorting (exclude already added fields)
	const availableFields = sortFields.filter((f) => !sortForm.find((s) => s.key === f.key))

	if (sortFields.length === 0) {
		return <div style={{ padding: 12, textAlign: "center", color: "#999" }}>暂无排序字段</div>
	}

	return (
		<div style={{ width: 320 }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
				<Typography.Text strong>排序规则</Typography.Text>
				<Typography.Text type="secondary" style={{ fontSize: 12 }}>
					{sortForm.length > 0 ? `已选 ${sortForm.length} 项` : "暂无排序"}
				</Typography.Text>
			</div>

			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={sortForm.map((s) => s.key)} strategy={verticalListSortingStrategy}>
					<div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
						{sortForm.map((sort) => {
							const field = sortFields.find((f) => f.key === sort.key)
							if (!field) return null
							return <SortableItem key={sort.key} sort={sort} field={field} />
						})}
					</div>
				</SortableContext>
			</DndContext>

			<Select
				placeholder="添加排序字段"
				style={{ width: "100%", marginTop: 8 }}
				value={null}
				onChange={(val: string) => addSort(val)}
				disabled={availableFields.length === 0}
				suffixIcon={<Plus size={14} />}
			>
				{availableFields.map((field) => (
					<Select.Option key={field.key} value={field.key}>
						{field.title}
					</Select.Option>
				))}
			</Select>
		</div>
	)
}

/**
 * SearchFields Component
 *
 * Internal component that renders search fields
 */
function SearchFields(): JSX.Element {
	const { queryFields, sortFields, submit, resetAll, resetFieldValue, isFieldValueValid, hasSubmitted, submittedQueryForm, sortForm, removeSort } =
		useSearchContext()
	const [expanded, setExpanded] = useState(false)

	// Split fields into expandable and standard
	const expandableFields = queryFields.filter((f) => f.type === "select" && f.expandable)
	const standardFields = queryFields.filter((f) => !(f.type === "select" && f.expandable))

	// Get active search conditions from submitted query form snapshot
	const activeConditions = queryFields
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
					type: "filter",
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
				type: "filter",
			}
		})
		.filter(Boolean) as Array<{ key: string; label: string; field: any; type: "filter" }>

	const { submittedSortForm } = useSearchContext()

	// Create tags for submitted sort form
	const activeSorts = submittedSortForm.map((sort) => {
		const field = sortFields.find((f) => f.key === sort.key)
		return {
			key: sort.key,
			label: `${field?.title || sort.key} ${sort.order === "asc" ? "升序" : "降序"}`,
			type: "sort",
			field,
		}
	})

	const allActiveTags = [...activeConditions, ...activeSorts]

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

				<Space size={16}>
					<Button icon={<RotateCw size={14} />} onClick={resetAll} disabled={activeConditions.length === 0 && !hasSubmitted}>
						重置
					</Button>
					<Space>
						{sortFields.length > 0 && (
							<Popover content={<SortPopoverContent />} trigger="click" placement="bottomRight" arrow={false}>
								<Button icon={<ArrowUpDown size={14} />}>
									排序
									{sortForm.length > 0 && (
										<Tag color="blue" bordered={false} style={{ marginLeft: 6, marginRight: 0 }}>
											{sortForm.length}
										</Tag>
									)}
								</Button>
							</Popover>
						)}
						<Button type="primary" icon={<Search size={14} />} onClick={submit}>
							搜索
						</Button>
					</Space>
				</Space>
			</div>

			{/* Active conditions tags */}
			{hasSubmitted && allActiveTags.length > 0 && (
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
					<div style={{ fontSize: "12px", color: "#8c8c8c", fontWeight: 500, marginTop: "4px", whiteSpace: "nowrap" }}>当前筛选:</div>
					<div style={{ flex: 1 }}>
						<Space size={[8, 8]} wrap>
							{allActiveTags.map((tag) => (
								<Tag
									key={`${tag.type}-${tag.key}`}
									closable
									onClose={() => {
										if (tag.type === "sort") {
											removeSort(tag.key)
										} else {
											resetFieldValue(tag.key)
										}
									}}
									color={tag.type === "sort" ? "purple" : "processing"}
									style={{
										margin: 0,
										borderRadius: "4px",
										background: "#fff",
										border: tag.type === "sort" ? "1px solid #d3adf7" : "1px solid #d1e9ff",
										padding: "2px 8px",
									}}
								>
									{tag.label}
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
 *   queryFields={[
 *     { key: 'name', type: 'input', title: '姓名' },
 *     { key: 'age', type: 'number', title: '年龄' }
 *   ]}
 *   sortFields={[
 *     { key: 'createdAt', title: '创建时间' }
 *   ]}
 *   onSubmit={(query) => console.log(query)}
 * />
 * ```
 */
export function NewbieSearch(props: NewbieSearchProps): JSX.Element {
	const { queryFields, sortFields, onSubmit } = props

	return (
		<SearchProvider queryFields={queryFields} sortFields={sortFields} onSubmit={onSubmit}>
			<SearchFields />
		</SearchProvider>
	)
}

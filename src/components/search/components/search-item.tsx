/**
 * SearchItem Component
 *
 * Individual search field item with mask and popup panel
 *
 * Layout: Title on top, Input-style mask below, click to open popup panel
 */

import { useState, useRef, useEffect, useMemo } from "react"
import { Input, InputNumber, Select, Button, Dropdown, DatePicker, Popover, Tooltip, Space, Cascader, Tag } from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"

// Extend dayjs with required plugins (required by Ant Design DatePicker)
dayjs.extend(weekday)
dayjs.extend(localeData)
import {
	ChevronDown,
	Equal,
	EqualNot,
	Grid2X2Check,
	Grid2X2X,
	ChevronRight,
	ChevronLeft,
	ChevronsLeftRightEllipsis,
	CircleSlash,
	CircleOff,
	Ban,
	Circle,
	Search,
} from "lucide-react"
import { useSearchField } from "../hooks/use-search-field"
import type { SearchFieldConfig } from "../types"
import type { MenuProps } from "antd"

const { RangePicker } = DatePicker

/**
 * Get icon for condition
 *
 * Returns a Lucide icon component with appropriate styling for Ant Design components
 */
function getConditionIcon(condition: string) {
	const iconProps = { size: 14, strokeWidth: 2, style: { display: "inline-block" } }

	switch (condition) {
		case "equal":
			return <Equal {...iconProps} />
		case "notEqual":
			return <EqualNot {...iconProps} />
		case "include":
			return <Grid2X2Check {...iconProps} />
		case "exclude":
			return <Grid2X2X {...iconProps} />
		case "greaterThan":
			return <ChevronRight {...iconProps} />
		case "lessThan":
			return <ChevronLeft {...iconProps} />
		case "between":
			return <ChevronsLeftRightEllipsis {...iconProps} />
		case "in":
			return <CircleSlash {...iconProps} />
		case "notIn":
			return <CircleOff {...iconProps} />
		case "null":
			return <Ban {...iconProps} />
		case "notNull":
			return <Circle {...iconProps} />
		default:
			return <Search {...iconProps} />
	}
}

/**
 * SearchItem props
 */
export interface SearchItemProps {
	/** Field configuration */
	field: SearchFieldConfig
}

/**
 * SearchItem Component
 *
 * Renders a single search field with condition selector and input
 * Layout: [Label] [Condition Button] [Input Field]
 *
 * @param props - Component props
 * @returns Search item component
 *
 * @example
 * ```tsx
 * <SearchItem
 *   field={{
 *     key: 'name',
 *     type: 'input',
 *     title: '姓名'
 *   }}
 * />
 * ```
 */
export function SearchItem(props: SearchItemProps): JSX.Element {
	const { field } = props
	const fieldState = useSearchField({ field })
	const [isOpen, setIsOpen] = useState(false)
	const [selectOpen, setSelectOpen] = useState(false)
	const [datePickerOpen, setDatePickerOpen] = useState(false)
	const [cascaderOpen, setCascaderOpen] = useState(false)
	const panelRef = useRef<HTMLDivElement>(null)

	// Refs for auto-focus
	const inputRef = useRef<any>(null)
	const selectRef = useRef<any>(null)
	const cascaderRef = useRef<any>(null)

	// Auto focus input and open nested popups when panel opens
	useEffect(() => {
		if (isOpen) {
			// Small delay to ensure DOM is ready and animation started
			// 200ms is safer for Popover transition completion
			const timer = setTimeout(() => {
				if (field.type === "select") {
					// Open select dropdown and focus
					setSelectOpen(true)
					if (selectRef.current) {
						selectRef.current.focus()
					}
				} else if (field.type === "cascade") {
					// Open cascader dropdown
					setCascaderOpen(true)
					if (cascaderRef.current) {
						cascaderRef.current.focus()
					}
				} else if (field.type === "date") {
					// Open date picker and focus
					// For date fields, we also handle condition changes (e.g. to 'between')
					setDatePickerOpen(true)
					if (inputRef.current?.focus) {
						inputRef.current.focus()
					}
				} else if ((field.type === "input" || field.type === "textarea" || field.type === "number") && inputRef.current) {
					if (inputRef.current.focus) {
						inputRef.current.focus()
					} else if (inputRef.current.input) {
						inputRef.current.input.focus()
					}
				}
			}, 200)

			return () => clearTimeout(timer)
		} else {
			// Reset nested open states when main panel closes
			setSelectOpen(false)
			setDatePickerOpen(false)
			setCascaderOpen(false)
		}
	}, [isOpen, field.type, fieldState.condition])

	// Get current condition label
	const currentConditionLabel =
		fieldState.conditions.find((c) => c.value === fieldState.condition)?.label || fieldState.conditions[0]?.label || "等于"

	// Get mask display value
	const getMaskDisplayValue = () => {
		if (!fieldState.isValid || fieldState.displayValue === "") {
			return ""
		}

		// For cascade, always find labels from options (don't rely on displayValue)
		if (field.type === "cascade" && Array.isArray(fieldState.value) && fieldState.value.length > 0 && field.options) {
			const findLabels = (options: any[], path: any[]): string[] => {
				if (path.length === 0) return []
				const currentValue = path[0]
				const option = options.find((opt: any) => opt.value === currentValue)
				if (!option) {
					// If option not found, try to use displayValue or fallback to value
					return fieldState.displayValue ? [fieldState.displayValue] : path.map(String)
				}
				const label = option.label || option.text || String(option.value)
				if (path.length === 1) {
					return [label]
				}
				if (option.children) {
					return [label, ...findLabels(option.children, path.slice(1))]
				}
				return [label, ...path.slice(1).map(String)]
			}
			const labels = findLabels(field.options, fieldState.value)
			return labels.join(" / ")
		}

		let displayText = fieldState.displayValue
		if (field.type === "select" && fieldState.value && field.options) {
			if (Array.isArray(fieldState.value)) {
				const labels = fieldState.value
					.map((val: any) => {
						const option = field.options?.find((opt: any) => opt.value === val)
						return option?.label || option?.text || String(val)
					})
					.filter(Boolean)
				displayText = labels.join(", ")
			} else {
				const selectedOption = field.options.find((opt: any) => opt.value === fieldState.value)
				if (selectedOption) {
					displayText = selectedOption.label || selectedOption.text || String(selectedOption.value)
				}
			}
		}
		return displayText
	}

	const maskDisplayValue = getMaskDisplayValue()

	// Get condition part for addonBefore
	const conditionPart = useMemo(() => {
		if (!fieldState.isValid || fieldState.displayValue === "") {
			return null
		}
		if (fieldState.condition === "equal") {
			return null
		}
		if (fieldState.condition === "null" || fieldState.condition === "notNull") {
			return currentConditionLabel
		}
		return currentConditionLabel
	}, [fieldState.isValid, fieldState.displayValue, fieldState.condition, currentConditionLabel])

	// Helper to get popup container
	const getPopupContainer = () => panelRef.current || document.body

	// Render condition selector as dropdown button
	const renderConditionSelector = () => {
		if (field.disableConditions) {
			return null
		}

		const menuItems: MenuProps["items"] = fieldState.conditions.map((condition) => ({
			key: condition.value,
			label: (
				<span style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
					<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>{getConditionIcon(condition.value)}</span>
					{condition.label}
				</span>
			),
			onClick: ({ key }: { key: string }) => {
				fieldState.setCondition(key)
			},
		}))

		const currentIcon = getConditionIcon(fieldState.condition)

		return (
			<div onClick={(e) => e.stopPropagation()}>
				<Dropdown menu={{ items: menuItems }} trigger={["click"]} getPopupContainer={getPopupContainer}>
					<Button
						style={{
							minWidth: "80px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "4px",
							height: "32px",
						}}
					>
						<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>{currentIcon}</span>
						<span style={{ display: "flex", alignItems: "center" }}>{currentConditionLabel}</span>
						<ChevronDown size={12} strokeWidth={2} style={{ display: "flex", alignItems: "center", marginLeft: "4px" }} />
					</Button>
				</Dropdown>
			</div>
		)
	}

	// Render input based on field type
	const renderInput = () => {
		const commonProps = {
			placeholder: `搜索 ${field.title}`,
			disabled: fieldState.disabled,
			style: { flex: 1, minWidth: 0 },
		}

		switch (field.type) {
			case "input":
				return (
					<Input
						{...commonProps}
						ref={inputRef}
						value={fieldState.value || ""}
						onChange={(e) => fieldState.setValue(e.target.value)}
						allowClear
					/>
				)

			case "number":
				// Render range input for "between" condition
				if (fieldState.condition === "between") {
					const rangeValue = Array.isArray(fieldState.value)
						? fieldState.value
						: fieldState.value
							? [fieldState.value, fieldState.value]
							: [undefined, undefined]

					return (
						<div style={{ display: "flex", gap: "8px", flex: 1, alignItems: "center" }}>
							<InputNumber
								ref={inputRef}
								placeholder="最小值"
								value={rangeValue[0]}
								onChange={(value) => {
									fieldState.setValue([value ?? undefined, rangeValue[1]])
								}}
								style={{ flex: 1 }}
							/>
							<span style={{ color: "#999" }}>~</span>
							<InputNumber
								placeholder="最大值"
								value={rangeValue[1]}
								onChange={(value) => {
									fieldState.setValue([rangeValue[0], value ?? undefined])
								}}
								style={{ flex: 1 }}
							/>
						</div>
					)
				}

				return (
					<InputNumber
						{...commonProps}
						ref={inputRef}
						value={fieldState.value}
						onChange={(value) => fieldState.setValue(value ?? undefined)}
						style={{ width: "100%", flex: 1 }}
					/>
				)

			case "select":
				// Check if condition requires multiple selection
				const isMultiple = fieldState.condition === "in" || fieldState.condition === "notIn"
				const selectValue = isMultiple
					? Array.isArray(fieldState.value)
						? fieldState.value
						: fieldState.value
							? [fieldState.value]
							: []
					: fieldState.value

				return (
					<Select
						{...commonProps}
						ref={selectRef}
						value={selectValue}
						onChange={(value) => {
							fieldState.setValue(value)
						}}
						options={field.options || []}
						allowClear
						showSearch
						mode={isMultiple ? "multiple" : undefined}
						placeholder={`搜索 ${field.title}`}
						style={{ width: "100%", flex: 1 }}
						getPopupContainer={getPopupContainer}
						open={selectOpen}
						onOpenChange={setSelectOpen}
						autoFocus
					/>
				)

			case "textarea":
				return (
					<Input.TextArea
						{...commonProps}
						ref={inputRef}
						value={fieldState.value || ""}
						onChange={(e) => fieldState.setValue(e.target.value)}
						placeholder={`搜索 ${field.title}, 每行一个`}
						rows={4}
						style={{ flex: 1, minWidth: 0 }}
					/>
				)

			case "cascade":
				// Cascader value should be an array representing the path
				const cascaderValue = Array.isArray(fieldState.value) ? fieldState.value : fieldState.value ? [fieldState.value] : []

				return (
					<Cascader
						{...commonProps}
						ref={cascaderRef}
						value={cascaderValue}
						onChange={(value) => {
							fieldState.setValue(value)
						}}
						options={field.options || []}
						allowClear
						showSearch
						placeholder={`搜索 ${field.title}`}
						style={{ width: "100%", flex: 1 }}
						getPopupContainer={getPopupContainer}
						open={cascaderOpen}
						onOpenChange={setCascaderOpen}
						changeOnSelect={fieldState.condition === "include"}
						displayRender={(labels) => labels.join(" / ")}
					/>
				)

			case "date":
				// Helper function to safely convert value to dayjs
				// Always create a fresh dayjs instance to avoid reference issues
				const toDayjs = (value: any): Dayjs | null => {
					if (!value) return null

					try {
						// Always create a new dayjs instance from the value
						// This ensures we have a proper dayjs object with all methods
						let d: Dayjs | null = null

						if (typeof value === "string") {
							// String date - parse with format if it matches YYYY-MM-DD
							if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
								d = dayjs(value, "YYYY-MM-DD", true)
							} else {
								d = dayjs(value)
							}
						} else if (value instanceof Date) {
							// Native Date object
							d = dayjs(value)
						} else if (typeof value === "number") {
							// Timestamp
							d = dayjs(value)
						} else if (value && typeof value === "object") {
							// Could be dayjs object or plain object
							// Always create a new instance from it
							if (typeof value.format === "function" && typeof value.isValid === "function") {
								// It's a dayjs-like object, create new instance from it
								try {
									if (typeof value.toDate === "function") {
										d = dayjs(value.toDate())
									} else {
										d = dayjs(value)
									}
								} catch {
									d = dayjs(value)
								}
							} else {
								d = dayjs(value)
							}
						} else {
							d = dayjs(value)
						}

						// Validate the result
						if (d && typeof d.isValid === "function" && d.isValid()) {
							try {
								const dateValue = d.toDate ? d.toDate() : new Date(d.valueOf())
								const freshDayjs = dayjs(dateValue)
								if (freshDayjs.isValid()) {
									return freshDayjs
								}
							} catch {
								return d
							}
							return d
						}
					} catch (e) {
						console.warn("Error converting value to dayjs:", e, value)
					}

					return null
				}

				// Use useMemo to stabilize date values
				const dateValue = useMemo(() => {
					return toDayjs(fieldState.value)
				}, [fieldState.value])

				const rangeValue = useMemo((): [Dayjs | null, Dayjs | null] => {
					if (fieldState.condition === "between") {
						if (Array.isArray(fieldState.value) && fieldState.value.length === 2) {
							return [toDayjs(fieldState.value[0]), toDayjs(fieldState.value[1])]
						} else if (fieldState.value) {
							const date = toDayjs(fieldState.value)
							if (date) {
								return [date, date]
							}
						}
					}
					return [null, null]
				}, [fieldState.value, fieldState.condition])

				// Render range picker for "between" condition
				if (fieldState.condition === "between") {
					return (
						<RangePicker
							{...commonProps}
							ref={inputRef}
							value={rangeValue}
							onChange={(dates: [Dayjs | null, Dayjs | null] | null) => {
								if (dates && dates[0] && dates[1]) {
									fieldState.setValue([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")])
								} else {
									fieldState.setValue(null)
								}
							}}
							style={{ width: "100%", flex: 1 }}
							format="YYYY-MM-DD"
							placeholder={["开始日期", "结束日期"]}
							getPopupContainer={getPopupContainer}
							open={datePickerOpen}
							onOpenChange={setDatePickerOpen}
							autoFocus
						/>
					)
				}

				// Single date picker
				return (
					<DatePicker
						{...commonProps}
						ref={inputRef}
						value={dateValue}
						onChange={(date: Dayjs | null) => {
							fieldState.setValue(date ? date.format("YYYY-MM-DD") : null)
						}}
						style={{ width: "100%", flex: 1 }}
						format="YYYY-MM-DD"
						placeholder={`选择${field.title}`}
						getPopupContainer={getPopupContainer}
						open={datePickerOpen}
						onOpenChange={setDatePickerOpen}
						autoFocus
					/>
				)

			default:
				return <Input {...commonProps} value={fieldState.value || ""} onChange={(e) => fieldState.setValue(e.target.value)} allowClear />
		}
	}

	// Render popup panel content
	const renderPanelContent = () => {
		return (
			<div ref={panelRef} style={{ minWidth: "300px", padding: "8px" }}>
				{/* Title and condition selector in one row */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: "8px",
						paddingBottom: "8px",
						borderBottom: "1px solid #f0f0f0",
					}}
				>
					<div style={{ fontSize: "13px", color: "#000000d9", fontWeight: 500 }}>
						搜索{" "}
						<span
							style={{
								fontFamily: "monospace",
								background: "#f5f5f5",
								padding: "1px 3px",
								borderRadius: "3px",
								fontSize: "12px",
							}}
						>
							{field.title}
						</span>
					</div>
					{!field.disableConditions && <div style={{ marginLeft: "8px" }}>{renderConditionSelector()}</div>}
				</div>

				{/* Input field */}
				<div>{renderInput()}</div>
			</div>
		)
	}

	// Render mask (Input-style display)
	const renderMask = () => {
		// Render condition selector on mask
		const renderConditionAddon = () => {
			if (!conditionPart) return null

			const menuItems: MenuProps["items"] = fieldState.conditions.map((condition) => ({
				key: condition.value,
				label: (
					<span style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
						<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>{getConditionIcon(condition.value)}</span>
						{condition.label}
					</span>
				),
				onClick: ({ key }) => fieldState.setCondition(key),
			}))

			return (
				<div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
					<Dropdown menu={{ items: menuItems }} trigger={["click"]}>
						<Tooltip title={conditionPart} placement="top">
							<Button
								type="text"
								style={{
									borderRadius: "6px 0 0 6px",
									backgroundColor: "#f5f5f5",
									border: "1px solid #d9d9d9",
									borderRight: "none",
									height: "32px",
									padding: "0 12px",
								}}
							>
								<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>
									{getConditionIcon(fieldState.condition)}
								</span>
							</Button>
						</Tooltip>
					</Dropdown>
				</div>
			)
		}

		const conditionAddon = renderConditionAddon()

		return (
			<Space.Compact style={{ width: "100%" }}>
				{conditionAddon}
				<Input
					readOnly
					value={maskDisplayValue}
					style={{
						cursor: "pointer",
						borderLeft: conditionAddon ? "none" : undefined,
						borderRadius: conditionAddon ? "0 6px 6px 0" : "6px",
					}}
				/>
			</Space.Compact>
		)
	}

	// Render tiled select for expandable fields
	const renderTiledSelect = () => {
		const isMultiple = field.expandable === "multiple"
		const options = field.options || []
		const currentValue = fieldState.value

		const handleSelect = (val: any) => {
			if (isMultiple) {
				const newValue = Array.isArray(currentValue) ? [...currentValue] : []
				const index = newValue.indexOf(val)
				if (index > -1) {
					newValue.splice(index, 1)
				} else {
					newValue.push(val)
				}
				fieldState.setValue(newValue)
				// Ensure condition is set to 'in' for multiple selects
				if (fieldState.condition !== "in" && fieldState.condition !== "notIn") {
					fieldState.setCondition("in")
				}
			} else {
				// Toggle off if already selected, or select new
				const newValue = currentValue === val ? undefined : val
				fieldState.setValue(newValue)
				// Ensure condition is set to 'equal' for single select
				if (fieldState.condition !== "equal" && fieldState.condition !== "notEqual") {
					fieldState.setCondition("equal")
				}
			}
		}

		return (
			<div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
				{options.map((opt: any) => {
					const isSelected = isMultiple
						? Array.isArray(currentValue) && currentValue.includes(opt.value)
						: currentValue === opt.value

					return (
						<Tag.CheckableTag key={opt.value} checked={isSelected} onChange={() => handleSelect(opt.value)}>
							{opt.label || opt.text || String(opt.value)}
						</Tag.CheckableTag>
					)
				})}
			</div>
		)
	}

	if (field.type === "select" && field.expandable) {
		return (
			<div
				style={{
					display: "flex",
					padding: "8px 0",
					borderBottom: "1px dashed #f0f0f0",
					width: "100%",
				}}
			>
				<div
					style={{
						width: "80px",
						flexShrink: 0,
						color: "#333",
						fontSize: "13px",
						fontWeight: 400,
						paddingTop: "2px",
					}}
				>
					{field.title}:
				</div>
				<div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
					<div>{renderTiledSelect()}</div>
					{field.expandable === "multiple" && (
						<div style={{ fontSize: "12px", color: "#999", marginLeft: "12px", whiteSpace: "nowrap", paddingTop: "2px" }}>
							(可多选)
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div style={{ marginBottom: "8px" }}>
			{/* Title on top */}
			<div
				style={{
					marginBottom: "4px",
					fontSize: "13px",
					color: "#333",
					fontWeight: 400,
				}}
			>
				{field.title}
			</div>

			{/* Mask and Popover */}
			<Popover
				content={renderPanelContent()}
				trigger="click"
				open={isOpen}
				onOpenChange={setIsOpen}
				placement="bottomLeft"
				overlayStyle={{ padding: 0 }}
				overlayClassName="newbie-search-popover"
				getPopupContainer={() => document.body}
				destroyOnHidden={false}
			>
				<div style={{ display: "inline-block", width: "100%" }}>{renderMask()}</div>
			</Popover>
		</div>
	)
}

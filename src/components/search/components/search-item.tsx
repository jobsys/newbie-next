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
import { useSearchContext } from "../context/search-context"
import type { SearchFieldConfig, SearchCondition } from "../types"
import type { MenuProps } from "antd"

const { RangePicker } = DatePicker

/**
 * Get icon for condition
 *
 * Returns a Lucide icon component with appropriate styling for Ant Design components
 */
function getConditionIcon(condition: SearchCondition) {
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
		case "greaterThanOrEqual":
			return <ChevronRight {...iconProps} />
		case "lessThan":
		case "lessThanOrEqual":
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
 */
export function SearchItem(props: SearchItemProps): JSX.Element {
	const { field } = props
	const fieldState = useSearchField({ field })
	const {
		getFieldValue: getFieldValueDirect,
		updateFieldValue: updateFieldValueDirect,
		disableConditions: globalDisableConditions,
		autoQuery,
		submit,
	} = useSearchContext()
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
			const timer = setTimeout(() => {
				if (field.type === "select") {
					setSelectOpen(true)
					if (selectRef.current) selectRef.current.focus()
				} else if (field.type === "cascade") {
					setCascaderOpen(true)
					if (cascaderRef.current) cascaderRef.current.focus()
				} else if (field.type === "date") {
					setDatePickerOpen(true)
					if (inputRef.current?.focus) inputRef.current.focus()
				} else if ((field.type === "input" || field.type === "textarea" || field.type === "number") && inputRef.current) {
					if (inputRef.current.focus) inputRef.current.focus()
					else if (inputRef.current.input) inputRef.current.input.focus()
				}
			}, 200)
			return () => clearTimeout(timer)
		} else {
			setSelectOpen(false)
			setDatePickerOpen(false)
			setCascaderOpen(false)
		}
	}, [isOpen, field.type, fieldState.condition])

	const currentConditionLabel =
		fieldState.conditions.find((c) => c.value === fieldState.condition)?.label || fieldState.conditions[0]?.label || "等于"

	const getMaskDisplayValue = () => {
		if (field.getDisplayValue) return field.getDisplayValue(getFieldValueDirect)
		if (!fieldState.isValid || fieldState.displayValue === "") return ""

		if (field.type === "cascade" && Array.isArray(fieldState.value) && fieldState.value.length > 0 && field.options) {
			const findLabels = (options: any[], path: any[]): string[] => {
				if (path.length === 0) return []
				const currentValue = path[0]
				const option = options.find((opt: any) => opt.value === currentValue)
				if (!option) return fieldState.displayValue ? [fieldState.displayValue] : path.map(String)
				const label = option.label || option.text || String(option.value)
				if (path.length === 1) return [label]
				if (option.children) return [label, ...findLabels(option.children, path.slice(1))]
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
				if (selectedOption) displayText = selectedOption.label || selectedOption.text || String(selectedOption.value)
			}
		}
		return displayText
	}

	const maskDisplayValue = getMaskDisplayValue()

	const conditionPart = useMemo(() => {
		if (field.render) return null
		if (!fieldState.isValid || fieldState.displayValue === "") return null
		if (fieldState.condition === "equal") return null
		return currentConditionLabel
	}, [fieldState.isValid, fieldState.displayValue, fieldState.condition, currentConditionLabel, field.render])

	const getPopupContainer = () => panelRef.current || document.body

	const renderConditionSelector = () => {
		if (field.disableConditions || globalDisableConditions || field.render) return null
		const menuItems: MenuProps["items"] = fieldState.conditions.map((condition) => ({
			key: condition.value,
			label: (
				<span style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
					<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>{getConditionIcon(condition.value)}</span>
					{condition.label}
				</span>
			),
			onClick: ({ key }) => fieldState.setCondition(key as SearchCondition),
		}))

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
						<span style={{ color: "#1890ff", display: "flex", alignItems: "center" }}>{getConditionIcon(fieldState.condition)}</span>
						<span style={{ display: "flex", alignItems: "center" }}>{currentConditionLabel}</span>
						<ChevronDown size={12} strokeWidth={2} style={{ display: "flex", alignItems: "center", marginLeft: "4px" }} />
					</Button>
				</Dropdown>
			</div>
		)
	}

	const renderInput = () => {
		if (field.render) return null
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
								onChange={(value) => fieldState.setValue([value ?? undefined, rangeValue[1]])}
								style={{ flex: 1 }}
							/>
							<span style={{ color: "#999" }}>~</span>
							<InputNumber
								placeholder="最大值"
								value={rangeValue[1]}
								onChange={(value) => fieldState.setValue([rangeValue[0], value ?? undefined])}
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
				const isMultiple = fieldState.condition === "in" || fieldState.condition === "notIn"
				return (
					<Select
						{...commonProps}
						ref={selectRef}
						value={
							isMultiple
								? Array.isArray(fieldState.value)
									? fieldState.value
									: fieldState.value
										? [fieldState.value]
										: []
								: fieldState.value
						}
						onChange={(value) => fieldState.setValue(value)}
						options={field.options || []}
						allowClear
						showSearch
						mode={isMultiple ? "multiple" : undefined}
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
					/>
				)
			case "cascade":
				return (
					<Cascader
						{...commonProps}
						ref={cascaderRef}
						value={Array.isArray(fieldState.value) ? fieldState.value : fieldState.value ? [fieldState.value] : []}
						onChange={(value) => fieldState.setValue(value)}
						options={field.options || []}
						allowClear
						showSearch
						style={{ width: "100%", flex: 1 }}
						getPopupContainer={getPopupContainer}
						open={cascaderOpen}
						onOpenChange={setCascaderOpen}
						changeOnSelect={fieldState.condition === "include"}
						displayRender={(labels) => labels.join(" / ")}
					/>
				)
			case "date":
				const toDayjs = (value: any): Dayjs | null => {
					if (!value) return null
					try {
						const d = dayjs(value)
						return d.isValid() ? d : null
					} catch {
						return null
					}
				}
				if (fieldState.condition === "between") {
					const rangeValue: [Dayjs | null, Dayjs | null] =
						Array.isArray(fieldState.value) && fieldState.value.length === 2
							? [toDayjs(fieldState.value[0]), toDayjs(fieldState.value[1])]
							: [null, null]
					return (
						<RangePicker
							ref={inputRef}
							disabled={fieldState.disabled}
							value={rangeValue}
							onChange={(dates) => {
								if (dates && dates[0] && dates[1]) {
									fieldState.setValue([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")])
								} else fieldState.setValue(null)
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
				return (
					<DatePicker
						{...commonProps}
						ref={inputRef}
						value={toDayjs(fieldState.value)}
						onChange={(date) => fieldState.setValue(date ? date.format("YYYY-MM-DD") : null)}
						style={{ width: "100%", flex: 1 }}
						format="YYYY-MM-DD"
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

	const renderPanelContent = () => {
		const close = () => setIsOpen(false)
		return (
			<div ref={panelRef} style={{ minWidth: "300px", padding: "8px" }}>
				{field.render ? (
					field.render({
						getFieldValue: (key: string) => getFieldValueDirect(key),
						updateFieldValue: updateFieldValueDirect,
						close,
					})
				) : (
					<>
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
								<span style={{ fontFamily: "monospace", background: "#f5f5f5", padding: "1px 3px", borderRadius: "3px" }}>
									{field.title}
								</span>
							</div>
							{!field.disableConditions && !globalDisableConditions && renderConditionSelector()}
						</div>
						<div>{renderInput()}</div>
					</>
				)}
			</div>
		)
	}

	const renderMask = () => {
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
				onClick: ({ key }) => fieldState.setCondition(key as SearchCondition),
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

	const renderTiledSelect = () => {
		const isMultiple = field.expandable === "multiple"
		const options = field.options || []
		const currentValue = fieldState.value
		const handleSelect = (val: any) => {
			if (isMultiple) {
				const newValue = Array.isArray(currentValue) ? [...currentValue] : []
				const index = newValue.indexOf(val)
				if (index > -1) newValue.splice(index, 1)
				else newValue.push(val)
				fieldState.setValue(newValue)
				if (fieldState.condition !== "in" && fieldState.condition !== "notIn") fieldState.setCondition("in")
			} else {
				const newValue = currentValue === val ? undefined : val
				fieldState.setValue(newValue)
				if (fieldState.condition !== "equal" && fieldState.condition !== "notEqual") fieldState.setCondition("equal")
			}

			// For tiled select, trigger auto query immediately as there is no popover to close
			if (autoQuery) {
				// Use a small timeout to ensure state is updated
				setTimeout(() => submit(), 0)
			}
		}
		return (
			<div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
				{options.map((opt: any) => (
					<Tag.CheckableTag
						key={opt.value}
						checked={isMultiple ? Array.isArray(currentValue) && currentValue.includes(opt.value) : currentValue === opt.value}
						onChange={() => handleSelect(opt.value)}
					>
						{opt.label || opt.text || String(opt.value)}
					</Tag.CheckableTag>
				))}
			</div>
		)
	}

	if (field.type === "select" && field.expandable) {
		return (
			<div style={{ display: "flex", padding: "8px 0", borderBottom: "1px dashed #f0f0f0", width: "100%" }}>
				<div style={{ width: "80px", flexShrink: 0, color: "#333", fontSize: "13px", fontWeight: 400, paddingTop: "2px" }}>
					{field.title}:
				</div>
				<div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
					<div>{renderTiledSelect()}</div>
					{field.expandable === "multiple" && (
						<div style={{ fontSize: "12px", color: "#999", marginLeft: "12px", whiteSpace: "nowrap", paddingTop: "2px" }}>(可多选)</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div style={{ marginBottom: "8px" }}>
			<div style={{ marginBottom: "4px", fontSize: "13px", color: "#333", fontWeight: 400 }}>{field.title}</div>
			<Popover
				content={renderPanelContent()}
				trigger="click"
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open)
					// Trigger auto query only when popover closes
					if (!open && autoQuery) {
						submit()
					}
				}}
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

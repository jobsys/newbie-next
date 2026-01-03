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
import { NewbieIcon } from "../../icon"
import type { NewbieProColumn, SearchCondition } from "../types"
import type { MenuProps } from "antd"

const { RangePicker } = DatePicker

/**
 * Get icon for condition
 *
 * Returns a Lucide icon component with appropriate styling for Ant Design components
 */
function getConditionIcon(condition: SearchCondition) {
	switch (condition) {
		case "equal":
			return <NewbieIcon icon={Equal} />
		case "notEqual":
			return <NewbieIcon icon={EqualNot} />
		case "include":
			return <NewbieIcon icon={Grid2X2Check} />
		case "exclude":
			return <NewbieIcon icon={Grid2X2X} />
		case "greaterThan":
		case "greaterThanOrEqual":
			return <NewbieIcon icon={ChevronRight} />
		case "lessThan":
		case "lessThanOrEqual":
			return <NewbieIcon icon={ChevronLeft} />
		case "between":
			return <NewbieIcon icon={ChevronsLeftRightEllipsis} />
		case "in":
			return <NewbieIcon icon={CircleSlash} />
		case "notIn":
			return <NewbieIcon icon={CircleOff} />
		case "null":
			return <NewbieIcon icon={Ban} />
		case "notNull":
			return <NewbieIcon icon={Circle} />
		default:
			return <NewbieIcon icon={Search} />
	}
}

/**
 * SearchItem props
 */
export interface SearchItemProps {
	/** Field configuration */
	field: NewbieProColumn
}

/**
 * SearchItem Component
 */
export function SearchItem(props: SearchItemProps): JSX.Element {
	const { field } = props
	const fieldState = useSearchField({ field })
	const {
		getFieldValue: getFieldValueDirect,
		updateFieldValue,
		disableConditions: globalDisableConditions,
		autoQuery,
		submit,
		fieldOptions,
	} = useSearchContext()

	const fieldKey = (field.dataIndex as string) || (field.key as string)
	const valueType = (field.valueType as string) || "input"
	const currentOptions = fieldOptions[fieldKey] || []

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
				if (valueType === "select") {
					setSelectOpen(true)
					if (selectRef.current) selectRef.current.focus()
				} else if (valueType === "cascader") {
					setCascaderOpen(true)
					if (cascaderRef.current) cascaderRef.current.focus()
				} else if (valueType === "date" || valueType === "dateTime") {
					setDatePickerOpen(true)
					if (inputRef.current?.focus) inputRef.current.focus()
				} else if (
					(valueType === "input" || valueType === "textarea" || valueType === "digit" || valueType === "money") &&
					inputRef.current
				) {
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
	}, [isOpen, valueType, fieldState.condition])

	const currentConditionLabel =
		fieldState.conditions.find((c) => c.value === fieldState.condition)?.label || fieldState.conditions[0]?.label || "等于"

	const getMaskDisplayValue = () => {
		if (field.fieldProps?.getDisplayValue) return field.fieldProps.getDisplayValue(getFieldValueDirect)
		if (!fieldState.isValid || fieldState.displayValue === "") return ""

		if (valueType === "cascader" && Array.isArray(fieldState.value) && fieldState.value.length > 0) {
			const findLabels = (options: any[], path: any[]): string[] => {
				if (path.length === 0) return []
				const currentValue = path[0]
				const option = options.find((opt: any) => opt.value === currentValue)
				if (!option) return [String(currentValue)]
				const label = option.label || option.text || String(option.value)
				if (path.length === 1) return [label]
				if (option.children) return [label, ...findLabels(option.children, path.slice(1))]
				return [label, ...path.slice(1).map(String)]
			}
			const labels = findLabels(currentOptions, fieldState.value)
			return labels.join(" / ")
		}

		let displayText = fieldState.displayValue
		if ((valueType === "select" || valueType === "switch") && fieldState.value !== undefined && fieldState.value !== null) {
			if (field.valueEnum) {
				if (Array.isArray(fieldState.value)) {
					const labels = fieldState.value
						.map((val: any) => {
							const config = (field.valueEnum as any)?.[val]
							return typeof config === "object" ? config.text : String(config || val)
						})
						.filter(Boolean)
					displayText = labels.join(", ")
				} else {
					// Handle boolean keys in valueEnum (convert boolean value to string key if needed)
					// But valueEnum keys are strings, so true -> "true", false -> "false", 1 -> "1", 0 -> "0"
					let config = (field.valueEnum as any)[fieldState.value]
					if (!config) {
						// Try string conversion for boolean/number values
						config = (field.valueEnum as any)[String(fieldState.value)]
					}
					displayText = typeof config === "object" ? config.text : String(config || fieldState.value)
				}
			} else if (valueType === "select" && currentOptions.length > 0) {
				if (Array.isArray(fieldState.value)) {
					const labels = fieldState.value
						.map((val: any) => {
							const option = currentOptions.find((opt: any) => opt.value === val)
							return option?.label || option?.text || String(val)
						})
						.filter(Boolean)
					displayText = labels.join(", ")
				} else {
					const selectedOption = currentOptions.find((opt: any) => opt.value === fieldState.value)
					if (selectedOption) displayText = selectedOption.label || selectedOption.text || String(selectedOption.value)
				}
			} else if (valueType === "switch") {
				// Fallback for switch without valueEnum (though SearchItem switch case usually provides default options,
				// they are internal to the renderInput. Masks need to replicate this logic or use the value itself).
				// Since we don't have access to the internal switchOptions here easily without duplicating logic,
				// we rely on valueEnum. If no valueEnum, we show boolean text.
				if (fieldState.value === true) displayText = "是"
				else if (fieldState.value === false) displayText = "否"
			}
		}
		return displayText
	}

	const maskDisplayValue = getMaskDisplayValue()

	const conditionPart = useMemo(() => {
		if (field.renderFormItem) return null
		if (!fieldState.isValid || fieldState.displayValue === "") return null
		if (fieldState.condition === "equal") return null
		return currentConditionLabel
	}, [fieldState.isValid, fieldState.displayValue, fieldState.condition, currentConditionLabel, field.renderFormItem])

	const getPopupContainer = () => panelRef.current || document.body

	const renderConditionSelector = () => {
		if (field.fieldProps?.disableConditions || globalDisableConditions || field.renderFormItem || valueType === "switch") return null
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
						<NewbieIcon icon={ChevronDown} size={12} style={{ display: "flex", alignItems: "center", marginLeft: "4px" }} />
					</Button>
				</Dropdown>
			</div>
		)
	}

	const renderInput = () => {
		if (field.renderFormItem) return null
		const commonProps = {
			placeholder: `搜索 ${field.title}`,
			disabled: fieldState.disabled,
			style: { flex: 1, minWidth: 0 },
			...field.fieldProps,
		}

		switch (valueType) {
			case "input":
			case "password":
				return (
					<Input
						{...commonProps}
						ref={inputRef}
						value={fieldState.value || ""}
						onChange={(e) => fieldState.setValue(e.target.value)}
						allowClear
					/>
				)
			case "digit":
			case "money":
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
						options={currentOptions}
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
			case "cascader":
				return (
					<Cascader
						{...commonProps}
						ref={cascaderRef}
						value={Array.isArray(fieldState.value) ? fieldState.value : fieldState.value ? [fieldState.value] : []}
						onChange={(value) => fieldState.setValue(value)}
						options={currentOptions}
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
			case "dateTime":
			case "dateRange":
			case "dateTimeRange":
				const toDayjs = (value: any): Dayjs | null => {
					if (!value) return null
					try {
						const d = dayjs(value)
						return d.isValid() ? d : null
					} catch {
						return null
					}
				}
				if (fieldState.condition === "between" || valueType.includes("Range")) {
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
							showTime={valueType.includes("Time")}
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
						showTime={valueType === "dateTime"}
					/>
				)
			case "switch":
				let switchOptions = [
					{ label: "是", value: true },
					{ label: "否", value: false },
				]

				if (field.valueEnum) {
					switchOptions = Object.keys(field.valueEnum).map((key) => {
						const val = (field.valueEnum as any)?.[key]
						// valueEnum value can be object { text: '...', status: '...' } or just string
						const label = typeof val === "object" && val ? val.text : val
						// Try to cast key to boolean if it looks like one, or use as is
						// Usually switch expects boolean, but enum keys are strings.
						// We need to match the backend expectation.
						// If key is "true"/"false" or "1"/"0", map to boolean.
						let value: any = key
						if (key === "true" || key === "1") value = true
						if (key === "false" || key === "0") value = false

						return { label, value }
					})
				}

				return (
					<Select
						{...commonProps}
						ref={selectRef}
						value={fieldState.value}
						onChange={(value) => fieldState.setValue(value)}
						options={switchOptions}
						allowClear
						style={{ width: "100%", flex: 1 }}
						getPopupContainer={getPopupContainer}
						open={selectOpen}
						onOpenChange={setSelectOpen}
						autoFocus
					/>
				)
			default:
				return <Input {...commonProps} value={fieldState.value || ""} onChange={(e) => fieldState.setValue(e.target.value)} allowClear />
		}
	}

	const renderPanelContent = () => {
		return (
			<div ref={panelRef} style={{ minWidth: "300px", padding: "8px" }}>
				{field.renderFormItem ? (
					// In a real scenario, we might want to support this, but per user request, we focus on standard
					<div style={{ padding: 8, color: "#999" }}>[Custom Render Not Yet Re-implemented]</div>
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
									{field.title as React.ReactNode}
								</span>
							</div>
							{!field.fieldProps?.disableConditions && !globalDisableConditions && renderConditionSelector()}
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
		const isMultiple = field.fieldProps?.expandable === "multiple"
		const currentValue = fieldState.value
		const handleSelect = (val: any) => {
			if (isMultiple) {
				const newValue = Array.isArray(currentValue) ? [...currentValue] : []
				const index = newValue.indexOf(val)
				if (index > -1) newValue.splice(index, 1)
				else newValue.push(val)

				const newCondition = fieldState.condition === "in" || fieldState.condition === "notIn" ? fieldState.condition : "in"

				updateFieldValue(fieldKey, newValue, newCondition, valueType)
			} else {
				const newValue = currentValue === val ? undefined : val
				const newCondition = fieldState.condition === "equal" || fieldState.condition === "notEqual" ? fieldState.condition : "equal"

				updateFieldValue(fieldKey, newValue, newCondition, valueType)
			}

			if (autoQuery) setTimeout(() => submit(), 0)
		}
		return (
			<div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
				{currentOptions.map((opt: any) => (
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

	if (valueType === "select" && field.fieldProps?.expandable) {
		return (
			<div style={{ display: "flex", padding: "8px 0", borderBottom: "1px dashed #f0f0f0", width: "100%" }}>
				<div style={{ width: "80px", flexShrink: 0, color: "#333", fontSize: "13px", fontWeight: 400, paddingTop: "2px" }}>
					{field.title as React.ReactNode}:
				</div>
				<div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
					<div>{renderTiledSelect()}</div>
					{field.fieldProps?.expandable === "multiple" && (
						<div style={{ fontSize: "12px", color: "#999", marginLeft: "12px", whiteSpace: "nowrap", paddingTop: "2px" }}>(可多选)</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div style={{ marginBottom: "8px" }}>
			<div style={{ marginBottom: "4px", fontSize: "13px", color: "#333", fontWeight: 400 }}>{field.title as React.ReactNode}</div>
			<Popover
				content={renderPanelContent()}
				trigger="click"
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open)
					if (!open && autoQuery) submit()
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

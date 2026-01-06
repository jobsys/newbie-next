/**
 * @jobsys/newbie-next
 *
 * AI-friendly React components built with Ant Design 6.1
 */

// Provider
export { NewbieProvider, useNewbieContext } from "./components/provider"
export type { NewbieProviderProps, NewbieProviderConfig, NewbieContextValue, ComponentDefaults } from "./components/provider"

// Icon
export { NewbieIcon } from "./components/icon"
export type { NewbieIconProps } from "./components/icon"

// Captcha
export { SlideVerify } from "./components/captcha"
export type { SlideVerifyProps, SlideVerifyRef, TrailPoint } from "./components/captcha"

// Upload
export { NewbieUpload } from "./components/upload/newbie-upload"
export type { NewbieUploadProps, MediaItem } from "./components/upload/newbie-upload"
export { ProFormNewbieUpload } from "./components/upload/pro-form-newbie-upload"
export type { ProFormNewbieUploadProps } from "./components/upload/pro-form-newbie-upload"

// Form (will be implemented)
// export { NewbieForm } from './components/form'
// export type { NewbieFormProps } from './components/form'

// Search
export { NewbieSearch, SearchProvider, useSearchContext } from "./components/search"
export type {
	NewbieProColumn as SearchFieldConfig,
	NewbieProColumn,
	QueryForm,
	FieldValue,
	Condition,
	NewbieSearchProps,
	SearchContextValue,
	SearchProviderProps,
} from "./components/search"

// Table (will be implemented)
// export { NewbieTable } from './components/table'
// export type { NewbieTableProps } from './components/table'

// Types
export type * from "./types"

// HTTP Client & Hooks
export * from "./utils/http"
export * from "./hooks/use-http"
export * from "./hooks/use-regex"

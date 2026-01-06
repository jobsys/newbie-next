export interface RegexRuleOptions {
	message?: string
	mode?:
		| string
		| "strict"
		| "loose"
		| "china"
		| "cn"
		| "en"
		| "english"
		| "lower"
		| "uppercase"
		| "positive"
		| "v6"
		| "ipv6"
		| "green"
		| "newEnergy"
		| "notNewEnergy"
		| "image"
		| "video"
		| "12"
	version?: string | "v1" | "v2"
	en?: boolean
	english?: boolean
	strict?: "strict" | boolean | string
}

export interface RegexRuleResult {
	pattern?: RegExp
	message?: string
}

export type RegexType =
	| "email"
	| "phone"
	| "tel"
	| "telephone"
	| "ID"
	| "id"
	| "passport"
	| "credit-code"
	| "uscc"
	| "bank-account"
	| "bank"
	| "stock"
	| "url"
	| "md5"
	| "base64"
	| "currency"
	| "money"
	| "chinese"
	| "name"
	| "decimal"
	| "number"
	| "date"
	| "time"
	| "car"
	| "plate-number"
	| "car-number"
	| "version"
	| "ip"
	| "IP"
	| "qq"
	| "wechat"
	| "alpha-numeric"
	| "numeric-alpha"
	| "alpha"
	| "username"
	| "password"
	| "zip"
	| "mac"
	| "MAC"

const PATTERNS = {
	EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	PHONE_STRICT: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
	PHONE_LOOSE: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
	TEL_STRICT: /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/,
	TEL_LOOSE: /^(?:\d{3}-)?\d{8}$|^(?:\d{4}-)?\d{7,8}$/,
	ID_V1: /^[1-9]\d{7}(?:0\d|10|11|12)(?:0[1-9]|[1-2][\d]|30|31)\d{3}$/,
	ID_V2: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
	ID_COMPAT: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
	ID_HK_MO: /^[a-zA-Z]\d{6}\([\dA]\)$/,
	ID_TW: /^[a-zA-Z][0-9]{9}$/,
	PASSPORT: /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/,
	CREDIT_CODE: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
	BANK_ACCOUNT: /^[1-9]\d{9,29}$/,
	STOCK: /^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$/,
	URL_IMAGE: /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i,
	URL_VIDEO: /^https?:\/\/(.+\/)+.+(\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i,
	URL_COMMON: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
	MD5: /^([a-f\d]{32}|[A-F\d]{32})$/,
	BASE64: /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$/i,
	CURRENCY_POSITIVE: /^\d+(,\d{3})*(\.\d{1,2})?$/,
	CURRENCY_ALL: /^-?\d+(,\d{3})*(\.\d{1,2})?$/,
	CHINESE:
		/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
	NAME_EN: /(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/,
	NAME_CN: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
	DECIMAL: /^\d+\.\d+$/,
	NUMBER: /^\d{1,}$/,
	DATE: /^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/,
	TIME_12: /^(?:1[0-2]|0?[1-9]):[0-5]\d:[0-5]\d$/,
	TIME_24: /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
	CAR_GREEN: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$/,
	CAR_NOT_GREEN:
		/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/,
	CAR_MIX:
		/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-HJ-NP-Z]{1}(?:(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/,
	VERSION: /^\d+(?:\.\d+){2}$/,
	IP_V6: /^(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))|\[(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))\](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/i,
	IP_V4: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]).){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
	QQ: /^[1-9][0-9]{4,10}$/,
	WECHAT: /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/,
	ALPHA_NUMERIC_STRICT: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
	ALPHA_NUMERIC: /^[A-Za-z0-9]+$/,
	ALPHA_LOWER: /^[a-z]+$/,
	ALPHA_UPPER: /^[A-Z]+$/,
	ALPHA: /^[a-zA-Z]+$/,
	USERNAME: /^[a-zA-Z0-9_-]{4,16}$/,
	PASSWORD: /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
	ZIP: /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/,
	MAC: /^((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}$/i,
}

/**
 * 获取常用的正则校验规则
 * @param type 校验类型
 * @param options 选项
 * @returns {RegexRuleResult}
 */
export function useRegexRule(type: RegexType, options: RegexRuleOptions = {}): RegexRuleResult {
	const rule: RegexRuleResult = {}

	switch (type) {
		case "email":
			rule.pattern = PATTERNS.EMAIL
			rule.message = options.message || "请填写正确的邮箱地址"
			break
		case "phone":
			if (options.mode === "strict") {
				rule.pattern = PATTERNS.PHONE_STRICT
			} else {
				rule.pattern = PATTERNS.PHONE_LOOSE
			}
			rule.message = options.message || "请填写正确的手机号码"
			break
		case "tel":
		case "telephone":
			if (options.strict === "strict") {
				rule.pattern = PATTERNS.TEL_STRICT
			} else {
				rule.pattern = PATTERNS.TEL_LOOSE
			}
			rule.message = options.message || "请填写正确的座机号码"
			break
		case "ID":
		case "id":
			if (!options.mode || ["china", "cn"].includes(options.mode.toLowerCase())) {
				if (options.version?.toLowerCase() === "v1") {
					rule.pattern = PATTERNS.ID_V1
				} else if (options.version?.toLowerCase() === "v2") {
					rule.pattern = PATTERNS.ID_V2
				} else {
					rule.pattern = PATTERNS.ID_COMPAT
				}
			} else if (["hk", "hongkong", "xg", "xianggang"].includes(options.mode.toLowerCase())) {
				rule.pattern = PATTERNS.ID_HK_MO
			} else if (["macau", "macao", "mo", "aomen", "am"].includes(options.mode.toLowerCase())) {
				rule.pattern = PATTERNS.ID_HK_MO
			} else if (["taiwan", "tw"].includes(options.mode.toLowerCase())) {
				rule.pattern = PATTERNS.ID_TW
			}
			rule.message = options.message || "请填写正确的证件号码"
			break
		case "passport":
			rule.pattern = PATTERNS.PASSPORT
			rule.message = options.message || "请填写正确的护照号码"
			break
		case "credit-code":
		case "uscc":
			rule.pattern = PATTERNS.CREDIT_CODE
			rule.message = options.message || "请填写正确的统一社会信用代码"
			break
		case "bank-account":
		case "bank":
			rule.pattern = PATTERNS.BANK_ACCOUNT
			rule.message = options.message || "请填写正确的银行账号"
			break
		case "stock":
			rule.pattern = PATTERNS.STOCK
			rule.message = options.message || "请填写正确的股票代码"
			break
		case "url":
			if (options.mode === "image") {
				rule.pattern = PATTERNS.URL_IMAGE
			} else if (options.mode === "video") {
				rule.pattern = PATTERNS.URL_VIDEO
			} else {
				rule.pattern = PATTERNS.URL_COMMON
			}
			rule.message = options.message || "请填写正确的链接"
			break
		case "md5":
			rule.pattern = PATTERNS.MD5
			rule.message = options.message || "请填写正确的md5值"
			break
		case "base64":
			rule.pattern = PATTERNS.BASE64
			rule.message = options.message || "请填写正确的base64值"
			break
		case "currency":
		case "money":
			if (options.mode === "positive") {
				rule.pattern = PATTERNS.CURRENCY_POSITIVE
			} else {
				rule.pattern = PATTERNS.CURRENCY_ALL
			}
			rule.message = options.message || "请填写正确的货币金额"
			break
		case "chinese":
			rule.pattern = PATTERNS.CHINESE
			rule.message = options.message || "请填写中文字符"
			break
		case "name":
			if (options.en || options.english) {
				rule.pattern = PATTERNS.NAME_EN
			} else {
				rule.pattern = PATTERNS.NAME_CN
			}
			rule.message = options.message || "请填写正确的姓名"
			break
		case "decimal":
			rule.pattern = PATTERNS.DECIMAL
			rule.message = options.message || "请填写正确的小数"
			break
		case "number":
			rule.pattern = PATTERNS.NUMBER
			rule.message = options.message || "请填写正确的数字"
			break
		case "date":
			rule.pattern = PATTERNS.DATE
			rule.message = options.message || "请填写正确的日期"
			break
		case "time":
			if (options.mode === "12") {
				rule.pattern = PATTERNS.TIME_12
			} else {
				rule.pattern = PATTERNS.TIME_24
			}
			rule.message = options.message || "请填写正确的时间"
			break
		case "car":
		case "plate-number":
		case "car-number":
			if (options.mode === "green" || options.mode === "newEnergy") {
				rule.pattern = PATTERNS.CAR_GREEN
			} else if (options.mode === "notNewEnergy") {
				rule.pattern = PATTERNS.CAR_NOT_GREEN
			} else {
				rule.pattern = PATTERNS.CAR_MIX
			}
			rule.message = options.message || "请填写正确的车牌号"
			break
		case "version":
			rule.pattern = PATTERNS.VERSION
			rule.message = options.message || "请填写正确的版本号"
			break
		case "ip":
		case "IP":
			if (options.mode === "v6" || options.mode === "ipv6") {
				rule.pattern = PATTERNS.IP_V6
			} else {
				rule.pattern = PATTERNS.IP_V4
			}
			rule.message = options.message || "请填写正确的IP地址"
			break
		case "qq":
			rule.pattern = PATTERNS.QQ
			rule.message = options.message || "请填写正确的QQ号"
			break
		case "wechat":
			rule.pattern = PATTERNS.WECHAT
			rule.message = options.message || "请填写正确的微信号"
			break
		case "alpha-numeric":
		case "numeric-alpha":
			if (options.mode === "strict") {
				rule.pattern = PATTERNS.ALPHA_NUMERIC_STRICT
			} else {
				rule.pattern = PATTERNS.ALPHA_NUMERIC
			}
			rule.message = options.message || "请填写字母与数字的组合"
			break
		case "alpha":
			if (options.mode === "lower" || options.mode === "lowercase") {
				rule.pattern = PATTERNS.ALPHA_LOWER
			} else if (options.mode === "upper" || options.mode === "uppercase") {
				rule.pattern = PATTERNS.ALPHA_UPPER
			} else {
				rule.pattern = PATTERNS.ALPHA
			}
			rule.message = options.message || "请填写正确的字母"
			break
		case "username":
			rule.pattern = PATTERNS.USERNAME
			rule.message = options.message || "请填写正确的用户名"
			break
		case "password":
			rule.pattern = PATTERNS.PASSWORD
			rule.message = options.message || "密码必须包含大小写字母、数字和特殊字符，不少于6位"
			break
		case "zip":
			rule.pattern = PATTERNS.ZIP
			rule.message = options.message || "请填写正确的邮政编码"
			break
		case "mac":
		case "MAC":
			rule.pattern = PATTERNS.MAC
			rule.message = options.message || "请填写正确的MAC地址"
			break
	}

	return rule
}

import { useRegexRule } from "../hooks/use-regex"

describe("useRegexRule", () => {
	describe("email", () => {
		const { pattern, message } = useRegexRule("email")

		it("should match valid emails", () => {
			expect(pattern?.test("test@example.com")).toBe(true)
			expect(pattern?.test("user.name@domain.co.uk")).toBe(true)
			expect(pattern?.test("user+tag@example.org")).toBe(true)
		})

		it("should not match invalid emails", () => {
			expect(pattern?.test("plainaddress")).toBe(false)
			expect(pattern?.test("@missingusername.com")).toBe(false)
		})

		it("should return default message", () => {
			expect(message).toBe("请填写正确的邮箱地址")
		})
	})

	describe("phone", () => {
		it("should match strict mode", () => {
			const { pattern } = useRegexRule("phone", { mode: "strict" })
			expect(pattern?.test("13800138000")).toBe(true)
			expect(pattern?.test("12345678901")).toBe(false) // 12 starts are usually invalid
		})

		it("should match loose mode (default)", () => {
			const { pattern } = useRegexRule("phone")
			expect(pattern?.test("13800138000")).toBe(true)
			expect(pattern?.test("19912345678")).toBe(true)
		})
	})

	describe("tel", () => {
		it("should match strict landline", () => {
			const { pattern } = useRegexRule("tel", { strict: "strict" })
			expect(pattern?.test("010-12345678")).toBe(true)
			expect(pattern?.test("12345678")).toBe(false)
		})

		it("should match loose landline", () => {
			const { pattern } = useRegexRule("tel")
			expect(pattern?.test("010-12345678")).toBe(true)
			expect(pattern?.test("12345678")).toBe(true)
		})
	})

	describe("ID card", () => {
		it("should match v2 ID", () => {
			const { pattern } = useRegexRule("ID", { version: "v2", mode: "cn" })
			// A random generated valid-looking ID structure (checksum not verified by regex usually, just structure)
			expect(pattern?.test("11010519491231002X")).toBe(true)
		})
	})

	describe("password", () => {
		const { pattern } = useRegexRule("password")
		it("should require complexity", () => {
			expect(pattern?.test("abc123456")).toBe(false) // Missing special char and uppercase
			expect(pattern?.test("Abc123456!")).toBe(true)
		})
	})

	describe("currency", () => {
		it("should match positive currency", () => {
			const { pattern } = useRegexRule("currency", { mode: "positive" })
			expect(pattern?.test("100.00")).toBe(true)
			expect(pattern?.test("-100.00")).toBe(false)
		})

		it("should match all currency", () => {
			const { pattern } = useRegexRule("currency")
			expect(pattern?.test("-100.00")).toBe(true)
			expect(pattern?.test("1,000.50")).toBe(true)
		})
	})
})

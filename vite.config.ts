/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"
import progress from "vite-plugin-progress"
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig(({ command }) => {
	const isDev = command === "serve"

	return {
		plugins: [
			react(),
			progress(),
			// Only generate types in build mode
			!isDev &&
				dts({
					insertTypesEntry: true,
					include: ["src"],
				}),
		].filter(Boolean),
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			},
		},
		// Library build config (only for production build)
		...(isDev
			? {}
			: {
					build: {
						lib: {
							entry: {
								index: resolve(__dirname, "src/index.ts"),
							},
							formats: ["es"],
						},
						rollupOptions: {
							external: [
								"react",
								"react-dom",
								"react/jsx-runtime",
								"antd",
								"@ant-design/pro-components",
								"lucide-react",
								"dayjs",
								"lodash-es",
							],
							output: {
								preserveModules: true,
								preserveModulesRoot: "src",
							},
						},
					},
				}),
		// Vitest config
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./src/test/setup.ts",
			css: true,
			coverage: {
				provider: "v8",
				reporter: ["text", "json", "html"],
				exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*", "**/playground/**"],
			},
		},
	}
})

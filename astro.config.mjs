// @ts-check

import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	output: "server",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), solidJs()],
	adapter: cloudflare({
		imageService: "compile",
		platformProxy: {
			enabled: true,
		},
	}),
});

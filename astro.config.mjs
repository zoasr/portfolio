// @ts-check

import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://zoasr.vercel.app",
	output: "server",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [icon(), solidJs(), sitemap()],
	adapter: vercel(),
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	base: "/",
	plugins: [tailwindcss(), react()],
	preview: {
		port: 8080, // Change this to your desired port
	},
	headers: {
		"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
		"Cross-Origin-Embedder-Policy": "require-corp", // Often needed with COOP for GIS
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
	},
});

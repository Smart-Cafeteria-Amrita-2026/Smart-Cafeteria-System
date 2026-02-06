/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Add src/app path
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Add src/components path
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				border: "hsl(var(--border))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				warning: "hsl(var(--warning))",
				danger: "hsl(var(--danger))",
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				breakfast: "hsl(var(--breakfast))",
				lunch: "hsl(var(--lunch))",
				snacks: "hsl(var(--snacks))",
				dinner: "hsl(var(--dinner))",
				"status-serving": "hsl(var(--status-serving))",
				"status-served": "hsl(var(--status-served))",
				"status-active": "hsl(var(--status-active))",
				"status-expired": "hsl(var(--status-expired))",
			},
		},
	},
	plugins: [],
};

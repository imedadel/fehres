// only needed if you want to purge
const purgecss = require("@fullhuman/postcss-purgecss")({
	content: ["./src/**/*.svelte", "./src/**/*.html"],
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
})

module.exports = {
	plugins: [
		require("tailwindcss"),

		// only needed if you want to purge
		...(process.env.NODE_ENV === "production" ? [purgecss] : []),
	],
}

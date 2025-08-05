/** @type {import("prettier").Config} */
const config = {
	trailingComma: 'all',
	tabWidth: 2,
	useTabs: false,
	semi: true,
	singleQuote: true,
	plugins: ['prettier-plugin-packagejson'],
	overrides: [
		{
			files: ['*.jsonc', '*.code-workspace'],
			options: {
				trailingComma: 'none',
			},
		},
	],
}

module.exports = config

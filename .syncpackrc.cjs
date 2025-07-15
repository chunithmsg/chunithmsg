// @ts-check
/** @type {import("syncpack").RcFile} */
const config = {
	indent: '\t',
	lintFormatting: false, // handled by prettier
	versionGroups: [
		{
			label: 'local packages',
			packages: ['**'],
			dependencies: ['@chunithmsg/*'],
			dependencyTypes: ['!local'], // Exclude the local package itself
			pinVersion: 'workspace:*',
		},
		{
			label: 'pin typescript for eslint',
			dependencies: ['typescript'],
			pinVersion: '5.5.4',
		},
		{
			label: `pin eslint and all it's plugins for eslint v8`,
			dependencies: [
				'eslint',
				'@types/eslint',
				'eslint-config-prettier',
				'eslint-plugin-react-hooks',
				'eslint-plugin-unused-imports',
				'@typescript-eslint/eslint-plugin',
				'@typescript-eslint/parser',
			],
			// snapTo removes it from syncpack update list, which is the main goal
			snapTo: ['@chunithmsg/eslint-config'],
		},
	],
	semverGroups: [
		{
			label: 'pin all deps',
			range: '',
			dependencies: ['**'],
			packages: ['**'],
		},
	],
}

module.exports = config

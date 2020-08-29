/*eslint-env node*/


module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				useBuiltIns: "usage", // polyfills on use
				corejs: 3, // use core-js@3
			},
		],
	],
	plugins: [
		"@babel/plugin-proposal-function-bind",
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-object-rest-spread",
		"@babel/plugin-proposal-do-expressions",
	],
};
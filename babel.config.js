/*eslint-env node*/


module.exports = api => {
	const isCLI = api.caller(caller => caller && caller.name === "@babel/cli");

	return {
		sourceRoot: "./src/",
		presets: [
			[
				"@babel/preset-env",
				{
					useBuiltIns: isCLI ? false : "usage", // polyfills on use
					corejs: isCLI ? undefined : 3, // use core-js@3,
					modules: isCLI ? false : "auto",
					targets: isCLI ? {node: true} : undefined,
				},
			],
		],
		plugins: [
			"@babel/plugin-proposal-function-bind",
			"@babel/plugin-proposal-class-properties",
			"@babel/plugin-proposal-object-rest-spread",
			"@babel/plugin-proposal-do-expressions",
			"@babel/plugin-proposal-throw-expressions",
		],
	};
};

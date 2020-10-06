/*eslint-env node*/

// const webpack = require("webpack");
const path = require("path");
const here = (uri = "") => path.resolve(__dirname, uri);

const WebpackProgressBar = require("webpack-progress-bar");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
	stats: "minimal", // For compatibility with friendly-errors-webpack-plugin
	devtool: false,
	entry: {
		index: here("src/index.js"),
	},
	resolve: {
		extensions: [
			"js",
		].map(e => `.${e}`),
	},
	plugins: [
		new WebpackProgressBar(),
		new FriendlyErrorsPlugin({}),
		new CompressionWebpackPlugin({
			test: /\.js$/i,
			exclude: /node_modules/i,
		}),
		// new BundleAnalyzerPlugin({}),
	],
	output: {
		filename: "[name].js",
		path: here("dist"),
	},
	optimization: {
		usedExports: true,
		minimize: true,
		removeEmptyChunks: true,
		mergeDuplicateChunks: true,
		concatenateModules: true,
	},
	module: {
		rules: [
			{
				test: /\.([jt]sx?|vue)/i, // js, ts, jsx, tsx, vue
				loader: "babel-loader",
				exclude: /node_modules/i,
			},
		],
	},
};

const HTMLWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

module.exports = {
	// entry 是相对于执行webpack命令所在的目录
	entry: "./index.js",
	output: {
		path: resolve(__dirname, '../dist'),
		filename: 'main.js'
	},
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader'
			}
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			filename: 'index.html',
			// 相对路径/绝对路径
			template: resolve(__dirname, '../index.html')
		})
	]
}

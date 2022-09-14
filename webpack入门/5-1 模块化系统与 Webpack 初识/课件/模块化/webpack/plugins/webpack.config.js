// webpack 会将任意文件数据作为模块进行处理
const { resolve } = require('path')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				// loader执行顺序为 下至上 右至左
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader'
				]
			},
		]
	},
	// 注册插件
	// webpack 会自动调用apply方法 把插件注册到webpack当中
	plugins: [
		// new CleanWebpackPlugin()
		new HTMLWebpackPlugin({
			filename: 'app.html',
			template: './index.html',
			title: 'My App'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	]
}

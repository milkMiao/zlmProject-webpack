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
	],
	// 启动开发服务器 但是打包后生成文件 会存到内存当中 不会写入硬盘 提高开发效率
	devServer: {
		// 端口号
		port: 8000,
		// 自动开启浏览器
		open: true,
		index: 'app.html',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				pathRewrite: {
					'^/api': ''
				}
			}
		},
		// 开启HMR
		hot: true,
		// 仅启用HMR 就算HMR处于宕机状态 live reload也不会刷新页面
		hotOnly: true
	}
}

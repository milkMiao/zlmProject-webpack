const { resolve } = require('path')

module.exports = {
	// mode 打包模式 production development none https://webpack.docschina.org/configuration/mode/
	mode: 'production',
	// 入口文件
	// 一对一
	// entry: './src/index.js',
	// 多对一
	// entry: [
	// 	'./src/index.js',
	// 	'./src/b.js'
	// ],
	// 多对多
	entry: {
		index: './src/index.js',
		b: './src/b.js'
	},
	// 输出目录
	output: {
		// 接收绝对路径
		path: resolve(__dirname, './build'),
		// filename: 'index.js'
		// 占位符 模板字符 https://webpack.docschina.org/configuration/output/#template-strings
		filename: '[name].js'
	}
}

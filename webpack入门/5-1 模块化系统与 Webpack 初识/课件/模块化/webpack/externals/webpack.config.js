const { resolve } = require('path')

module.exports = {
	entry: './index.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	externals: {
		// key 是我们需要进行外部扩展的包名 后续打包时不会将该包打包
		// value 是该库声明的全局变量 jQuery $
		jquery: '$'
	}
}

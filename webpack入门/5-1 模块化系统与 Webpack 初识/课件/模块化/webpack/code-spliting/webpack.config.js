const { resolve } = require('path')

module.exports = {
	// 最基本的代码分割
	// 多对多打包方式 会导致同一个模块打包进多个chunk
	entry: {
		// index: {
		// 	import: './index.js',
		// 	dependOn: ['axios', 'a']
		// },
		// main: {
		// 	import: './main.js',
		// 	dependOn: ['axios', 'a']
		// },
		// axios: 'axios',
		// a: './js/a.js'
		index: './index.js',
		main: './main.js',
	},
	output: {
		path: resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	// 配置runtimeChunk为single
	// webpack会帮助生成一个runtime chunk
	// 然后 他会把加载的包移到runtime中
	//
	optimization: {
	// 	runtimeChunk: 'single'
		splitChunks: {
			// async 表示只从异步加载模块中进行拆分
			// initial 表示从入门口模块进行拆分
			// all 表示同时配置两种情况
			chunks: 'all'
		}
	}
}

// webpack 会将任意文件数据作为模块进行处理
const { resolve } = require('path')

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	// 输出目录
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
	// 配置loader解析路径
	resolveLoader: {
		modules: ['node_modules', resolve(__dirname, './loaders')]
	},
	// 当webpack遇到不能解析的模块时 webpack会找到module对象下面的rules 去匹配对应规则
	// 如果有对应规则匹配时 我们就使用对应的loader去解析
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
			{
				test: /\.(png|gif|jpe?g)$/,
				// loader配置
				use: {
					loader: 'file-loader',
					options: {
						// 打包后文件名
						name: '[name]_[contenthash].[ext]',
						// 打包后存放目录 相对于打包文件夹 dist
						outputPath: './images',
						// 打包后引入的文件url 相对于config文件
						publicPath: './dist/images'
						// url-loader limit number size 图片文件小于此值
						// url-loader 不会对文件进行打包 转为base64
					}
				}
			},
			{
				test: /\.css$/,
				// loader执行顺序为 下至上 右至左
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							// 启用url()
							url: true,
							// 启用@import
							import: true,
							// 启用sourcemap
							sourceMap: false
						}
					}
				]
			},
			{
				test: /\.doc$/,
				use: 'doc-loader'
			}
		]
	}
}

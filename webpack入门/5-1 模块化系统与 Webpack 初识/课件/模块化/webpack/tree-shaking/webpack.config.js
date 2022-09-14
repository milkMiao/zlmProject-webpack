const { resolve } = require('path')

module.exports = {
	mode: 'production',
	entry: './index.js',
	output: {
		path: resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	optimization: {
		usedExports: true
	}
}

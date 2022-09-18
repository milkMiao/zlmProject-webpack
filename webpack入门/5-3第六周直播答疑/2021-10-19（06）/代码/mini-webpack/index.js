const webpack = require('./lib/index');

/**
 * 为什么要打包？
 *      解决模块系统的兼容问题
 *          模块之间的依赖
 *          模块之间隔离
 * 打包成什么样？
 *      浏览器识别的能运行的代码
 */


webpack({
    entry: './src/entry.js',
    module: {
        rules: [
            {
                test: /.txt$/,
                use: txtLoader
            }
        ]
    }
});

function txtLoader(source) {
    const json = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    return `module.exports = ${json};`;
}



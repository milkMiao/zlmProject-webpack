// commonjs node
// module.exports 导出模块
// require(path) 引入模块
// 使用exports[property]导出模块时 引入该模块时 会引入一个对象 对象当中包含着对应的属性
const a = require('./a.js')
console.log(a);
console.log(module);
a()

// 1. 传入依赖数组方式引入
define(['a'], (a) => {
	console.log(a);
	a.a()
})

// 2. 通过require实现类似cjs规范引入
define((require) => {
	const a = require('a')
	console.log(a);
	a.a()
})

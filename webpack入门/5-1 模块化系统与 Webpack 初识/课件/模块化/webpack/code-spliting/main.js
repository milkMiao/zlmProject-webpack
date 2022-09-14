// import a from './js/a.js'
// import axios from 'axios'
// 异步加载 按需加载
// 使用import()函数时 会返回一个promise对象
// 内联注释 需要按照json格式编写
// preload 预加载 prefetch 预获取 其实是针对于动态导入资源加载优化
// 当我们配置preload预加载时 被配置的模块会在父chunk加载时并行加载该模块
// 当我们配置prefetch预获取时 被配置的模块会在浏览器闲置时 也就是未来某个时刻下载模块
// import(/* webpackChunkName: 'axios' */'axios')
// 	.then(res => {
// 		// res接收模块对象 他下面的default属性 就是我们所要接收的模块
// 		console.log(res);
// 	})

// console.log(axios);

window.onclick = () => {
	import(/* webpackChunkName: 'a' */'./js/a.js').then(res => {
		setTimeout(() => {
			res.default()
		}, 2000)
	})
}

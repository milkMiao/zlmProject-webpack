export function b() {
	console.log('这里是b文件中的b方法')
}

// import a from './a.js'
import { a as A } from './a.js'
A()

// function b() {
// 	console.log('这里是b文件')
// }
//
// function a() {
// 	console.log('这是b文件当中的a方法')
// }
const objB = {
	b() {
		console.log('这里是b文件')
	},
	a() {
	console.log('这是b文件当中的a方法')
}
}
objA.a()
objB.a()

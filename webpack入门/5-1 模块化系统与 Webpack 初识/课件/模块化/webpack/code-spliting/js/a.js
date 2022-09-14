export default function a() {
	console.log('这里是a模块')
	import(/* webpackChunkName: 'b', webpackPrefetch: true */ './b.js').then(res => {
		console.log(res.default);})
}

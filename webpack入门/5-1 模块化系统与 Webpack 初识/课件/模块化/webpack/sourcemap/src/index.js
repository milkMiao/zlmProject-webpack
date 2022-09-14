import './index.css'
import a from './a.js'

const input = document.querySelector('input')
const button = document.querySelector('button')

let value;

input.oninput = ({target: {value: inputValue}}) => {
	value = inputValue;
}

button.onclick = () => {
	console.log(value);
	console.lg(a)
}
// HMR 热模块替换

// 修改代码 -> webpack -> websocket -> 浏览器 -> webpack-dev-server -> jsonp -> 新模块替换旧模块

// HMR 处于宕机状态 live reload

// 业务代码当中是并不知道模块更新的

// module.hot 启动热替换
if (module.hot) {
	module.hot.accept('./a.js', () => {
		button.onclick = () => {
			console.log(value);
			console.log(a)
		}
	})
}

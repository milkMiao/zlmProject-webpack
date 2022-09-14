import './index.css'
console.log(11)


import axios from 'axios'

// axios.get('/api/data')
// 	.then(({data}) => {
// 		console.log(data);
// 	})
// axios.get('/api/data2')
// 	.then(({data}) => {
// 		console.log(data);
// 	})

const input = document.querySelector('input')
const button = document.querySelector('button')

let value;

input.oninput = ({target: {value: inputValue}}) => {
	value = inputValue;
}

button.onclick = () => {
	console.log(value);
	console.log(1111)
}

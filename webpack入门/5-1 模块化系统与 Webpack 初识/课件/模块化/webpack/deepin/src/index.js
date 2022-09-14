import indexTxt from './index.txt'
import logo from './logo.png'
import indexCSS from './index.css'
import indexDoc from './doc.doc'

console.log(indexTxt);
// 初始化 -> 开始编译 -> 确认入口 -> 编译模块 -> 整合依赖输出
// loader 解析器


const img = new Image();
img.src = logo;
document.body.appendChild(img);

document.body.innerHTML += indexDoc


// const style = document.createElement('style')
// style.innerHTML = indexCSS.toString()
// document.head.appendChild(style)

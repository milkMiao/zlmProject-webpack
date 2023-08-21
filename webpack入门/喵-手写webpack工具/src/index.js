// @babel/parser : 用于分析通过 fs.readFileSync  读取的文件内容，并返回 AST (抽象语法树) ；
// @babel/traverse : 用于遍历 AST, 获取必要的数据；
// @babel/core : babel 核心模块，提供 transformFromAst 方法，用于将 AST 转化为浏览器可运行的代码；
// @babel/preset-env : 将转换后代码转化成 ES5 代码；

import info from "./info";
console.log("index.js-----文件,打印info.js文件信息", info);

/**
 * 手写 Webpack 的核心是实现以下三个方法:
 * 1、createAssets : 收集和处理文件的代码；
 * 2、createGraph ：根据入口文件，返回所有文件依赖图；
 * 3、bundle : 根据依赖图整个代码并输出；
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default; // 由于 traverse 采用的 ES Module 导出，我们通过 requier 引入的话就加个 .default
const babel = require("@babel/core");

let moduleId = 0;
//A、实现createAssets函数【createAssets 方法中“文件读取”和“AST(抽象语法树)转换”操作】
function createAssets(filename) {
  //1、第一步：读取通过入口文件，并转为 AST
  const content = fs.readFileSync(filename, "utf-8");
  const AST = parser.parse(content, {
    sourceType: "module",
  });

  //2、第二步：收集每个模块的依赖
  const dependencies = []; // 用于收集文件依赖的路径
  //通过 traverse 提供的操作 AST 的方法，获取每个节点的依赖路径
  traverse(AST, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  //3、第三步：将 AST 转换为浏览器可运行代码 【通过 AST 将 ES6 代码转换成 ES5 代码】
  const { code } = babel.transformFromAstSync(AST, null, {
    presets: ["@babel/preset-env"],
  });

  let id = moduleId++; //设置当前处理的模块ID
  let obj = {
    id, //模块ID
    filename, //入口文件的路径
    code, //浏览器可执行代码
    dependencies, //文件依赖的路径数组
  };
  // console.log("obj-----", obj);
  return obj;
}
// createAssets("./src/index.js");

//B、实现createGraph函数 【我们将递归所有依赖模块，循环分析每个依赖模块依赖，生成一份依赖图谱】
/**
 * 首先通过 createAssets() 函数--读取入口文件的内容，并作为依赖关系的队列（依赖图谱） queue 数组的第一项，
 * 接着遍历依赖图谱 queue 每一项，再遍历将每一项中的依赖 dependencies 依赖数组，
 * 将依赖中的每一项拼接成依赖的绝对路径（absolutePath ），
 * 作为 createAssets() 函数调用的参数，递归去遍历所有子节点的文件，并将结果都保存在依赖图谱 queue 中。
 */
function createGraph(entry) {
  const mainAsset = createAssets(entry); //获取入口文件的内容
  const queue = [mainAsset]; // 入口文件的结果作为第一项

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename); //path.dirname：Node.js中的一个内置模块，它用于获取文件路径的目录名；

    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath); // 转换文件路径为绝对路径 [src/info.js，src/consts.js]
      const child = createAssets(absolutePath); //
      asset.mapping[relativePath] = child.id; // 保存模块ID

      queue.push(child); // 递归去遍历所有子节点的文件
      // console.log("queue----", queue);
    });
  }
  return queue;
}

const graph = createGraph("./src/index.js");
// console.log("graph-----", graph); //这个依赖图谱，包含了所有文件模块的依赖，以及模块的代码内容。

//C、实现bundle函数
function bundle(graph) {
  // 在 modules 中每一项的值中，下标为 0 的元素是个函数，接收三个参数 require / module / exports ，为什么会需要这三个参数呢？
  // 原因是：构建工具无法判断是否支持require / module / exports 这三种模块方法，
  //        所以需要自己实现（后面步骤会实现），然后方法内的 code 才能正常执行。
  let modules = "";
  graph.forEach((item) => {
    modules += `
          ${item.id}: [
              function (require, module, exports){
                  ${item.code}
              },
              ${JSON.stringify(item.mapping)}
          ],
      `;
  });
  // console.log("modules----", modules);

  //1、最终 bundle 函数返回值是一个字符串，包含一个自执行函数（IIFE），
  //   其中函数参数是一个对象， key 为 modules ， value 为前面拼接好的 modules 字符串，即 {modules: modules字符串} 。
  //2、在这个自执行函数中，实现了 require 方法，接收一个 id 作为参数，在方法内部，
  //   分别实现了 localRequire / module / modules.exports 三个方法，并作为参数，传到 modules[id] 中的 fn 方法中，
  //   最后初始化 require() 函数（require(0);）。
  return `
    (function(modules){
        function require(id){
            const [fn, mapping] = modules[id];
            function localRequire(relativePath){
                return require(mapping[relativePath]);
            }
            const module = {
                exports: {}
            }
            fn(localRequire, module, module.exports);
            return module.exports;
        }
        require(0);
    })({${modules}})
  `;
}

//执行代码
const result = bundle(graph);
// console.log("result------", result);

//那么如何让这些代码执行呢？用 eval() 方法咯
eval(result);

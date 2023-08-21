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
 * 首先通过 createAssets() 函数读取入口文件的内容，并作为依赖关系的队列（依赖图谱） queue 数组的第一项，
 * 接着遍历依赖图谱 queue 每一项，再遍历将每一项中的依赖 dependencies 依赖数组，
 * 将依赖中的每一项拼接成依赖的绝对路径（absolutePath ），
 * 作为 createAssets() 函数调用的参数，递归去遍历所有子节点的文件，并将结果都保存在依赖图谱 queue 中。
 */
function createGraph(entry) {
  const mainAsset = createAssets(entry); //获取入口文件的内容
  const queue = [mainAsset]; // 入口文件的结果作为第一项
  console.log("queue-------", queue);
  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath); // 转换文件路径为绝对路径

      const child = createAssets(absolutePath);

      asset.mapping[relativePath] = child.id; // 保存模块ID

      queue.push(child); // 递归去遍历所有子节点的文件
    });
  }
  return queue;
}

const graph = createGraph("./src/index.js");
console.log("graph-----", graph); //这个依赖图谱，包含了所有文件模块的依赖，以及模块的代码内容。

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
            fn(localRequire, module, module.exports);å
            return module.exports;
        }
        require(0);
    })({${modules}})
  åå`;
}

//执行代码
const result = bundle(graph);
// console.log(result);

//那么如何让这些代码执行呢？用 eval() 方法咯
// eval(result);

/**
 * A、实现createAssets函数：
 * 1、第一步
 * 通过 fs.readFileSync() 方法，以【同步方式】读取指定路径下的文件流，
 * 并通过 parser 依赖包提供的 parse() 方法，
 * 将读取到的文件流 buffer 转换为浏览器可以认识的代码（AST）
 *
 * 注意：
 * 另外需要注意，这里我们声明了一个 moduleId 变量，来区分当前操作的模块。
 * 在这里，不仅将读取到的文件流 buffer 转换为 AST 的同时，也将 ES6 代码转换为 ES5 代码了。
 *
 * 2、第二步
 * 接下来声明 dependencies 变量来保存收集到的文件依赖路径，
 * 通过 traverse（） 方法遍历 ast，获取每个节点依赖路径，并 push 进 dependencies 数组中。
 *
 * 3、第三步
 * 将 AST 转换为浏览器可运行代码
 * 在收集依赖的同时，我们可以将 AST 代码转换为浏览器可运行代码，这就需要使用到 babel ，
 * 这个万能的小家伙，为我们提供了非常好用的 transformFromAstSync() 方法，同步的将 AST 转换为浏览器可运行代码：
 *
 *
 * B、实现 createGraph 函数
 * 在 createGraph() 函数中，我们将递归所有依赖模块，循环分析每个依赖模块依赖，生成一份依赖图谱。
 * 为了方便测试，我们补充下 consts.js 和 info.js 文件的代码，增加一些依赖关系；
 * src/consts.js 【export const company = "平安";】
 * src/info.js   【import { company } from "./consts.js";export default `你好，${company}`; 】
 *
 * 首先通过 createAssets() 函数读取入口文件的内容，并作为依赖关系的队列（依赖图谱） queue 数组的第一项，
 * 接着遍历依赖图谱 queue 每一项，再遍历将每一项中的依赖 dependencies 依赖数组，
 * 将依赖中的每一项拼接成依赖的绝对路径（absolutePath ），
 * 作为 createAssets() 函数调用的参数，递归去遍历所有子节点的文件，并将结果都保存在依赖图谱 queue 中。
 *
 * 注：
 * mapping 对象是用来保存文件的相对路径和模块 ID 的对应关系，
 * 在 mapping 对象中，我们使用依赖文件的相对路径作为 key ，来存储保存模块 ID；
 *
 * C、实现 bundle() 函数，将结果输出即可
 * 从前面介绍，我们知道，函数 createGraph() 会返回一个
 * 包含每个依赖相关信息（id / filename / code / dependencies）的依赖图谱 queue，这一步就将使用到它了。
 * 在 bundle() 函数中，接收一个依赖图谱 graph 作为参数，最后输出编译后的结果。
 *
 * 1、第一步：读取所有模块信息
 * 我们首先声明一个变量 modules，值为字符串类型，
 * 然后对参数 graph 进行遍历，将每一项中的 id 属性作为 key ，
 * 值为一个数组，包括一个用来执行代码 code 的方法和序列化后的 mapping，最后拼接到 modules 中。
 *
 * 2、第二步：返回最终结果
 * 接着，我们来实现 bundle() 函数返回值的处理：
 *
 *
 * D、执行代码
 * const graph = createGraph("./src/index.js");
 * const result = bundle(graph);
 * console.log(result)
 *
 * 那么如何让这些代码执行呢？用 eval() 方法咯：
 * eval(result);
 */

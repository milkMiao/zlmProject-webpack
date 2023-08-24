## 插件说明
- @babel/parser : 用于分析通过 fs.readFileSync  读取的文件内容，并返回 AST (抽象语法树) ；
- @babel/traverse : 用于遍历 AST, 获取必要的数据；
- @babel/core : babel 核心模块，提供 transformFromAst 方法，用于将 AST 转化为浏览器可运行的代码；
- @babel/preset-env : 将转换后代码转化成 ES5 代码；
  
## procresson流程图
- 参考链接：https://www.processon.com/mindmap/62f5b5fe079129071a29e585

## 手写webpack工具的三个函数实现说明
### A、实现createAssets函数：
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

### B、实现 createGraph 函数：
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


### C、实现 bundle() 函数，将结果输出即可：
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
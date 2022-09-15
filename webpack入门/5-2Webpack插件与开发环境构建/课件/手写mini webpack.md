## 手写mini webpack

### fs(file system) 文件系统

- fs.existSync(path) 判断路径对应文件/目录是否存在
- fs.mkdirSync(path, option?) 在对应路径创建文件夹
  - 当文件夹已经存在时报错 如果设置option当中的recursive属性则强制写入
- fs.writeFile(path, data, option?, callback?) 写入文件 
  - 写入路径的目录必须存在 否则报错
  - 当被写入文件已经存在时 覆盖源文件
  - callback为写入完成的回调 接收err参数

### babel js编译器

- @babel/parser 用于通过代码创建对应ast
- @babel/traverse 用于遍历ast
  - 此库接收的traverse应为require(@babel/traverse).default
- @babel/core babel的核心库
  - 使用其中的transformFromAst 从ast转义为代码
  - 需使用presets预设环境保证代码由es最新语法编译为es5代码
- @babel/preset-env babel预置环境库
  - 使用此库可保证使用es最新语法

### 解析依赖信息

```js
// 解析依赖信息
const createAsset = (filePath) => {
	// 读取文件方法(同步)
	const content = fs.readFileSync(filePath, 'utf-8')
	// console.log(content);
	// 创建文件对应的ast 需要设置sourceType
	const ast = babelParser.parse(content, {
		// 解析对应esm模块代码
		sourceType: "module"
	})

	// 收集依赖
	const dependencies = []

	// 遍历ast语法树的方法
	traverse(ast, {
		// 当我们读取到的ast当中 每有一个import 就会执行一次此方法
		ImportDeclaration(specifiers) {
			// specifiers ImportDeclaration 结构描述对象
			// console.log(specifiers)
			// specifiers.node ImportDeclaration 节点对象
			// specifiers.node.specifiers => type
				// ImportDefaultSpecifier import a from ''
				// ImportSpecifier import { as } from ''
				// ImportNamespaceSpecifier import * as a from ''
			// console.log(specifiers.node)
			// specifiers.node.source.value 获取当前import 节点对应的依赖路径
			dependencies.push(specifiers.node.source.value)
		}
	})
	// console.log(dependencies);

	// 将ast编译为浏览器可识别代码
	// 三个参数 ast code? options?
	// 从babel6 开始 此方法 transformFromAst 表现为同步方法
	// 但是为了向后兼容 此方法如果不传入任何回调时 会表现为同步
	// 返回对象中的code属性 是ast通过预置环境转义后的代码
	const { code } = transformFromAst(ast, null, {
		presets: ["@babel/preset-env"]
	})

	return {
		id: id++,
		filePath,
		code,
		dependencies
	}
}
```

### 创建依赖图

```js
const createGraph = (entry) => {
	// 获取主入口依赖信息
	const mainAsset = createAsset(entry)
	// 依赖信息队列
	const queue = [mainAsset]

	// 遍历队列
	for (const asset of queue) {
		// 创建依赖信息映射关系
		asset.mapping = {};
		// 遍历依赖信息当中的依赖
		const _dirname = dirname(asset.filePath)
		asset.dependencies.forEach(relativePath => {
			// join方法与resolve方法不同的地方是 join方法会直接解析出当前路径下对应的路径
			// 而resolve方法 会直接解析出对应的绝对路径
			const dependPath = `./${join(_dirname, relativePath)}`
			// 迭代依赖
			const child = createAsset(dependPath)
			asset.mapping[relativePath] = child.id

			queue.push(child)
		})
	}
	return queue
}
```

### 创建打包方法

```js
const graph = createGraph(entry)

const bundle = (graph) => {
	// 1. 需要处理每个依赖信息之间的作用域问题
	// 2. 需要实现 require 方法
	// 3. 需要处理 cjs 规范

	// 模块化 对象 函数返回值 => 伪造作用域
	// 具名函数 无法保证函数名不会和模块当中的函数名冲突
	// 自执行函数 无法保证可以正确手动调用对应模块函数
	// 对象 + 函数返回值

	// { , , , }
	const modules = graph.reduce((o, i) => {
		const moduleCode = `
			${i.id}: [
				function(require, module, exports) {
					${i.code}
				},
				${JSON.stringify(i.mapping)}
			],
		`
		return o + '\n' + moduleCode
	}, '')

	const result = `
		(function(modules) {
			function require(id) {
				const [fn, mapping] = modules[id]
				const module = { exports: {} }
				function innerRequire(path) {
					return require(mapping[path])
				}
				fn(innerRequire, module, module.exports)
				return module.exports
			}
			require(0)
		})({${modules}})
	`

	// 写入文件 路径 内容data
	// 1. 判断目录是否存在
	const isExist = fs.existsSync(output.path)
	// 2. options
	!isExist && fs.mkdirSync(output.path)
	// fs.writeFileSync 传入的路径 必须存在 否则报错
	// 当传入路径的文件 已经存在时 会直接覆盖文件
	fs.writeFile(resolve(output.path, output.filename), result, (err) => {
		if (err) throw err;
		console.log('打包完成')
	})
}

bundle(graph)
```


初始化 => 开始编译 => 确认入口 => 生成对应依赖语法树 => 整合依赖输出

babel
- @babel/core babel核心 transformFromAst 从ast语法树编译成代码
- @babel/parser parser 转换器 用于将文件内容转义成ast语法树
- @babel/traverse 帮助我们分析ast当中的模块依赖
- @babel/preset-env 预置环境 可以让我们使用es最新语法

fs (filesystem) 文件系统
path 路径模块

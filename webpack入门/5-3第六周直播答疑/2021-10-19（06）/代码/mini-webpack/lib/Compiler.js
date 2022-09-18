const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');
const Watchpack = require('watchpack');

let ID = 0;

class Compiler {
    constructor(configs) {
        this.entry = configs.entry;
        this.output = configs.output;
        this.rules = (configs.module || {}).rules || [];
        this.modules = [];
    }

    watch() {
        const wp = new Watchpack();
        wp.watch({
            directories: ['./src/'],
        });
        wp.on('change', (filePath, mtime, explanation) => {
            this.run();
        });
        this.run();
    }

    run() {
        this.createModule(this.entry);
        this.handleDependencies();
        const assets = this.generate();
        this.outputAssets(assets);
    }

    /**
     * 创建模块信息
     */
    createModule(modulePath) {
        // 解析模块信息，并存入 modules 数组
        const module = this.parse(modulePath);
        this.modules.push(module);
        return module;
    }

    /**
     * 处理所有模块依赖
     */
    handleDependencies() {
        for (const module of this.modules) {
            module.mapping = {};
            const dirname = path.dirname(module.filename);

            // 解析依赖模块
            module.dependencies.forEach((dep) => {
                const absolutePath = path.join(dirname, dep);
                const childModule = this.createModule(absolutePath);
                module.mapping[dep] = childModule.id;
            });
        }
    }

    /**
     * 生成输出代码
     */
    generate() {
        // module bundle code
        let assetContent = '';

        // 循环 graph 生成 bundle
        this.modules.forEach((module) => {
            assetContent += `${module.id}: [
function (require, module, exports) { ${module.code} },
${JSON.stringify(module.mapping)},
],`;
        });

        // bundle 主体内容
        return `(function(modules) {
    function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports); 
        return module.exports;
      }
      require(0);
})({ ${assetContent} })`;
    }

    /**
     * 解析
     */
    parse(filename) {
        // 获取模块文件内容
        let content = fs.readFileSync(filename, 'utf-8');

        // Loader 解析
        const loaders = this.getLoaders(filename);
        content = loaders.reverse().reduce((currentContent, loader) => {
            return loader.call(this, currentContent);
        }, content);
        // console.log(content)

        // 解析代码内容为 ast: https://astexplorer.net
        const ast = parser.parse(content, {
            sourceType: 'module',
        });

        // 提取依赖(import)
        const dependencies = [];
        traverse(ast, {
            ImportDeclaration({ node }) {
                dependencies.push(node.source.value);
            },
        });

        // 生成目标代码
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env'],
        });

        return {
            id: ID++,
            filename,
            ast,
            dependencies,
            code,
        };
    }

    getLoaders(filename) {
        return this.rules
            .filter((r) => r.test.test(filename))
            .map((r) => r.use);
    }

    /**
     * 输出
     */
    outputAssets(result) {
        // 写入文件
        const outFile = './dist/bundle.js';
        try {
            fs.accessSync('./dist');
        } catch (e) {
            fs.mkdirSync('./dist');
        }
        fs.createWriteStream(outFile, { encoding: 'utf-8' }).write(result);
        console.log(`编译完成`);
    }
}

module.exports = Compiler;

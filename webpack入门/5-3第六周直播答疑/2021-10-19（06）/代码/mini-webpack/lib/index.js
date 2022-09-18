const Compiler = require('./Compiler');

module.exports = function miniWebpack(configs) {
    const compiler = new Compiler(configs);

    compiler.run();

    // compiler.watch();

    // console.dir(compiler, {
    //     depth: 5,
    // });
};

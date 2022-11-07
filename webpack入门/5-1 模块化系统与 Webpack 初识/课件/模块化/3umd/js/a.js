(function M(root, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {
		// Node, CommonJS-like
		module.exports = factory();
	} else if (typeof define === "function" && define.amd) {
		// AMD 模块环境下
		define(factory);
	}
}(this, function () { // $ 要导入的外部依赖模块
	function sayHi() {
		console.log('hi')
	}

	// 模块导出数据
	return {
		sayHi
	}
}));

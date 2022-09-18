(function (modules) {
    function require(id) {
        const [fn, mapping] = modules[id];
        // fn => entry.js mapping = {"./message.js": 1, "./content.txt": 2}

        function localRequire(name) {
            return require(mapping["./message.js"]);
        }

        const module = {exports: {}};
        fn(localRequire, module, module.exports);
        return module.exports;
    }

    require(0);
})({
    0: [
        function (require, module, exports) {
            "use strict";

            var _message = _interopRequireDefault(require("./message.js"));

            var _content = _interopRequireDefault(require("./content.txt"));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {"default": obj};
            }

            console.log(_message["default"]);
            console.log(_content["default"]);
        },
        {"./message.js": 1, "./content.txt": 2},
    ], 1: [
        function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;

            var _name = require("./name.js");

            var _default = "Hello ".concat(_name.name, "!");

            exports["default"] = _default;
        },
        {"./name.js": 3},
    ], 2: [
        function (require, module, exports) {
            "use strict";

            module.exports = "基于 Javascript 的模块系统\n";
        },
        {},
    ], 3: [
        function (require, module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.name = void 0;
            var name = 'World';
            exports.name = name;
        },
        {},
    ],
})

import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { CtlXtermDefault } from './CtlDefaultValue';
import { parseYvanPropChangeVJson } from './CtlUtils';
import webix from 'webix';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
webix.protoUI({
    name: 'xterm',
    defaults: {},
    $init: function (config) {
        this._domid = webix.uid();
        this.$view.innerHTML = "<div id='" + this._domid + "' style='width:100%;height:100%;'></div>";
        this.$ready.push(this._ready);
        _.extend(this.config, config);
        if (config.on && typeof config.on.onInited === 'function') {
            config.on.onInited.call(this);
        }
    },
    _ready: function () {
        var _this = this;
        var term = new Terminal();
        var fitAddon = new FitAddon();
        _.defer(function () {
            term.loadAddon(fitAddon);
            term.open(_this.$view.firstChild);
            fitAddon.fit();
            _this._term = term;
            _this._fitAddon = fitAddon;
        });
    },
    _set_inner_size: function () {
        if (!this._term || !this.$width)
            return;
        this._updateScrollSize();
        // this._editor.scrollTo(0, 0) //force repaint, mandatory for IE
    },
    _updateScrollSize: function () {
        var box = this._term.element;
        var height = (this.$height || 0) + 'px';
        box.style.height = height;
        box.style.width = (this.$width || 0) + 'px';
        if (this._fitAddon) {
            this._fitAddon.fit();
        }
    },
    $setSize: function (x, y) {
        var _this = this;
        if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
            _.defer(function () {
                _this._set_inner_size();
            });
        }
    }
}, webix.ui.view);
var CtlXterm = /** @class */ (function (_super) {
    __extends(CtlXterm, _super);
    function CtlXterm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlXterm.create = function (module, vjson) {
        var that = new CtlXterm(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlXtermDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp);
        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited: function () {
                    that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                },
                onAfterDelete: function () {
                    that.removeHandle();
                }
            }
        });
        return that;
    };
    Object.defineProperty(CtlXterm.prototype, "term", {
        /**
         * 获取终端
         */
        get: function () {
            return this._webix._term;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlXterm.prototype, "fitAddon", {
        /**
         * 获取填充插件
         */
        get: function () {
            return this._webix._fitAddon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlXterm.prototype, "xtermWidth", {
        get: function () {
            return this._webix.$width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlXterm.prototype, "xtermHeight", {
        get: function () {
            return this._webix.$height;
        },
        enumerable: true,
        configurable: true
    });
    return CtlXterm;
}(CtlBase));
export { CtlXterm };
//# sourceMappingURL=CtlXterm.js.map
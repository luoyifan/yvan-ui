import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { CtlConsoleLogDefault } from './CtlDefaultValue';
import { parseYvanPropChangeVJson } from './CtlUtils';
import webix from 'webix';
webix.protoUI({
    name: 'xconsolelog',
    defaults: {},
    $init: function (config) {
        this._domid = webix.uid();
        this.$view.innerHTML = "<div id='" + this._domid + "' class=\"vc-log\"></div>";
        this.$ready.push(this._ready);
        _.extend(this.config, config);
        if (config.on && typeof config.on.onInited === 'function') {
            config.on.onInited.call(this);
        }
    },
    _ready: function () {
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
    },
    $setSize: function (x, y) {
        if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
            this._set_inner_size();
        }
    }
}, webix.ui.view);
var CtlConsoleLog = /** @class */ (function (_super) {
    __extends(CtlConsoleLog, _super);
    function CtlConsoleLog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._realHtml = new Array();
        _this.realRender = _.debounce(function () {
            $(_this._webix.$view).find('.vc-log').append(_this._realHtml.join(''));
            _this._realHtml = [];
        });
        return _this;
    }
    CtlConsoleLog.create = function (module, vjson) {
        var that = new CtlConsoleLog(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlConsoleLogDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp);
        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited: function () {
                    var _this = this;
                    that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                    _.defer(function () {
                        $(_this.$view).on('click', '.vc-fold', function (e) {
                            that.vcfoldclick(this);
                        });
                    });
                },
                onAfterDelete: function () {
                    that.removeHandle();
                }
            }
        });
        return that;
    };
    /**
     * @param logs 需要打印的json
     */
    CtlConsoleLog.prototype.printLog = function (logs) {
        var logHtml = '<div class="vc-item">';
        if (!logs) {
            logHtml += '<div><i class="vc-code-string">undefined</i></div>';
        }
        else {
            logHtml += this.log2html(logs);
        }
        logHtml += "</div>";
        this.renderDom(logHtml);
    };
    CtlConsoleLog.prototype.renderDom = function (domHtml) {
        // console.log(domHtml)
        // var originDom;
        // for (let index = 0; index < this._webix.$view.children.length; index++) {
        //   const element = this._webix.$view.children[index];
        //   if (element.classList.contains("vc-log")) {
        //     originDom = element;
        //   }
        // }
        // var originHtml = originDom.innerHTML;
        // var newHtml = originHtml + domHtml;
        // originDom.innerHTML = newHtml;
        // const that = this;
        this._realHtml.push(domHtml);
        this.realRender();
    };
    /**
      * 递归生成html
      */
    CtlConsoleLog.prototype.log2html = function (params) {
        if (this.isArray(params) || this.isObject(params)) {
            return this.obj2html(params);
        }
        else if (this.isNumber(params) || this.isBoolean(params)) {
            return '<div><i class="vc-code-number">' + params + '</i></div>';
        }
        else {
            return '<div><i class="vc-code-string">"' + params.toString() + '"</i></div>';
        }
    };
    CtlConsoleLog.prototype.obj2html = function (params, title) {
        var outer = '';
        var json = this.JSONStringify(params);
        var preview = json.substr(0, 36);
        outer = this.getObjName(params);
        if (json.length > 36) {
            preview += '...';
        }
        outer += ' ' + preview;
        var obj2htmlContent;
        if (title) {
            obj2htmlContent = '<div class="vc-fold">\
      <div><i class="vc-code-key">' +
                title + '</i>:' +
                '<i class="vc-fold-outer">' +
                outer +
                '</i></div>\
      </div> \
      <div class="vc-fold-content vc-hidden">';
        }
        else {
            obj2htmlContent = '<div class="vc-fold">\
      <i class="vc-fold-outer">' +
                outer +
                '</i> \
      </div> \
      <div class="vc-fold-content vc-hidden">';
        }
        if (this.isObject(params)) {
            var objKeys = this.getObjAllKeys(params);
            for (var i = 0; i < objKeys.length; i++) {
                var val = params[objKeys[i]];
                if (this.isObject(val) || this.isArray(val)) {
                    obj2htmlContent += '<div>' + this.obj2html(val, objKeys[i]) + '</div>';
                }
                else if (this.isNumber(val) || this.isBoolean(val)) {
                    obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-number">' + val + '</i></div>';
                }
                else {
                    obj2htmlContent += '<div><i class="vc-code-key">' + objKeys[i] + '</i>: <i class="vc-code-string">"' + val + '"</i></div>';
                }
            }
        }
        else if (this.isArray(params)) {
            for (var i = 0; i < params.length; i++) {
                obj2htmlContent += '<div>' + this.obj2html(params[i]) + '</div>';
            }
        }
        obj2htmlContent += '</div>';
        return obj2htmlContent;
    };
    /**
     * div打开关闭
     */
    CtlConsoleLog.prototype.vcfoldclick = function (params) {
        var vcFoldElements = params.parentElement.children;
        var vcFoldContent = vcFoldElements[vcFoldElements.length - 1];
        if (vcFoldContent.classList.contains("vc-hidden")) {
            vcFoldContent.classList.remove("vc-hidden");
        }
        else {
            vcFoldContent.classList.add("vc-hidden");
        }
    };
    /**
   * 搜索并打开div
   */
    CtlConsoleLog.prototype.searchText = function (inputValue) {
        var items;
        for (var index = 0; index < this._webix.$view.children.length; index++) {
            var element = this._webix.$view.children[index];
            if (element.classList.contains("vc-log")) {
                items = element;
            }
        }
        this.removeSelected(items);
        if (!inputValue) {
            return;
        }
        this.itemContainsText(items, inputValue);
    };
    CtlConsoleLog.prototype.itemContainsText = function (params, inputValue) {
        for (var i = 0; i < params.children.length; i++) {
            var item = params.children[i];
            if (item.innerHTML.indexOf(inputValue) !== -1) {
                if (item.classList.contains("vc-fold-content")) {
                    item.classList.remove("vc-hidden");
                }
                if (item.classList.contains("vc-code-key") ||
                    item.classList.contains("vc-code-string") ||
                    item.classList.contains("vc-code-number") ||
                    item.classList.contains("vc-code-boolean")) {
                    item.classList.add("vc-code-string-selected");
                }
                this.itemContainsText(item, inputValue);
            }
        }
    };
    CtlConsoleLog.prototype.removeSelected = function (params) {
        for (var i = 0; i < params.children.length; i++) {
            var item = params.children[i];
            item.classList.remove("vc-code-string-selected");
            this.removeSelected(item);
        }
    };
    /**
   * 全部清空
   */
    CtlConsoleLog.prototype.vcClearAll = function () {
        var vcLog = $('#' + this._webix._domid)[0];
        vcLog.innerHTML = '';
    };
    /**
   * 全部收起
   */
    CtlConsoleLog.prototype.vcCloseAll = function () {
        var vcLog = $('#' + this._webix._domid)[0];
        this.closeOrOpen(vcLog, false);
    };
    /**
     * 全部展开
     */
    CtlConsoleLog.prototype.vcOpenAll = function () {
        var vcLog = $('#' + this._webix._domid)[0];
        this.closeOrOpen(vcLog, true);
        // var vvv = _.cloneDeepWith(vcLog, function customizer(value) {
        //   if (_.isElement(value)) {
        //     return value.cloneNode(true);
        //   }
        // });
        // this.closeOrOpen(vvv, true);
        // vcLog.innerHTML = vvv.innerHTML;
    };
    CtlConsoleLog.prototype.closeOrOpen = function (items, isOpen) {
        for (var i = 0; i < items.children.length; i++) {
            var item = items.children[i];
            if (item.classList.contains("vc-fold-content")) {
                if (isOpen) {
                    item.classList.remove("vc-hidden");
                }
                else {
                    item.classList.add("vc-hidden");
                }
            }
            this.closeOrOpen(item, isOpen);
        }
    };
    /**
     * tools
     */
    CtlConsoleLog.prototype.isNumber = function (value) {
        return Object.prototype.toString.call(value) == '[object Number]';
    };
    CtlConsoleLog.prototype.isString = function (value) {
        return Object.prototype.toString.call(value) == '[object String]';
    };
    CtlConsoleLog.prototype.isArray = function (value) {
        return Object.prototype.toString.call(value) == '[object Array]';
    };
    CtlConsoleLog.prototype.isBoolean = function (value) {
        return Object.prototype.toString.call(value) == '[object Boolean]';
    };
    CtlConsoleLog.prototype.isUndefined = function (value) {
        return value === undefined;
    };
    CtlConsoleLog.prototype.isNull = function (value) {
        return value === null;
    };
    CtlConsoleLog.prototype.isSymbol = function (value) {
        return Object.prototype.toString.call(value) == '[object Symbol]';
    };
    CtlConsoleLog.prototype.isFunction = function (value) {
        return Object.prototype.toString.call(value) == '[object Function]';
    };
    CtlConsoleLog.prototype.isObject = function (value) {
        return (Object.prototype.toString.call(value) == '[object Object]' ||
            // if it isn't a primitive value, then it is a common object
            (!this.isNumber(value) &&
                !this.isString(value) &&
                !this.isBoolean(value) &&
                !this.isArray(value) &&
                !this.isNull(value) &&
                !this.isFunction(value) &&
                !this.isUndefined(value) &&
                !this.isSymbol(value)));
    };
    /**
   * Simple JSON stringify, stringify top level key-value
   */
    CtlConsoleLog.prototype.JSONStringify = function (stringObject) {
        if (!this.isObject(stringObject) && !this.isArray(stringObject)) {
            return JSON.stringify(stringObject);
        }
        var prefix = '{', suffix = '}';
        if (this.isArray(stringObject)) {
            prefix = '[';
            suffix = ']';
        }
        var str = prefix;
        var keys = this.getObjAllKeys(stringObject);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = stringObject[key];
            try {
                // key
                if (!this.isArray(stringObject)) {
                    if (this.isObject(key) || this.isArray(key) || this.isSymbol(key)) {
                        str += Object.prototype.toString.call(key);
                    }
                    else {
                        str += key;
                    }
                    str += ': ';
                }
                // value
                if (this.isArray(value)) {
                    str += 'Array[' + value.length + ']';
                }
                else if (this.isObject(value) || this.isSymbol(value) || this.isFunction(value)) {
                    str += Object.prototype.toString.call(value);
                }
                else {
                    str += JSON.stringify(value);
                }
                if (i < keys.length - 1) {
                    str += ', ';
                }
            }
            catch (e) {
                continue;
            }
        }
        str += suffix;
        return str;
    };
    /**
   * get an object's all keys ignore whether they are not enumerable
   */
    CtlConsoleLog.prototype.getObjAllKeys = function (obj) {
        if (!this.isObject(obj) && !this.isArray(obj)) {
            return [];
        }
        if (this.isArray(obj)) {
            var m_1 = [];
            obj.forEach(function (_, index) {
                m_1.push(index);
            });
            return m_1;
        }
        return Object.getOwnPropertyNames(obj).sort();
    };
    /**
     * get an object's prototype name
     */
    CtlConsoleLog.prototype.getObjName = function (obj) {
        return Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '');
    };
    return CtlConsoleLog;
}(CtlBase));
export { CtlConsoleLog };
//# sourceMappingURL=CtlConsoleLog.js.map
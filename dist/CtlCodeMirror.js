import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { CtlCodeMirrorDefault } from './CtlDefaultValue';
import { parseYvanPropChangeVJson } from './CtlUtils';
import webix from 'webix';
webix.protoUI({
    name: 'codemirror-editor',
    defaults: {},
    $init: function (config) {
        this.$view.innerHTML =
            "<textarea style='width:100%;height:100%;'></textarea>";
        this._waitEditor = webix.promise.defer();
        this.$ready.push(this._render_cm_editor);
        _.extend(this.config, config);
        if (config.on && typeof config.on.onInited === 'function') {
            config.on.onInited.call(this);
        }
    },
    _render_cm_editor: function () {
        this._render_when_ready();
        // if (this.config.cdn === false) {
        //     this._render_when_ready;
        //     return;
        // }
        //
        // var cdn = this.config.cdn || "//cdn.bootcss.com/codemirror/5.38.0/";
        // // basic
        // var sources = [
        //     cdn + "/codemirror.css",
        //     cdn + "/codemirror.js"
        // ];
        //
        // // mode
        // if (this.config.mode === "htmlmixed") {
        //     sources.push(cdn + "/mode/xml/xml.js");
        //     sources.push(cdn + "/mode/css/css.js");
        //     sources.push(cdn + "/mode/javascript/javascript.js");
        //
        // } else {
        //     var mode = this.config.mode ? this.config.mode : "javascript";
        //     sources.push(cdn + "/mode/" + mode + "/" + mode + ".js");
        // }
        //
        // // theme
        // if (this.config.theme && this.config.theme !== "default") {
        //     sources.push(cdn + "/theme/" + this.config.theme + ".css")
        // }
        //
        // // matchbrackets add-on
        // if (this.config.matchBrackets) {
        //     sources.push(cdn + "/addon/edit/matchbrackets.js")
        // }
        //
        // webix.require(sources)
        //     .then(webix.bind(this._render_when_ready, this))
        //     .catch((e: any) => {
        //         console.log(e);
        //     });
    },
    _render_when_ready: function () {
        var CodeMirror = _.get(window, 'CodeMirror');
        this._editor = CodeMirror.fromTextArea(this.$view.firstChild, __assign({}, this.config));
        this._waitEditor.resolve(this._editor);
        this.setValue(this.config.value);
        if (this._focus_await) {
            this.focus();
        }
    },
    _set_inner_size: function () {
        if (!this._editor || !this.$width)
            return;
        this._updateScrollSize();
        this._editor.scrollTo(0, 0); //force repaint, mandatory for IE
    },
    _updateScrollSize: function () {
        var box = this._editor.getWrapperElement();
        var height = (this.$height || 0) + 'px';
        box.style.height = height;
        box.style.width = (this.$width || 0) + 'px';
        var scroll = this._editor.getScrollerElement();
        if (scroll.style.height !== height) {
            scroll.style.height = height;
            this._editor.refresh();
        }
    },
    $setSize: function (x, y) {
        if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
            this._set_inner_size();
        }
    },
    setValue: function (value) {
        if (!value && value !== 0) {
            value = '';
        }
        this.config.value = value;
        if (this._editor) {
            this._editor.setValue(value);
            //by default - clear editor's undo history when setting new value
            if (!this.config.preserveUndoHistory) {
                this._editor.clearHistory();
            }
            this._updateScrollSize();
        }
    },
    getValue: function () {
        return this._editor ? this._editor.getValue() : this.config.value;
    },
    focus: function () {
        this._focus_await = true;
        if (this._editor) {
            this._editor.focus();
        }
    },
    getEditor: function (waitEditor) {
        return waitEditor ? this._waitEditor : this._editor;
    },
    // //undo, redo, etc
    // undo: function () {
    //     this._editor.undo();
    // },
    // redo: function () {
    //     this._editor.redo();
    // },
    undoLength: function () {
        return this._editor.historySize().undo;
    }
}, webix.ui.view);
var CtlCodeMirror = /** @class */ (function (_super) {
    __extends(CtlCodeMirror, _super);
    function CtlCodeMirror() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlCodeMirror.create = function (module, vjson) {
        var that = new CtlCodeMirror(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlCodeMirrorDefault);
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
    /**
     * 撤销
     */
    CtlCodeMirror.prototype.undo = function () {
        this._webix.getEditor().undo();
    };
    /**
     * 重做
     */
    CtlCodeMirror.prototype.redo = function () {
        this._webix.getEditor().redo();
    };
    /**
     * 添加内容
     */
    CtlCodeMirror.prototype.append = function (msg) {
        var editor = this._webix.getEditor();
        var CodeMirror = _.get(window, 'CodeMirror');
        editor.replaceRange(msg, CodeMirror.Pos(editor.lastLine()));
    };
    /**
     * 移动光标到文档开始处
     */
    CtlCodeMirror.prototype.goDocStart = function () {
        this._webix.getEditor().execCommand('goDocStart');
    };
    /**
     * 移动光标到文档结束处
     */
    CtlCodeMirror.prototype.goDocEnd = function () {
        this.execCommand('goDocEnd');
    };
    /**
     * 移动光标到行开始处
     */
    CtlCodeMirror.prototype.goLineStart = function () {
        this.execCommand('goLineStart');
    };
    /**
     * 移动光标到行结束处
     */
    CtlCodeMirror.prototype.goLineEnd = function () {
        this.execCommand('goLineEnd');
    };
    /**
     * 移动光标到上一行
     */
    CtlCodeMirror.prototype.goLineUp = function () {
        this.execCommand('goLineUp');
    };
    /**
     * 移动光标到下一行
     */
    CtlCodeMirror.prototype.goLineDown = function () {
        this.execCommand('goLineDown');
    };
    /**
     * 获取对应行的内容
     */
    CtlCodeMirror.prototype.getLine = function (n) {
        return this._webix.getEditor().getLine(n);
    };
    /**
     * 设置scroll到position位置
     */
    CtlCodeMirror.prototype.scrollTo = function (x, y) {
        this._webix.getEditor().scrollTo(x, y);
    };
    CtlCodeMirror.prototype.clear = function () {
        this.value = '';
    };
    /**
     * 执行命令
     */
    CtlCodeMirror.prototype.execCommand = function (cmd) {
        return this._webix.getEditor().execCommand(cmd);
    };
    /**
     * 刷新编辑器
     */
    CtlCodeMirror.prototype.refresh = function () {
        this._webix.getEditor().refresh();
    };
    Object.defineProperty(CtlCodeMirror.prototype, "value", {
        /**
         * 获取值
         */
        get: function () {
            if (!this._webix) {
                return this._webixConfig.value;
            }
            return this._webix.getValue();
        },
        /**
         * 设置值
         */
        set: function (nv) {
            if (!this._webix) {
                this._webixConfig.value = nv;
            }
            else {
                this._webix.setValue(nv);
            }
        },
        enumerable: true,
        configurable: true
    });
    return CtlCodeMirror;
}(CtlBase));
export { CtlCodeMirror };
//# sourceMappingURL=CtlCodeMirror.js.map
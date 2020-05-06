import { __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvEventDispatch } from './YvanEvent';
import { CtlButtonDefault } from './CtlDefaultValue';
import { isDesignMode } from './DesignHelper';
/**
 * 按钮组件
 * @author yvan
 */
var CtlButton = /** @class */ (function (_super) {
    __extends(CtlButton, _super);
    function CtlButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*============================ 私有属性部分 ============================*/
        _this._text = '';
        _this._icon = '';
        return _this;
    }
    CtlButton.create = function (vjson) {
        var that = new CtlButton(vjson);
        _.defaultsDeep(vjson, CtlButtonDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            'onClick',
            'cssType',
            'icon',
            'width',
            'badge',
            'text'
        ]);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
        _.merge(vjson, that._webixConfig, {
            type: 'text',
            on: {
                onInited: function () {
                    that.attachHandle(this);
                },
                onDestruct: function () {
                    that.removeHandle();
                },
                onItemClick: function () {
                    if (isDesignMode()) {
                        return;
                    }
                    YvEventDispatch(that.onClick, that, undefined);
                }
            }
        });
        return that;
    };
    Object.defineProperty(CtlButton.prototype, "badge", {
        /**
         * 设置标记
         */
        set: function (nv) {
            if (!this._webix) {
                if (nv) {
                    this._webixConfig.badge = nv;
                }
                else {
                    delete this._webixConfig.css;
                }
                return;
            }
            this._webix.define('badge', nv);
            this._webix.render();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlButton.prototype, "width", {
        /**
         * 设置宽度
         */
        set: function (nv) {
            if (!this._webix) {
                if (nv) {
                    this._webixConfig.width = nv;
                }
                else {
                    delete this._webixConfig.width;
                }
                return;
            }
            this._webix.define('width', nv);
            this._webix.resize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlButton.prototype, "cssType", {
        /**
         * 显示样式
         */
        set: function (nv) {
            var css = nv;
            switch (nv) {
                case 'success':
                    css = 'yvan_success';
                    break;
                case 'danger':
                    css = 'yvan_danger';
                    break;
                case 'primary':
                    css = 'yvan_primary';
                    break;
                case 'default':
                    css = '';
                    break;
            }
            if (!this._webix) {
                if (css) {
                    this._webixConfig.css = css;
                }
                else {
                    delete this._webixConfig.css;
                }
                return;
            }
            $(this._webix.$view).removeClass('webix_danger webix_primary');
            this._webix.define('css', css);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlButton.prototype, "icon", {
        /**
         * 获取按钮图标
         */
        get: function () {
            return this._icon;
        },
        /**
         * 设置按钮图标
         */
        set: function (nv) {
            this._icon = nv;
            this._refreshText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlButton.prototype, "text", {
        /**
         * 获取按钮文本
         */
        get: function () {
            return this._text;
        },
        /**
         * 设置按钮文本
         */
        set: function (nv) {
            this._text = nv;
            this._refreshText();
        },
        enumerable: true,
        configurable: true
    });
    CtlButton.prototype._refreshText = function () {
        var nv = "<i class=\"" + this._icon + "\"></i><span>" + this._text + "</span>";
        if (!this._webix) {
            this._webixConfig.value = nv;
            return;
        }
        this._webix.setValue(nv);
    };
    return CtlButton;
}(CtlBase));
export { CtlButton };
//# sourceMappingURL=CtlButton.js.map
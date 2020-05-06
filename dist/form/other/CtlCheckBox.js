import { __extends } from "tslib";
import { CtlInput } from '../input/CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlCheckboxDefault } from '../../CtlDefaultValue';
var CtlCheckBox = /** @class */ (function (_super) {
    __extends(CtlCheckBox, _super);
    function CtlCheckBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._labelAtRight = true;
        _this._label = '';
        return _this;
    }
    CtlCheckBox.create = function (vjson) {
        var that = new CtlCheckBox(vjson);
        _.defaultsDeep(vjson, CtlCheckboxDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['labelAtRight', 'value']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
        _.merge(vjson, that._webixConfig, {
            view: 'checkbox',
            on: {}
        });
        return that;
    };
    Object.defineProperty(CtlCheckBox.prototype, "labelAtRight", {
        /**
         * label 是否在右边
         */
        get: function () {
            return this._labelAtRight;
        },
        set: function (nv) {
            this._labelAtRight = nv;
            this._refreshLabel();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlCheckBox.prototype, "label", {
        /**
         * label 显示内容
         */
        get: function () {
            return this._label;
        },
        set: function (nv) {
            this._label = nv;
            this._refreshLabel();
        },
        enumerable: true,
        configurable: true
    });
    CtlCheckBox.prototype._refreshLabel = function () {
        var nv = this._label;
        if (!this._webix) {
            if (this._labelAtRight) {
                this._webixConfig.label = '';
                this._webixConfig.labelRight = nv;
                this._webixConfig.labelWidth = 0;
            }
            else {
                this._webixConfig.label = nv;
                this._webixConfig.labelRight = '';
            }
        }
        else {
            if (this._labelAtRight) {
                this._webix.define({
                    label: '',
                    labelRight: nv
                });
            }
            else {
                this._webix.define({
                    label: nv,
                    labelRight: ''
                });
            }
            this._webix.refresh();
        }
    };
    /**
     * 交换状态
     */
    CtlCheckBox.prototype.toggle = function () {
        this._webix.toggle();
    };
    Object.defineProperty(CtlCheckBox.prototype, "value", {
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
                this._webix.setValueHere(nv);
            }
        },
        enumerable: true,
        configurable: true
    });
    return CtlCheckBox;
}(CtlInput));
export { CtlCheckBox };
//# sourceMappingURL=CtlCheckBox.js.map
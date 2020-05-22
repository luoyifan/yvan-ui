import { __extends } from "tslib";
import { CtlInput } from '../input/CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlSwitchDefault } from '../../CtlDefaultValue';
var CtlSwitch = /** @class */ (function (_super) {
    __extends(CtlSwitch, _super);
    function CtlSwitch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlSwitch.create = function (module, vjson) {
        var that = new CtlSwitch(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlSwitchDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['value']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
        _.merge(vjson, that._webixConfig, {
            view: 'switch',
            on: {}
        });
        return that;
    };
    /**
     * 交换状态
     */
    CtlSwitch.prototype.toggle = function () {
        this._webix.toggle();
    };
    Object.defineProperty(CtlSwitch.prototype, "value", {
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
    return CtlSwitch;
}(CtlInput));
export { CtlSwitch };
//# sourceMappingURL=CtlSwitch.js.map
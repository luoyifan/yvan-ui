import { __extends } from "tslib";
import { CtlInput } from '../input/CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlRadioDefault } from '../../CtlDefaultValue';
var CtlRadio = /** @class */ (function (_super) {
    __extends(CtlRadio, _super);
    function CtlRadio() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlRadio.create = function (module, vjson) {
        var that = new CtlRadio(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlRadioDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['options']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        // 将 _webixConfig 合并至 vjson, 最终合交给 webix 做渲染
        _.merge(vjson, that._webixConfig, {
            view: 'radio',
            on: {}
        });
        return that;
    };
    Object.defineProperty(CtlRadio.prototype, "options", {
        /**
         * 修改下拉选项
         */
        set: function (nv) {
            var value = nv.map(function (item) {
                return { id: item.id, value: item.text };
            });
            if (!this._webix) {
                _.merge(this._webixConfig, {
                    options: value
                });
                return;
            }
            this._webix.define('options', value);
            this._webix.refresh();
        },
        enumerable: true,
        configurable: true
    });
    return CtlRadio;
}(CtlInput));
export { CtlRadio };
//# sourceMappingURL=CtlRadio.js.map
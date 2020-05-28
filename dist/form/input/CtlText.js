import { __extends } from "tslib";
import { CtlInput } from './CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlTextDefault } from '../../CtlDefaultValue';
var CtlText = /** @class */ (function (_super) {
    __extends(CtlText, _super);
    function CtlText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlText.create = function (module, vjson) {
        var that = new CtlText(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlTextDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['validate']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig);
        return that;
    };
    return CtlText;
}(CtlInput));
export { CtlText };
//# sourceMappingURL=CtlText.js.map
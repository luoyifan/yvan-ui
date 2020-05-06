import { __extends } from "tslib";
import * as YvanUI from '../../YvanUIExtend';
import { CtlInput } from './CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlTextDefault } from '../../CtlDefaultValue';
var CtlText = /** @class */ (function (_super) {
    __extends(CtlText, _super);
    function CtlText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlText.create = function (vjson) {
        var that = new CtlText(vjson);
        _.defaultsDeep(vjson, CtlTextDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['validate']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig);
        return that;
    };
    Object.defineProperty(CtlText.prototype, "validate", {
        /*============================ 公共属性部分 ============================*/
        set: function (nv) {
            var that = this;
            if (typeof nv === 'function') {
                this._validate = nv;
            }
            else if (typeof nv === 'string') {
                var vl = function (value, data) {
                    var msg = YvanUI.complexValid['fun'](nv, value);
                    var $input = $(that._webix.$view).find('input');
                    if (msg) {
                        $input.each(function (index, item) {
                            $(item).css({
                                'background-color': '#ffdedb',
                                'border-color': '#ff8d82'
                            });
                        });
                        $("#" + that.id + "_validate").remove();
                        $(that._webix.$view).append("<div id=\"" + that.id + "_validate\" style=\"position:relative; border: 1px #ff8d82; float:right; top:-38px; color: #FF5C4C;\">" + msg + "</div>");
                        return false;
                    }
                    else {
                        $input.each(function (index, item) {
                            $(item).css({
                                'background-color': '',
                                'border-color': ''
                            });
                        });
                        $("#" + that.id + "_validate").remove();
                        return true;
                    }
                };
                this._validate = vl;
            }
        },
        enumerable: true,
        configurable: true
    });
    return CtlText;
}(CtlInput));
export { CtlText };
//# sourceMappingURL=CtlText.js.map
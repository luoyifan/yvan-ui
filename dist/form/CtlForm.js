import { __assign, __extends } from "tslib";
import { CtlBase } from '../CtlBase';
import { parseYvanPropChangeVJson } from '../CtlUtils';
var CtlForm = /** @class */ (function (_super) {
    __extends(CtlForm, _super);
    function CtlForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlForm.create = function (module, vjson) {
        var that = new CtlForm(vjson);
        that._module = module;
        if (vjson.hasOwnProperty('debugger')) {
            debugger;
        }
        var yvanProp = parseYvanPropChangeVJson(vjson, []);
        // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        // 将 yvanProxy 版的 _webix 合并至 webixProp, 最终合并至 vjson
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited: function () {
                    that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                },
                // onAfterLoad: function (this: any) {
                //   that.attachHandle(this)
                // },
                // onBeforeLoad: function (this: any) {
                //   that.attachHandle(this)
                // },
                // onChange: function (this: any) {
                //   that.attachHandle(this)
                // },
                // onViewShow: function (this: any) {
                //   that.attachHandle(this)
                // },
                onDestruct: function () {
                    that.removeHandle();
                }
            }
        });
        return that;
    };
    CtlForm.prototype.setValues = function (data) {
        this._webix.setValues(data);
    };
    return CtlForm;
}(CtlBase));
export { CtlForm };
//# sourceMappingURL=CtlForm.js.map
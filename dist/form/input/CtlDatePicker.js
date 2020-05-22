import { __assign, __extends } from "tslib";
import { CtlInput } from './CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlDateDefault, CtlDateTimeDefault } from '../../CtlDefaultValue';
var CtlDatePicker = /** @class */ (function (_super) {
    __extends(CtlDatePicker, _super);
    function CtlDatePicker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlDatePicker.create = function (module, vjson) {
        var that = new CtlDatePicker(vjson);
        that._module = module;
        var baseConfig = {};
        if (vjson.view === 'datetime') {
            // 日期+时间输入
            baseConfig.format = '%Y-%m-%d %H:%i:%s';
            baseConfig.timepicker = true;
            _.defaultsDeep(vjson, CtlDateTimeDefault);
        }
        else {
            // 日期输入
            baseConfig.format = '%Y-%m-%d';
            baseConfig.timepicker = false;
            _.defaultsDeep(vjson, CtlDateDefault);
        }
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, []);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig, __assign(__assign({ editable: true, stringResult: true, view: 'datepicker' }, baseConfig), { on: {} }));
        return that;
    };
    Object.defineProperty(CtlDatePicker.prototype, "value", {
        /**
         * 获取值(可能取到空值)
         */
        get: function () {
            var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
            if (this.vjson.view === 'datetime') {
                // 日期+时间输入
                return _.toString(value).substr(0, 19);
            }
            else {
                // 日期输入
                return _.toString(value).substr(0, 10);
            }
        },
        /*============================ 公共属性部分 ============================*/
        /**
         * 设置值 (如果不符合规定的格式 会清空)
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
    /*============================ 私有部分 ============================*/
    //更改 onChange 或实体时的值
    CtlDatePicker.prototype.valueProcess = function (value) {
        var moment = _.get(window, 'moment');
        if (_.isDate(value)) {
            value = moment(value);
            if (this.vjson.view === 'datetime') {
                // 日期+时间输入
                value = value.isValid() ? value.format('YYYY-MM-DD HH:mm:ss') : '';
            }
            else {
                // 日期输入
                value = value.isValid() ? value.format('YYYY-MM-DD') : '';
            }
            return value;
        }
        return value;
    };
    return CtlDatePicker;
}(CtlInput));
export { CtlDatePicker };
//# sourceMappingURL=CtlDatePicker.js.map
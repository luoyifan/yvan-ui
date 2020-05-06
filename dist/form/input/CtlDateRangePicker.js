import { __assign, __extends } from "tslib";
import { CtlInput } from './CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlDateRangeDefault, CtlDateTimeRangeDefault } from '../../CtlDefaultValue';
var CtlDateRangePicker = /** @class */ (function (_super) {
    __extends(CtlDateRangePicker, _super);
    function CtlDateRangePicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*============================ 公共部分 ============================*/
        _this.entityNameStart = '';
        _this.entityNameEnd = '';
        return _this;
    }
    CtlDateRangePicker.create = function (vjson) {
        var that = new CtlDateRangePicker(vjson);
        var baseConfig = {};
        if (vjson.view === 'datetimerange') {
            // 日期+时间输入
            baseConfig.format = '%Y-%m-%d %H:%i:%s';
            baseConfig.timepicker = true;
            _.defaultsDeep(vjson, CtlDateTimeRangeDefault);
        }
        else {
            // 日期输入
            baseConfig.format = '%Y-%m-%d';
            baseConfig.timepicker = false;
            _.defaultsDeep(vjson, CtlDateRangeDefault);
        }
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            'value',
            'separator',
            'entityNameStart',
            'entityNameEnd'
        ]);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig, __assign(__assign({ editable: true, stringResult: true, view: 'daterangepicker' }, baseConfig), { on: {} }));
        return that;
    };
    Object.defineProperty(CtlDateRangePicker.prototype, "separator", {
        get: function () {
            if (!this._webix) {
                return this._webixConfig.separator;
            }
            return this._webix.config['separator'];
        },
        set: function (nv) {
            if (!this._webix) {
                this._webixConfig.separator = nv;
            }
            else {
                this._webix.define('separator', nv);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlDateRangePicker.prototype, "value", {
        /**
         * 获取值(可能取到空值)
         */
        get: function () {
            var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
            if (!value) {
                return '';
            }
            var start = value.start, end = value.end;
            return start + this.separator + end;
        },
        /**
         * 设置值 (如果不符合规定的格式 会清空)
         */
        set: function (nv) {
            if (!this._webix) {
                if (typeof nv === 'string') {
                    var _a = nv.split(this.separator), start = _a[0], end = _a[1];
                    this._webixConfig.value = { start: start, end: end };
                }
                else {
                    this._webixConfig.value = nv;
                }
            }
            else {
                var value = nv;
                if (typeof nv === 'string') {
                    var _b = nv.split(this.separator), start = _b[0], end = _b[1];
                    value = { start: start, end: end };
                }
                this._webix.setValue(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /*============================ 私有部分 ============================*/
    //是否允许触发 onChange
    CtlDateRangePicker.prototype.valueValid = function (value) {
        var moment = _.get(window, 'moment');
        if (_.isPlainObject(value)) {
            var start = value.start, end = value.end;
            if (!moment(start).isValid() || !moment(end).isValid()) {
                return false;
            }
        }
        return true;
    };
    //更改 onChange 或实体时的值
    CtlDateRangePicker.prototype.valueProcess = function (value) {
        var moment = _.get(window, 'moment');
        if (_.isPlainObject(value)) {
            var start = value.start, end = value.end;
            start = moment(start);
            end = moment(end);
            if (this.vjson.view === 'datetimerange') {
                // 日期+时间输入
                start = start.isValid() ? start.format('YYYY-MM-DD HH:mm:ss') : '';
                end = end.isValid() ? end.format('YYYY-MM-DD HH:mm:ss') : '';
            }
            else {
                // 日期输入
                start = start.isValid() ? start.format('YYYY-MM-DD') : '';
                end = end.isValid() ? end.format('YYYY-MM-DD') : '';
            }
            if (this.entityNameStart) {
                // 带 entityNameStart 实体绑定
                _.set(this._module, this.entityNameStart, start);
            }
            if (this.entityNameEnd) {
                // 带 entityNameEnd 实体绑定
                _.set(this._module, this.entityNameEnd, end);
            }
            return start + this.separator + end;
        }
        return value;
    };
    return CtlDateRangePicker;
}(CtlInput));
export { CtlDateRangePicker };
//# sourceMappingURL=CtlDateRangePicker.js.map
import { __extends } from "tslib";
import { CtlInput } from '../input/CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlMultiComboDefault } from '../../CtlDefaultValue';
import { getFirstPinyin } from '../../Utils';
var CtlMultiCombo = /** @class */ (function (_super) {
    __extends(CtlMultiCombo, _super);
    function CtlMultiCombo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlMultiCombo.create = function (module, vjson) {
        var that = new CtlMultiCombo(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlMultiComboDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['options']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig);
        return that;
    };
    Object.defineProperty(CtlMultiCombo.prototype, "options", {
        /**
         * 修改下拉选项
         */
        set: function (nv) {
            var options = {
                filter: function (item, filterWord) {
                    if (_.size(filterWord) <= 0) {
                        return true;
                    }
                    var nodePy = getFirstPinyin(item.text).toLowerCase();
                    return (nodePy.indexOf(filterWord.toLowerCase()) >= 0 ||
                        item.text.indexOf(filterWord) >= 0);
                },
                body: {
                    template: '#text#',
                    type: {
                        height: 36
                    },
                    data: nv
                }
            };
            if (!this._webix) {
                _.merge(this._webixConfig, {
                    view: 'multicombo',
                    options: options
                });
                return;
            }
            this._webix.define('options', options);
            this._webix.refresh();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlMultiCombo.prototype, "dataReal", {
        /**
         * 修改下拉选项
         */
        set: function (nv) {
            this.options = nv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlMultiCombo.prototype, "separator", {
        /**
         * 值分隔符
         */
        get: function () {
            if (!this._webix) {
                return this._webixConfig.separator;
            }
            return this._webix.config['separator'];
        },
        /**
         * 值分隔符
         */
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
    Object.defineProperty(CtlMultiCombo.prototype, "value", {
        /**
         * 获取值(可能取到空值)
         */
        get: function () {
            return this._webix.getValue();
        },
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
    return CtlMultiCombo;
}(CtlInput));
export { CtlMultiCombo };
//# sourceMappingURL=CtlMultiCombo.js.map
import { __extends } from "tslib";
import { CtlInput } from '../input/CtlInput';
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { CtlComboDefault } from '../../CtlDefaultValue';
import { getFirstPinyin } from '../../Utils';
import { YvDataSource } from '../../YvanDataSourceImp';
/**
 * 下拉框组件
 */
var CtlCombo = /** @class */ (function (_super) {
    __extends(CtlCombo, _super);
    function CtlCombo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlCombo.create = function (module, vjson) {
        var that = new CtlCombo(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlComboDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['options', 'dataSource']);
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig);
        return that;
    };
    Object.defineProperty(CtlCombo.prototype, "options", {
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
                    view: 'combo',
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
    /**
     * 获取显示的值
     */
    CtlCombo.prototype.getText = function () {
        return this._webix.getText();
    };
    Object.defineProperty(CtlCombo.prototype, "dataReal", {
        /**
         * 下拉选项
         */
        set: function (nv) {
            this.options = nv;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlCombo.prototype, "dataSource", {
        /**
         * 获取数据源设置
         */
        get: function () {
            return this._dataSource;
        },
        /**
         * 设置数据源
         */
        set: function (nv) {
            this._dataSource = nv;
            if (this._module.loadFinished) {
                // onLoad 之后会触发 view.onInited -> attachHandle -> refreshState -> _rebindDataSource
                // onLoad 之前都不需要主动触发 _rebindDataSource
                this._rebindDataSource();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 重新请求数据
     */
    CtlCombo.prototype.reload = function () {
        if (this.dataSourceBind && this.dataSourceBind.reload) {
            this.dataSourceBind.reload();
        }
    };
    //重新绑定数据源
    CtlCombo.prototype._rebindDataSource = function () {
        var _this = this;
        if (!this._module) {
            return;
        }
        var innerMethod = function () {
            if (_this.dataSourceBind) {
                _this.dataSourceBind.destory();
                _this.dataSourceBind = undefined;
            }
            if (_this._webix && _this._module) {
                _this.dataSourceBind = new YvDataSource(_this, _this.dataSource, _this._dataSourceProcess.bind(_this));
                _this.dataSourceBind.init();
            }
        };
        if (!this._module.loadFinished) {
            // onload 函数还没有执行（模块还没加载完）, 延迟调用 rebind
            _.defer(innerMethod);
        }
        else {
            // 否则实时调用 rebind
            innerMethod();
        }
    };
    CtlCombo.prototype._dataSourceProcess = function (data) {
        if (!this.dataSource ||
            _.isArray(this.dataSource) ||
            _.isFunction(this.dataSource)) {
            return data;
        }
        if (this.dataSource.type !== 'SQL') {
            return data;
        }
        var displayField = this.dataSource.displayField || 'text';
        var valueField = this.dataSource.valueField || 'id';
        return _.map(data, function (item) {
            return {
                id: item[valueField],
                text: item[displayField]
            };
        });
    };
    //刷新状态时，自动重绑数据源
    CtlCombo.prototype.refreshState = function () {
        _super.prototype.refreshState.call(this);
        this._rebindDataSource();
    };
    return CtlCombo;
}(CtlInput));
export { CtlCombo };
//# sourceMappingURL=CtlCombo.js.map
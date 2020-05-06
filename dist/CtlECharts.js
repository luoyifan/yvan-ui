import { __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { YvEventDispatch } from './YvanEvent';
import { parseYvanPropChangeVJson } from './CtlUtils';
var CtlECharts = /** @class */ (function (_super) {
    __extends(CtlECharts, _super);
    function CtlECharts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlECharts.create = function (vjson) {
        var that = new CtlECharts(_.cloneDeep(vjson));
        if (vjson.hasOwnProperty('debugger')) {
            debugger;
        }
        // 提取基础属性 onRender / ctlName / entityName 等等
        var yvanProp = parseYvanPropChangeVJson(vjson, []);
        // 将 yvanProp 合并至当前 CtlBase 对象
        _.assign(that, yvanProp);
        // 删除 vjson 所有数据, 替换为 template 语法
        _.forOwn(vjson, function (value, key) {
            delete vjson[key];
        });
        _.merge(vjson, {
            view: 'grid',
            template: "<div role=\"echarts\"></div>",
            on: {
                onAfterRender: function () {
                    that.attachHandle(this);
                    that._resetECharts();
                },
                onDestruct: function () {
                    if (that._echartsHandler) {
                        that._echartsHandler.dispose();
                        delete that._echartsHandler;
                    }
                    that.removeHandle();
                }
            }
        });
        if (that.vjson.id) {
            vjson.id = that.vjson.id;
        }
        return that;
    };
    CtlECharts.prototype.setOption = function (option, opts) {
        var _this = this;
        this._echartsHandler.setOption(option, opts);
        _.defer(function () {
            _this._echartsHandler.resize();
        });
    };
    Object.defineProperty(CtlECharts.prototype, "handle", {
        get: function () {
            return this._echartsHandler;
        },
        enumerable: true,
        configurable: true
    });
    // setOption(option: echarts.EChartOption, opts?: echarts.EChartsOptionConfig): void {
    //     this._echartsHandler.setOption(option, opts);
    //     _.defer(() => {
    //         this._echartsHandler.resize();
    //     });
    // }
    //
    // setOption2(option: echarts.EChartOption | echarts.EChartsResponsiveOption, notMerge?: boolean, lazyUpdate?: boolean): void {
    //     this._echartsHandler.setOption(option, notMerge, lazyUpdate);
    //     _.defer(() => {
    //         this._echartsHandler.resize();
    //     });
    // }
    CtlECharts.prototype.resize = function () {
        this._echartsHandler.resize();
    };
    CtlECharts.prototype.clear = function () {
        this._echartsHandler.clear();
    };
    CtlECharts.prototype._resetECharts = function () {
        var _this = this;
        var $el = $(this._webix._viewobj).find('[role="echarts"]')[0];
        var el = $el;
        this._echartsHandler = echarts.init(el);
        this._echartsHandler.on('click', function (params) {
            YvEventDispatch(_this.onClick, _this, params);
        });
    };
    return CtlECharts;
}(CtlBase));
export { CtlECharts };
//# sourceMappingURL=CtlECharts.js.map
import { __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvDataSource } from './YvanDataSourceImp';
import { YvEventDispatch } from './YvanEvent';
import { CtlDataviewDefault } from './CtlDefaultValue';
var CtlDataview = /** @class */ (function (_super) {
    __extends(CtlDataview, _super);
    function CtlDataview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlDataview.create = function (vjson) {
        var that = new CtlDataview(vjson);
        _.defaultsDeep(vjson, CtlDataviewDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            // 'data',
            'dataSource',
            'onItemSelect',
            'onItemClick',
            'onItemDblClick',
            'onDataComplete'
        ]);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp);
        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            select: true,
            on: {
                onInited: function () {
                    that.attachHandle(this);
                },
                onAfterDelete: function () {
                    that.removeHandle();
                },
                onItemClick: function (id) {
                    var item = this.getItem(id);
                    YvEventDispatch(that.onItemClick, that, item);
                },
                onItemDblClick: function (id) {
                    var item = this.getItem(id);
                    YvEventDispatch(that.onItemDblClick, that, item);
                },
                onAfterSelect: function (id) {
                    var item = this.getItem(id);
                    YvEventDispatch(that.onItemSelect, that, item);
                }
            }
        });
        return that;
    };
    Object.defineProperty(CtlDataview.prototype, "value", {
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
                this._webix.setValue(nv);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlDataview.prototype, "dataReal", {
        /**
         * 设置数据
         */
        set: function (nv) {
            // dataSource call back
            this._webix.clearAll();
            this._webix.parse(nv);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlDataview.prototype, "dataSource", {
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
            this._rebindDataSource();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 重新请求数据
     */
    CtlDataview.prototype.reload = function () {
        if (this.dataSourceBind && this.dataSourceBind.reload) {
            this.dataSourceBind.reload();
        }
    };
    //重新绑定数据源
    CtlDataview.prototype._rebindDataSource = function () {
        if (this.dataSourceBind) {
            this.dataSourceBind.destory();
            this.dataSourceBind = undefined;
        }
        if (this._webix && this.getModule()) {
            this.dataSourceBind = new YvDataSource(this, this.dataSource, this._dataSourceProcess.bind(this));
            this.dataSourceBind.init();
        }
    };
    CtlDataview.prototype._dataSourceProcess = function (data) {
        if (!this.dataSource ||
            _.isArray(this.dataSource) ||
            _.isFunction(this.dataSource)) {
            return data;
        }
        if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
            return data;
        }
        if (!this.dataSource.idField) {
            return data;
        }
        var idField = this.dataSource.idField;
        data = _.cloneDeep(data);
        // 第一遍扫描, 建立映射关系
        _.each(data, function (item) {
            item.id = item[idField];
        });
        return data;
    };
    //刷新状态时，自动重绑数据源
    CtlDataview.prototype.refreshState = function () {
        _super.prototype.refreshState.call(this);
        this._rebindDataSource();
    };
    return CtlDataview;
}(CtlBase));
export { CtlDataview };
//# sourceMappingURL=CtlDataview.js.map
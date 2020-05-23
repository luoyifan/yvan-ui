import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvDataSource } from './YvanDataSourceImp';
import { YvEventDispatch } from './YvanEvent';
import { CtlSidebarDefault } from './CtlDefaultValue';
import { getFirstPinyin } from './Utils';
var CtlSidebar = /** @class */ (function (_super) {
    __extends(CtlSidebar, _super);
    function CtlSidebar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtlSidebar.create = function (module, vjson) {
        var that = new CtlSidebar(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlSidebarDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            // 'data',
            'dataSource',
            'onNodeClick',
            'onDataComplete'
        ]);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp);
        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
            select: true,
            filterMode: {
                showSubItems: false
            },
            on: {
                onInited: function () {
                    that.attachHandle(this, __assign(__assign({}, vjson), yvanProp));
                },
                onAfterDelete: function () {
                    that.removeHandle();
                },
                onItemClick: function (id) {
                    var item = this.getItem(id);
                    YvEventDispatch(that.onNodeClick, that, item);
                },
                onItemDblClick: function (id) {
                    var item = this.getItem(id);
                    YvEventDispatch(that.onNodeDblClick, that, item);
                }
            }
        });
        return that;
    };
    /**
     * 拼音方式过滤查找树
     */
    CtlSidebar.prototype.filter = function (nv) {
        if (!nv) {
            this._webix.filter('');
            return;
        }
        this._webix.filter(function (node) {
            var value = node.value;
            var nodePy = getFirstPinyin(value).toLowerCase();
            return nodePy.indexOf(nv.toLowerCase()) >= 0 || value.toLowerCase().indexOf(nv) >= 0;
        });
    };
    Object.defineProperty(CtlSidebar.prototype, "value", {
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
    Object.defineProperty(CtlSidebar.prototype, "dataReal", {
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
    Object.defineProperty(CtlSidebar.prototype, "dataSource", {
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
    CtlSidebar.prototype.reload = function () {
        if (this.dataSourceBind && this.dataSourceBind.reload) {
            this.dataSourceBind.reload();
        }
    };
    /**
     * 展开或收起状态互换
     */
    CtlSidebar.prototype.toggle = function () {
        return this._webix.toggle();
    };
    /**
     * 是否折叠状态
     */
    CtlSidebar.prototype.isCollapsed = function () {
        return this._webix.config.collapsed;
    };
    //重新绑定数据源
    CtlSidebar.prototype._rebindDataSource = function () {
        var _this = this;
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
    CtlSidebar.prototype._dataSourceProcess = function (data) {
        if (!this.dataSource ||
            _.isArray(this.dataSource) ||
            _.isFunction(this.dataSource)) {
            return data;
        }
        if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
            return data;
        }
        if (!this.dataSource.parentField ||
            !this.dataSource.displayField ||
            !this.dataSource.valueField) {
            return data;
        }
        var idField = this.dataSource.valueField;
        var textField = this.dataSource.displayField;
        var parentField = this.dataSource.parentField;
        data = _.cloneDeep(data);
        // 第一遍扫描, 建立映射关系
        var nodeMap = {};
        var rootNode = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            nodeMap[row[idField]] = {
                value: row[textField],
                id: row[idField],
                row: row
            };
            if (row.icon) {
                nodeMap[row[idField]].icon = row.icon;
            }
        }
        // 第二遍扫描，建立父子关系
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var parent_1 = row[parentField];
            var id = row[idField];
            if (!parent_1 || parent_1 === '0') {
                // 没有父亲，作为根节点
                rootNode.push(nodeMap[id]);
            }
            else if (nodeMap.hasOwnProperty(parent_1)) {
                //找到父亲
                var parentNode = nodeMap[parent_1];
                if (parentNode.hasOwnProperty('data')) {
                    parentNode.data.push(nodeMap[id]);
                }
                else {
                    parentNode.data = [nodeMap[id]];
                }
            }
            else {
                // 没有找到父亲，作为根节点
                rootNode.push(nodeMap[id]);
            }
        }
        return rootNode;
    };
    //刷新状态时，自动重绑数据源
    CtlSidebar.prototype.refreshState = function () {
        _super.prototype.refreshState.call(this);
        this._rebindDataSource();
    };
    /**
     * 根据id获取一行数据
     */
    CtlSidebar.prototype.getItem = function (id) {
        return this._webix.getItem(id);
    };
    /**
     * 选中一行
     * @param id
     */
    CtlSidebar.prototype.select = function (id) {
        // this._webix.showItem(id);
        var pid = id;
        while (pid) {
            this._webix.open(pid);
            pid = this._webix.getParentId(pid);
        }
        this._webix.select(id);
    };
    return CtlSidebar;
}(CtlBase));
export { CtlSidebar };
//# sourceMappingURL=CtlSidebar.js.map
import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvDataSource } from './YvanDataSourceImp';
import { YvEventDispatch } from './YvanEvent';
var CtlTreeTable = /** @class */ (function (_super) {
    __extends(CtlTreeTable, _super);
    function CtlTreeTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 显示勾选框
         */
        _this.showCheckbox = false;
        /**
         * 显示左侧展开图标
         */
        _this.showLeftIcon = true;
        /**
         * 显示图标
         */
        _this.showIcon = true;
        return _this;
    }
    CtlTreeTable.create = function (module, vjson) {
        var that = new CtlTreeTable(vjson);
        that._module = module;
        if (vjson.hasOwnProperty('debugger')) {
            debugger;
        }
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            'data',
            'dataSource',
            'onNodeClick',
            'onNodeDblClick',
            'showCheckbox',
            'showLeftIcon',
            'showIcon'
        ]);
        // 将 vjson 存至 _webixConfig
        that._webixConfig = vjson;
        // 将 yvanProp 合并至当前 Ctl 对象, 期间会操作 _webixConfig
        _.assign(that, yvanProp);
        // 将 事件与 _webixConfig 一起存至 vjson 交给 webix 框架做渲染
        _.merge(vjson, that._webixConfig, {
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
            },
            template: function (obj, common) {
                var t = '';
                if (that.showCheckbox) {
                    t += common.checkbox(obj, common);
                }
                if (that.showIcon) {
                    t += common.folder(obj, common);
                }
                if (that.showLeftIcon) {
                    t += common.icon(obj, common);
                }
                t += obj.value;
                return t;
            },
            threeState: that.showCheckbox,
            // 树的左侧图标
            type: {
                folder: function (obj) {
                    if (obj.icon) {
                        return ("<span style='padding-left: 5px; padding-right: 5px; color: #063978; font-size: 16px' class='" +
                            obj.icon +
                            "'></span>");
                    }
                    return '';
                }
            }
        });
        return that;
    };
    Object.defineProperty(CtlTreeTable.prototype, "value", {
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
    Object.defineProperty(CtlTreeTable.prototype, "dataReal", {
        /**
         * 设置数据
         */
        set: function (nv) {
            this._webix.clearAll();
            this._webix.parse(nv);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlTreeTable.prototype, "dataSource", {
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
    CtlTreeTable.prototype.reload = function () {
        if (this.dataSourceBind && this.dataSourceBind.reload) {
            this.dataSourceBind.reload();
        }
    };
    /**
     * 清空所有数据
     */
    CtlTreeTable.prototype.clear = function () {
        this._webix.clearAll();
    };
    /**
     * 取消选择所有节点
     */
    CtlTreeTable.prototype.uncheckAll = function () {
        this._webix.uncheckAll();
    };
    /**
     * 根据id获取一行数据
     */
    CtlTreeTable.prototype.getItem = function (id) {
        return this._webix.getItem(id);
    };
    /**
     * 获取某 id 下树节点所有的子节点
     */
    CtlTreeTable.prototype.getChildItems = function (id) {
        var ret = [];
        var c = this._webix.getFirstChildId(id);
        while (c) {
            ret.push(this._webix.getItem(c));
            c = this._webix.getNextSiblingId(c);
        }
        return ret;
    };
    /**
     * 获取某 id 下树节点所有的子节点的编号
     */
    CtlTreeTable.prototype.getChildIds = function (id) {
        var ret = [];
        var c = this._webix.getFirstChildId(id);
        while (c) {
            ret.push(c);
            c = this._webix.getNextSiblingId(c);
        }
        return ret;
    };
    /**
     * 勾选选中一行
     */
    CtlTreeTable.prototype.checkItem = function (id) {
        this._webix.checkItem(id);
    };
    /**
     * 获取被选中的一行编号
     */
    CtlTreeTable.prototype.getSelectedId = function () {
        return this._webix.getSelectedId();
    };
    /**
     * 获取被选中的一行
     */
    CtlTreeTable.prototype.getSelectedItem = function () {
        return this._webix.getSelectedItem();
    };
    /**
     * 选中一行
     * @param id
     */
    CtlTreeTable.prototype.select = function (id) {
        this._webix.showItem(id);
        this._webix.select(id);
    };
    /**
     * 选中多行
     */
    CtlTreeTable.prototype.checkItems = function (ids) {
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            this._webix.checkItem(id);
        }
    };
    /**
     * 取消选中一行
     */
    CtlTreeTable.prototype.uncheckItem = function (id) {
        this._webix.uncheckItem(id);
    };
    /**
     * 获取选中的行
     */
    CtlTreeTable.prototype.getChecked = function () {
        return this._webix.getChecked();
    };
    /**
     * 查看是否被选中
     */
    CtlTreeTable.prototype.isChecked = function (id) {
        return this._webix.isChecked(id);
    };
    /**
     * 展开全部节点
     */
    CtlTreeTable.prototype.expandAll = function () {
        this._webix.openAll();
    };
    /**
     * 收起所有节点
     */
    CtlTreeTable.prototype.collapseAll = function () {
        this._webix.closeAll();
    };
    /**
     * 过滤, 如果不设置 condition 代表不过滤，否则带入过滤函数
     */
    CtlTreeTable.prototype.filter = function (condition) {
        this._webix.filter(condition);
    };
    //重新绑定数据源
    CtlTreeTable.prototype._rebindDataSource = function () {
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
    CtlTreeTable.prototype._dataSourceProcess = function (data) {
        if (!this.dataSource || _.isArray(this.dataSource) || _.isFunction(this.dataSource)) {
            return data;
        }
        if (this.dataSource.type !== 'SQL' && this.dataSource.type !== 'function') {
            return data;
        }
        if (!this.dataSource.parentField || !this.dataSource.valueField) {
            return data;
        }
        var idField = this.dataSource.valueField;
        var parentField = this.dataSource.parentField;
        data = _.cloneDeep(data);
        // 第一遍扫描, 建立映射关系
        var nodeMap = {};
        var rootNode = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            nodeMap[row[idField]] = row;
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
    CtlTreeTable.prototype.refreshState = function () {
        _super.prototype.refreshState.call(this);
        this._rebindDataSource();
    };
    return CtlTreeTable;
}(CtlBase));
export { CtlTreeTable };
//# sourceMappingURL=CtlTreeTable.js.map
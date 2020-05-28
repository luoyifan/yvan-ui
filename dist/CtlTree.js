import { __assign, __extends } from "tslib";
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvDataSource } from './YvanDataSourceImp';
import { YvEventDispatch } from './YvanEvent';
import { CtlTreeDefault } from './CtlDefaultValue';
import { getFirstPinyin } from './Utils';
var CtlTree = /** @class */ (function (_super) {
    __extends(CtlTree, _super);
    function CtlTree() {
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
    CtlTree.create = function (module, vjson) {
        var that = new CtlTree(vjson);
        that._module = module;
        _.defaultsDeep(vjson, CtlTreeDefault);
        var yvanProp = parseYvanPropChangeVJson(vjson, [
            // 'data',
            'dataSource',
            'onNodeClick',
            'onNodeDblClick',
            'onDataComplete',
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
            // 树的左侧图标
            type: {
                folder: function (obj) {
                    if (obj.icon) {
                        return ("<span style='padding-left: 5px; padding-right: 5px; color: #5fa2dd; font-size: 16px' class='" +
                            obj.icon +
                            "'></span>");
                    }
                    return '';
                }
            }
        });
        if (vjson.threeState !== false && that.showCheckbox) {
            vjson.threeState = true;
        }
        else {
            vjson.threeState = false;
        }
        return that;
    };
    /**
     * 拼音方式过滤查找树
     */
    CtlTree.prototype.filter = function (nv) {
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
    Object.defineProperty(CtlTree.prototype, "value", {
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
    Object.defineProperty(CtlTree.prototype, "dataReal", {
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
    Object.defineProperty(CtlTree.prototype, "dataSource", {
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
    CtlTree.prototype.reload = function () {
        if (this.dataSourceBind && this.dataSourceBind.reload) {
            this.dataSourceBind.reload();
        }
    };
    /**
     * 获取第一个节点
     */
    CtlTree.prototype.getFirstId = function () {
        return this._webix.getFirstId();
    };
    /**
     * 展开某个节点
     */
    CtlTree.prototype.open = function (id) {
        this._webix.open(id);
    };
    /**
     * 清空所有数据
     */
    CtlTree.prototype.clear = function () {
        this._webix.clearAll();
    };
    /**
     * 选择所有节点
     */
    CtlTree.prototype.checkAll = function () {
        this._webix.checkAll();
    };
    /**
     * 取消选择所有节点
     */
    CtlTree.prototype.uncheckAll = function () {
        this._webix.uncheckAll();
    };
    /**
     * 根据id获取一行数据
     */
    CtlTree.prototype.getItem = function (id) {
        return this._webix.getItem(id);
    };
    /**
     * 获取某 id 下树节点所有的子节点
     */
    CtlTree.prototype.getChildItems = function (id) {
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
    CtlTree.prototype.getChildIds = function (id) {
        var ret = [];
        var c = this._webix.getFirstChildId(id);
        while (c) {
            ret.push(c);
            c = this._webix.getNextSiblingId(c);
        }
        return ret;
    };
    /**
     * 获取被选中的一行编号
     */
    CtlTree.prototype.getSelectedId = function () {
        return this._webix.getSelectedId();
    };
    /**
     * 获取被选中的一行
     */
    CtlTree.prototype.getSelectedItem = function () {
        return this._webix.getSelectedItem();
    };
    /**
     * 勾选选中一行
     */
    CtlTree.prototype.checkItem = function (id) {
        this._webix.checkItem(id);
    };
    /**
     * 选中一行
     * @param id
     */
    CtlTree.prototype.select = function (id) {
        // this._webix.showItem(id);
        var pid = id;
        while (pid) {
            this._webix.open(pid);
            pid = this._webix.getParentId(pid);
        }
        this._webix.select(id);
    };
    /**
     * 选中多行
     */
    CtlTree.prototype.checkItems = function (ids) {
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            this._webix.checkItem(id);
        }
    };
    /**
     * 取消选中一行
     */
    CtlTree.prototype.uncheckItem = function (id) {
        this._webix.uncheckItem(id);
    };
    /**
     * 获取选中的ID 数组
     */
    CtlTree.prototype.getCheckedIds = function () {
        return this._webix.getChecked();
    };
    /**
     * 获取选中的行数组
     */
    CtlTree.prototype.getCheckedItems = function () {
        var _this = this;
        return _.map(this._webix.getChecked(), function (v) { return _this._webix.getItem(v); });
    };
    /**
     * 查看是否被选中
     */
    CtlTree.prototype.isChecked = function (id) {
        return this._webix.isChecked(id);
    };
    /**
     * 展开全部节点
     */
    CtlTree.prototype.expandAll = function () {
        this._webix.openAll();
    };
    /**
     * 收起所有节点
     */
    CtlTree.prototype.collapseAll = function () {
        this._webix.closeAll();
    };
    /**
     * 递归查找每个节点, 直到寻找到想要的节点
     */
    CtlTree.prototype.find = function (condition) {
        return this._webix.find(condition);
    };
    //重新绑定数据源
    CtlTree.prototype._rebindDataSource = function () {
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
    CtlTree.prototype._dataSourceProcess = function (data) {
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
                icon: row['icon'],
                value: row[textField],
                id: row[idField],
                disabled: _.get(row, 'disabled'),
                row: row
            };
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
    CtlTree.prototype.refreshState = function () {
        _super.prototype.refreshState.call(this);
        this._rebindDataSource();
    };
    return CtlTree;
}(CtlBase));
export { CtlTree };
//# sourceMappingURL=CtlTree.js.map
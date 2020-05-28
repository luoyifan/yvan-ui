import { __assign, __extends } from "tslib";
import * as YvanUI from './YvanUIExtend';
import CtlGridLocale from './CtlGridLocale';
import { CtlGridPage } from './CtlGridPage';
import agGrid from 'ag-grid';
import CtlGridIdRender from './CtlGridIdRender';
import { YvGridColumnEditProp, YvGridColumnProp, YvGridProp } from './CtlGridDefault';
import CtlGridCellCheckbox from './CtlGridCellCheckbox';
import CtlGridHeadCheckbox from './CtlGridHeadCheckbox';
import { CtlBase } from './CtlBase';
import { parseYvanPropChangeVJson } from './CtlUtils';
import { YvEventDispatch } from './YvanEvent';
import { YvanDataSourceGrid } from './YvanDataSourceGridImp';
import CtlGridCellButton from './CtlGridCellButton';
import CtlGridFilterSet from './CtlGridFilterSet';
import CtlGridEditorText from './CtlGridEditorText';
import CtlGridEditorCombo from './CtlGridEditorCombo';
import webix from 'webix';
/** 在CtlGridPage.ts 里面有关于点击分页按钮时候设置 GridRefreshMode **/
export var GridRefreshMode;
(function (GridRefreshMode) {
    GridRefreshMode[GridRefreshMode["refreshRows"] = 0] = "refreshRows";
    GridRefreshMode[GridRefreshMode["refreshWithFilter"] = 1] = "refreshWithFilter";
    GridRefreshMode[GridRefreshMode["refreshAndClearFilter"] = 2] = "refreshAndClearFilter";
})(GridRefreshMode || (GridRefreshMode = {}));
/**
 * 扩展 grid 组件
 */
webix.protoUI({
    name: 'grid',
    $init: function (config) {
        this._domid = webix.uid();
        this.$view.innerHTML = "<div id='" + this._domid + "' role=\"yvGrid\" class=\"ag-theme-blue\"></div>";
        _.extend(this.config, config);
        if (config.on && typeof config.on.onMyRender === 'function') {
            config.on.onMyRender.call(this);
        }
    }
}, webix.ui.view);
var CtlGrid = /** @class */ (function (_super) {
    __extends(CtlGrid, _super);
    function CtlGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.refreshMode = GridRefreshMode.refreshRows;
        /**
         * 是否自动读取数据
         */
        _this.autoLoad = true;
        /**
         * 是否分页
         */
        _this.pagination = false;
        /**
         * 分页大小
         */
        _this.pageSize = 100;
        /**
         * 获取被勾选的行ID集合
         */
        _this.checkedIds = [];
        /*============================ 私有属性部分 ============================*/
        _this.isGridReadReady = false;
        _this.dataSourceBind = undefined;
        return _this;
    }
    CtlGrid.create = function (module, vjson) {
        var that = new CtlGrid(_.cloneDeep(vjson));
        that._module = module;
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
            // template: `<div role="yvGrid" class="ag-theme-blue"></div>`,
            on: {
                onMyRender: function () {
                    var _this = this;
                    _.defer(function () {
                        that.attachHandle(_this, __assign(__assign({}, vjson), yvanProp));
                        that._resetGrid();
                    });
                },
                onDestruct: function () {
                    if (that.gridApi) {
                        that.gridApi.destroy();
                        that.gridApi = undefined;
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
    Object.defineProperty(CtlGrid.prototype, "webix", {
        get: function () {
            return this._webix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtlGrid.prototype, "dataSource", {
        /**
         * 获取数据源
         */
        get: function () {
            return this.vjson.dataSource;
        },
        /**
         * 设置数据源
         */
        set: function (nv) {
            this.vjson.dataSource = nv;
            // if (this._module.loadFinished) {
            //   throw new Error('Grid 不允许动态设置数据源')
            // }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 选择一个指定行
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    CtlGrid.prototype.selectRow = function (condition) {
        var node = this._findNode(condition);
        if (node) {
            this.gridApi.setFocusedCell(node.rowIndex, '__ID__');
            node.setSelected(true);
            return true;
        }
        return false;
    };
    /**
     * 闪烁指定行
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    CtlGrid.prototype.flashRow = function (condition) {
        var node = this._findNode(condition);
        if (node) {
            this.gridApi.flashCells({ rowNodes: [node] });
            return true;
        }
        return false;
    };
    /**
     * 闪烁指定单元格
     * @param cols 列数组
     * @param condition 可以是 key(主键), 也可以是 function 条件, 匹配到符合 condition 的第一条记录
     */
    CtlGrid.prototype.flashCell = function (cols, condition) {
        var node = this._findNode(condition);
        if (node) {
            this.gridApi.flashCells({ columns: cols, rowNodes: [node] });
            return true;
        }
        return false;
    };
    /**
     * 无感知刷新
     */
    CtlGrid.prototype._transactionUpdate = function (targetDataList) {
        var _this = this;
        if (this.refreshMode === GridRefreshMode.refreshWithFilter || this.refreshMode === GridRefreshMode.refreshAndClearFilter) {
            /** 更改当前的刷新模式， 避免重复刷新 **/
            this.refreshMode = GridRefreshMode.refreshRows;
            this.setData(targetDataList);
            if (this.dataSourceBind) {
                this.gridApi.setFilterModel(this.dataSourceBind.lastFilterModel);
            }
        }
        else {
            /** 更改当前的刷新模式， 避免重复刷新 **/
            this.refreshMode = GridRefreshMode.refreshRows;
            var transaction_1 = {
                add: [],
                remove: [],
                update: []
            };
            var i_1 = 0;
            this.gridApi.forEachNode(function (node) {
                if (i_1 === targetDataList.length) {
                    //已经越位
                    transaction_1.remove.push(node.data);
                }
                else {
                    var newData = targetDataList[i_1++];
                    node.setData(newData);
                    transaction_1.update.push(node.data);
                }
            });
            for (; i_1 < targetDataList.length; i_1++) {
                transaction_1.add.push(targetDataList[i_1]);
            }
            this.gridApi.updateRowData(transaction_1);
        }
        if (this.paginationDefaultSelectRow != undefined && targetDataList && targetDataList.length > 0) {
            if (this.paginationDefaultSelectRow >= 0) {
                if (targetDataList.length <= this.paginationDefaultSelectRow) {
                    this.selectRow(function (node) { return node.rowIndex === targetDataList.length - 1; });
                }
                else {
                    this.selectRow(function (node) { return node.rowIndex === _this.paginationDefaultSelectRow; });
                }
            }
        }
    };
    /**
     * 获取全部数据
     */
    CtlGrid.prototype.getData = function () {
        var result = [];
        this.gridApi.forEachNode(function (node) {
            result.push(node.data);
        });
        return result;
    };
    /**
     * 为表格设置数据
     * 注意，调用此方法，必须在初始化时，给一个空的 data: [] 属性
     * 确保表格 rowModelType:clientSide 模式
     */
    CtlGrid.prototype.setData = function (nv) {
        this.gridApi.setRowData(nv);
    };
    /**
     * 无感刷新
     * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
     *
     * option:
     *   clearFilter=true 是否清空筛选
     */
    // reload(option?: any) {
    //   this.loading = true
    //
    //   //无感刷新之前，清空所有状态
    //   this._clearCache()
    //
    //   //需要重新请求 rowCount(总数据行)
    //   if (this.dataSourceBind) {
    //     this.dataSourceBind.clearRowCount()
    //   }
    //
    //   if (this.entityName) {
    //     _.set(this.getModule(), this.entityName + '.selectedRow', undefined)
    //   }
    //
    //   /** 有clearFilter 参数的时候 一定刷新数据 **/
    //   if (option && option.clearFilter === true) {
    //     this.pageAbleDataRefreshMode = "refreshAndReset"
    //     this.gridApi.setFilterModel(null)
    //     if (this.dataSourceBind) {
    //       /** 表头筛选数据没有变化也要重新加载数据 **/
    //       if (_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) {
    //         this._filterChanged();
    //       }
    //     }
    //   } else {
    //     if (this.pagination) {
    //       this.pageAbleDataRefreshMode = "refreshWithFilter"
    //       this.gridPage.refreshGrid()
    //     } else {
    //       this.pageAbleDataRefreshMode = "refreshRows"
    //       this.gridApi.refreshInfiniteCache()
    //     }
    //   }
    // }
    /**
     * 无感刷新
     * 清空缓存，从后台重新拉取数据，表格上临时修改的内容都会被清空
     *
     * option:
     *   clearFilter=true 是否清空筛选
     */
    CtlGrid.prototype.reload = function (refreshMode) {
        if (refreshMode === void 0) { refreshMode = GridRefreshMode.refreshRows; }
        this.loading = true;
        this.refreshMode = refreshMode;
        //无感刷新之前，清空所有状态
        this._clearCache();
        //需要重新请求 rowCount(总数据行)
        if (this.dataSourceBind) {
            this.dataSourceBind.clearRowCount();
        }
        if (this.entityName) {
            _.set(this.getModule(), this.entityName + '.selectedRow', undefined);
        }
        /** 有clearFilter 参数的时候 一定刷新数据 **/
        if (refreshMode === GridRefreshMode.refreshAndClearFilter) {
            this.gridApi.setFilterModel(null);
            if (this.dataSourceBind) {
                /** 表头筛选数据没有变化也要重新加载数据 **/
                if (_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) {
                    this._filterChanged();
                }
            }
        }
        else {
            if (this.pagination) {
                this.gridPage.refreshGrid();
            }
            else {
                this.gridApi.refreshInfiniteCache();
            }
        }
    };
    /**
     * 获取被选中的行主键
     */
    CtlGrid.prototype.getSelectedId = function () {
        var row = this.getSelectedRow();
        if (row) {
            return this._getIdByRow(row);
        }
    };
    /**
     * 设置勾选的数据行集合
     */
    CtlGrid.prototype.setCheckedIds = function (ids) {
        // 清空所有元素
        this.checkedIds = ids;
        // 刷新勾选单元格
        this.gridApi.refreshCells({
            columns: ['__CB__'],
            force: true
        });
    };
    /**
     * 获取被勾选的所有行
     */
    CtlGrid.prototype.getCheckedRows = function () {
        var _this = this;
        var selected = [];
        this._findNode(function (node) {
            if (_.indexOf(_this.checkedIds, _this._getIdByRow(node.data)) >= 0) {
                selected.push(node.data);
            }
            return false;
        });
        return selected;
    };
    /**
     * 获取被选中的行数据
     */
    CtlGrid.prototype.getSelectedRow = function () {
        var rows = this.getSelectedRows();
        return rows.length > 0 ? rows[0] : undefined;
    };
    /**
     * 获取被选中的行数据(多选情况下回返回多行数据)
     */
    CtlGrid.prototype.getSelectedRows = function () {
        // 调用原生 getSelectedRows 方法有 bug
        // return this.gridApi.getSelectedRows();
        var selected = [];
        this._findNode(function (node) {
            if (node.selected) {
                selected.push(node.data);
            }
            return false;
        });
        return selected;
    };
    Object.defineProperty(CtlGrid.prototype, "loading", {
        /**
         * 显示正在读取的状态
         */
        set: function (newValue) {
            if (!this.isGridReadReady) {
                return;
            }
            if (newValue) {
                // 盖着
                this.gridApi.showLoadingOverlay();
                $($(this._webix.$view).find('.ag-paging-panel')[0]).append("<div class=\"maskBox\"></div>");
            }
            else {
                // 放开
                $(this._webix.$view).find('.maskBox').remove();
                this.gridApi.hideOverlay();
            }
        },
        enumerable: true,
        configurable: true
    });
    CtlGrid.prototype.paginationSetPageSize = function (size) {
        this.gridApi.paginationSetPageSize(size);
    };
    /** 设置行号, 兼容分页 **/
    CtlGrid.prototype.setRowId = function (p) {
        return CtlGridIdRender(p, this);
    };
    CtlGrid.prototype._gridOptions = function () {
        _.assign(this, __assign(__assign({}, _.clone(YvGridProp)), this.vjson));
        var resultCols = [];
        //显示序号列
        if (this.showRowNumber) {
            resultCols.push({
                field: '__ID__',
                headerName: CtlGridLocale.rownumber,
                width: 52,
                //minWidth: 52,
                maxWidth: 160,
                pinned: 'left',
                resizable: true,
                sortable: false,
                cellRenderer: 'CtlGridIdRender'
            });
        }
        //显示勾选框
        if (this.checkbox) {
            resultCols.push({
                field: '__CB__',
                headerName: '',
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'left',
                resizable: false,
                sortable: false,
                cellRenderer: 'CtlGridCellCheckbox',
                headerComponent: 'CtlGridHeadCheckbox',
                cellRendererParams: {
                    isCheckedIds: true
                }
            });
        }
        //添加自定义列
        this._gridCols(resultCols);
        var columnDefs = resultCols;
        if (!this.columnGroup || _.size(this.columnGroup) <= 0) {
            //没有多级表头
            columnDefs = resultCols;
        }
        else {
            //二级表头
            columnDefs = [];
            var j = 0;
            var currentGroup = void 0;
            var currentGroupSpan = -1;
            for (var i = 0; i < resultCols.length; i++) {
                var _a = this.columnGroup[j], from = _a.from, title = _a.title, span = _a.span, width = _a.width;
                var f = resultCols[i];
                if (!this.columnGroup[j]) {
                    columnDefs.push(f);
                }
                if (currentGroupSpan > 0) {
                    currentGroup.children.push(f);
                    currentGroupSpan--;
                    if (currentGroupSpan <= 0) {
                        j++;
                    }
                }
                else if (f.field === from) {
                    currentGroup = {
                        width: width,
                        headerName: title,
                        children: [f]
                    };
                    currentGroupSpan = span - 1;
                    columnDefs.push(currentGroup);
                }
                else {
                    columnDefs.push(f);
                }
            }
        }
        var gridOptions = {
            headerHeight: 35,
            rowHeight: 33,
            suppressRowHoverHighlight: true,
            columnDefs: columnDefs,
            animateRows: false,
            suppressCellSelection: !this.allowCellSelection,
            suppressRowClickSelection: !this.allowRowSelection,
            suppressColumnMoveAnimation: true,
            pagination: this.pagination,
            paginationPageSize: this.pageSize,
            localeText: CtlGridLocale,
            rowModelType: 'infinite',
            infiniteInitialRowCount: 200,
            //maxConcurrentDatasourceRequests: 2,
            maxBlocksInCache: 5,
            //cacheOverflowSize
            rowSelection: 'single',
            enableBrowserTooltips: true,
            //enableCellChangeFlash: true,
            singleClickEdit: this.editSingleClick,
            floatingFilter: false,
            stopEditingWhenGridLosesFocus: this.stopEditingWhenGridLosesFocus,
            onFirstDataRendered: this._firstDataRendered.bind(this),
            onGridReady: this._gridReady.bind(this),
            tabToNextCell: this._tabToNextCell.bind(this),
            navigateToNextCell: this._navigateToNextCell.bind(this),
            onCellKeyDown: this._cellKeyDown.bind(this),
            onRowDoubleClicked: this._rowDoubleClicked.bind(this),
            onCellEditingStarted: this._cellEditingStarted.bind(this),
            onCellEditingStopped: this._cellEditingStopped.bind(this),
            onRowSelected: this._rowSelected.bind(this),
            onModelUpdated: this._modelUpdated.bind(this),
            onCellFocused: this._cellFocused.bind(this),
            onCellClicked: this._cellClicked.bind(this),
            onFilterChanged: this._filterChanged.bind(this),
            onSortChanged: this._sortChanged.bind(this),
            enterMovesDown: false,
            enterMovesDownAfterEdit: false,
            accentedSort: true,
            components: {
                CtlGridCellButton: CtlGridCellButton,
                CtlGridCellCheckbox: CtlGridCellCheckbox,
                CtlGridHeadCheckbox: CtlGridHeadCheckbox,
                CtlGridEditorText: CtlGridEditorText,
                CtlGridEditorCombo: CtlGridEditorCombo,
                // // YvGridEditorDate: YvGridEditorDate,
                CtlGridFilterSet: CtlGridFilterSet,
                CtlGridIdRender: this.setRowId.bind(this) //CtlGridIdRender.bind(this)
            }
        };
        if (_.isArray(this.dataSource)) {
            //有数据，按 client 模式加载数据
            _.assign(gridOptions, {
                rowModelType: 'clientSide',
                rowData: this.data,
                data: []
            });
        }
        if (this.pagination) {
            _.assign(gridOptions, {
                rowModelType: 'clientSide',
                rowData: [],
                data: []
            });
        }
        return gridOptions;
    };
    CtlGrid.prototype._filterChanged = function () {
        if (this.dataSourceBind) {
            if ((!_.isEqual(this.gridApi.getFilterModel(), this.dataSourceBind.lastFilterModel)) || this.refreshMode == GridRefreshMode.refreshAndClearFilter) {
                var reload = _.get(this.dataSourceBind, 'reload');
                if (typeof reload === 'function') {
                    reload.call(this.dataSourceBind);
                }
            }
            // console.log('_filterChanged', this.gridApi.getFilterModel());
        }
    };
    CtlGrid.prototype._sortChanged = function () {
        if (this.dataSourceBind) {
            if ((!_.isEqual(this.gridApi.getSortModel(), this.dataSourceBind.lastSortModel)) || this.refreshMode == GridRefreshMode.refreshAndClearFilter) {
                var reload = _.get(this.dataSourceBind, 'reload');
                if (typeof reload === 'function') {
                    reload.call(this.dataSourceBind);
                }
            }
            // console.log('_sortChanged', this.gridApi.getSortModel());
        }
    };
    CtlGrid.prototype._gridReady = function () {
        this.isGridReadReady = true;
        /** 分页视图 **/
        this.gridPage = new CtlGridPage(this);
        this._rebindDataSource();
    };
    CtlGrid.prototype._resetGrid = function () {
        this.isGridReadReady = false;
        var gridOptions = this._gridOptions();
        var $el = $(this._webix._viewobj).find('[role="yvGrid"]')[0];
        var grid = new agGrid.Grid($el, gridOptions);
        grid.gridOptions.api.vue = this;
        this.gridApi = grid.gridOptions.api;
        this.columnApi = grid.gridOptions.columnApi;
        //去掉 ag-unselectable 使表格允许被选定
        if ($el) {
            $($el)
                .find('.ag-root.ag-unselectable')
                .removeClass('ag-unselectable');
        }
    };
    CtlGrid.prototype._rowDoubleClicked = function (e) {
        YvEventDispatch(this.onRowDblClick, this, e.data);
    };
    /**
     * 获取下拉框的数据选项
     */
    CtlGrid.prototype._getComboFilterData = function (easyuiCol) {
        if (easyuiCol.editMode === 'combo') {
            if (typeof easyuiCol.editParams.data === 'string') {
                if (YvanUI.dict.hasOwnProperty(easyuiCol.editParams.data)) {
                    return YvanUI.dict[easyuiCol.editParams.data];
                }
                else if (YvanUI.formatter.hasOwnProperty(easyuiCol.editParams.data)) {
                    return YvanUI.formatter[easyuiCol.editParams.data];
                }
                else {
                    console.error('没有发现全局函数 YvanUI.formatter[dict].' +
                        easyuiCol.editParams.data);
                }
            }
            else if (easyuiCol.editParams.data.constructor === Array) {
                var editParams_1 = easyuiCol.editParams;
                return _.map(editParams_1.data, function (item) {
                    return {
                        id: item[editParams_1.idField],
                        text: item[editParams_1.textField]
                    };
                });
            }
        }
        var formatter = easyuiCol.formatter;
        if (typeof easyuiCol.formatter === 'string') {
            // formatter 是字符串，从全局 YvanUI.formatter 找方法
            if (YvanUI.dict.hasOwnProperty(easyuiCol.formatter)) {
                formatter = YvanUI.dict[easyuiCol.formatter];
            }
            else if (YvanUI.formatter.hasOwnProperty(easyuiCol.formatter)) {
                easyuiCol.formatter = YvanUI.formatter[easyuiCol.formatter];
            }
            else {
                console.error('没有发现全局函数 YvanUI.formatter[dict].' + easyuiCol.editParams.data);
            }
        }
        if (formatter && formatter.constructor === Array) {
            // formatter 是数组，就是下拉数据本身
            return formatter;
        }
    };
    /**
     * 第一次数据被渲染之后
     */
    CtlGrid.prototype._firstDataRendered = function () {
        YvEventDispatch(this.onFirstDataRendered, this, undefined);
    };
    /**
     * 接受更新
     * 状态位显示 OK, 删除 origin 数据, 并闪烁当前行
     */
    CtlGrid.prototype._acceptChanges = function (node) {
        if (node.origin) {
            node.cstate = 'ok';
            delete node.origin;
            this.flashRow(node);
            node.setDataValue('__ID__', _.uniqueId());
        }
    };
    /**
     * 清空所有状态，准备获取新数据
     * 当前编辑都应该清空, 勾选也应该清空
     */
    CtlGrid.prototype._clearCache = function () {
        this.checkedIds = [];
        this.gridApi.forEachNode(function (node) {
            delete node.cstate;
            delete node.origin;
        });
    };
    /**
     * 根据行，获取主键 ID, 当主键不存在时 返回 undefined
     */
    CtlGrid.prototype._getIdByRow = function (row) {
        if (!row)
            return;
        if (this.idField) {
            if (this.idField.constructor === Array) {
                //联合组件，用valueSep分割
                return _.map(this.idField, function (f) { return _.toString(row[f]); }).join(this.valueSep);
            }
            return row[this.idField];
        }
        console.error('表格没有设置主键！！');
        return undefined;
    };
    /**
     * 重新绑定数据源
     */
    CtlGrid.prototype._rebindDataSource = function () {
        var _this = this;
        var innerMethod = function () {
            if (_this.dataSourceBind) {
                _this.dataSourceBind.destory();
                _this.dataSourceBind = undefined;
            }
            if (_this._webix && _this._module) {
                _this.dataSourceBind = new YvanDataSourceGrid(_this, _this.dataSource);
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
    /**
     * 每次 AJAX 请求完毕之后会回调这里
     */
    CtlGrid.prototype._bindingComplete = function () {
        YvEventDispatch(this.onBindingComplete, this, undefined);
    };
    /**
     * 找到某行的 node, （一旦匹配到 condition 就停止）
     */
    CtlGrid.prototype._findNode = function (condition) {
        var _this = this;
        if (!condition) {
            //返回第一条被找到的数据
            condition = function () { return true; };
        }
        else if (typeof condition === 'string') {
            //以主键查找的方式
            var key_1 = condition;
            condition = function (n) {
                return _this._getIdByRow(n.data) === key_1;
            };
        }
        else if (typeof condition === 'object') {
            //就是 node 对象, 直接返回
            return condition;
        }
        var me = this;
        var findNode = undefined;
        try {
            this.gridApi.forEachNode(function (node) {
                if (condition.call(me, node)) {
                    findNode = node;
                    throw Error();
                }
            });
        }
        catch (e) { }
        return findNode;
    };
    CtlGrid.prototype._cellKeyDown = function (param) {
        //event.stopPropagation();
        //event.preventDefault();
        //通知外部
        var r = YvEventDispatch(this.onKeyDown, this, param);
        if (r === true) {
            //已经被自定义函数处理掉
            return;
        }
        if (param.event.keyCode === 13) {
            param.event.stopPropagation();
            param.event.preventDefault();
            return;
        }
        if (param.event.keyCode === 27) {
            //按下 ESC 还原数据到 origin 状态, 并删除所有编辑形式
            if (param.node.origin) {
                param.event.stopPropagation();
                param.event.preventDefault();
                var data = __assign(__assign({}, param.data), param.node.origin);
                delete param.node.cstate;
                delete param.node.origin;
                param.node.updateData(data);
                param.node.setDataValue('__ID__', _.uniqueId());
            }
        }
        //console.log('cellKeyDown', param);
    };
    CtlGrid.prototype._modelUpdated = function () {
        if (this.autoSizeColumns && this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    };
    CtlGrid.prototype._cellFocused = function (param) {
        YvEventDispatch(this.onCellFocused, this, param);
    };
    CtlGrid.prototype._cellClicked = function (param) {
        YvEventDispatch(this.onCellClicked, this, param);
    };
    CtlGrid.prototype._rowSelected = function (param) {
        var node = param.node;
        var selected = node.selected, id = node.id;
        if (!selected) {
            //行离开事件,查看是否有数据正在编辑，提交校验
            this._rowEditingStopped(id, param);
            return;
        }
        //触发 entity 改变
        if (_.size(this.entityName) > 0) {
            _.set(this.getModule(), this.entityName + '.selectedRow', param.data);
            //this.vcxt.module.$set(this.vcxt.module[this.entityName], "selectedRow", param.data);
        }
        //触发 onRowSelect 事件
        YvEventDispatch(this.onRowSelect, this, param.data);
    };
    CtlGrid.prototype._cellEditingStarted = function (param) {
        var rowId;
        if (param.node.rowPinned === 'top') {
            //在添加行上
            rowId = -1;
        }
        else if (!param.node.rowPinned) {
            //在数据行上
            rowId = param.node.id;
        }
        this._rowEditingStarted(rowId, param);
    };
    CtlGrid.prototype._cellEditingStopped = function (param) {
        //触发单元格校验事件
        if (this.saveOn !== 'editFinish') {
            //保存时机，是不是结束编辑后立刻保存
            return;
        }
        var origin = param.node.origin;
        if (!origin) {
            // 这一行没有进入过编辑模式
            return;
        }
        var data = _.cloneDeep(param.data);
        delete data['__ID__'];
        delete data['__CB__'];
        _.forOwn(origin, function (value, key) {
            if (typeof value === 'number') {
                origin[key] = _.toString(value);
            }
        });
        _.forOwn(data, function (value, key) {
            if (typeof value === 'number') {
                data[key] = _.toString(value);
            }
        });
        if (_.isEqual(origin, data)) {
            //相同，改变状态位 same
            param.node.cstate = 'same';
        }
        else {
            //不相同, 提交校验
            param.node.cstate = 'validate';
            if (this.dataSourceBind) {
                if (this.dataSourceBind.updateSupport()) {
                    this.dataSourceBind._updateRow(param);
                }
            }
            //console.log(this.dataSource, param.node)
            //setTimeout(() => {
            //    this._acceptChanges(param.node)
            //}, 2000)
        }
        param.node.setDataValue('__ID__', _.uniqueId());
    };
    CtlGrid.prototype._rowEditingStarted = function (rowId, param) {
        if (!param.node.origin) {
            // 以前从来没有编辑过这一行, 记录 origin
            var data = _.cloneDeep(param.data);
            delete data['__ID__'];
            delete data['__CB__'];
            param.node.origin = data;
        }
        param.node.cstate = 'editing';
        param.node.setDataValue('__ID__', _.uniqueId());
    };
    CtlGrid.prototype._rowEditingStopped = function (rowId, param) {
        if (this.saveOn !== 'rowChanged') {
            //保存时机，是不是行更改后立刻保存
            return;
        }
        var origin = param.node.origin;
        if (!origin) {
            // 这一行没有进入过编辑模式
            return;
        }
        var data = _.cloneDeep(param.data);
        delete data['__ID__'];
        delete data['__CB__'];
        _.forOwn(origin, function (value, key) {
            if (typeof value === 'number') {
                origin[key] = _.toString(value);
            }
        });
        _.forOwn(data, function (value, key) {
            if (typeof value === 'number') {
                data[key] = _.toString(value);
            }
        });
        if (_.isEqual(origin, data)) {
            //相同，改变状态位 same
            param.node.cstate = 'same';
        }
        else {
            //不相同, 提交校验
            param.node.cstate = 'validate';
            if (this.dataSourceBind) {
                this.dataSourceBind._updateRow(param);
            }
            //console.log(this.dataSource, param.node)
            //setTimeout(() => {
            //    this._acceptChanges(param.node)
            //}, 2000)
        }
        param.node.setDataValue('__ID__', _.uniqueId());
    };
    /**
     * Tab键导航
     */
    CtlGrid.prototype._tabToNextCell = function (params) {
        var previousCell = params.previousCellPosition;
        var nextCellPosition = params.nextCellPosition;
        //tab 永不换行
        return __assign(__assign({}, nextCellPosition), { rowIndex: previousCell.rowIndex });
    };
    /**
     * 上下左右键导航
     */
    CtlGrid.prototype._navigateToNextCell = function (params) {
        var KEY_LEFT = 37;
        var KEY_UP = 38;
        var KEY_RIGHT = 39;
        var KEY_DOWN = 40;
        var previousCell = params.previousCellPosition;
        var suggestedNextCell = params.nextCellPosition;
        switch (params.key) {
            case KEY_UP: {
                var nextRowIndex_1 = previousCell.rowIndex - 1;
                if (nextRowIndex_1 < 0) {
                    // returning null means don't navigate
                    return null;
                }
                this.selectRow(function (node) { return node.rowIndex === nextRowIndex_1; });
                return {
                    rowIndex: nextRowIndex_1,
                    column: previousCell.column,
                    floating: previousCell.floating
                };
            }
            case KEY_DOWN: {
                // return the cell below
                var rowIndex_1 = previousCell.rowIndex + 1;
                var renderedRowCount = this.gridApi.getModel().getRowCount();
                if (rowIndex_1 >= renderedRowCount) {
                    // returning null means don't navigate
                    return null;
                }
                this.selectRow(function (node) { return node.rowIndex === rowIndex_1; });
                return {
                    rowIndex: rowIndex_1,
                    column: previousCell.column,
                    floating: previousCell.floating
                };
            }
            case KEY_LEFT:
            case KEY_RIGHT:
                return suggestedNextCell;
            default:
                throw 'this will never happen, navigation is always one of the 4 keys above';
        }
    };
    /**
     * 列设置计算
     */
    CtlGrid.prototype._gridCols = function (resultCols) {
        var _this = this;
        _.each(this.columns, function (column) {
            var easyuiCol = _.merge(__assign(__assign({}, _.clone(YvGridColumnProp)), { editParams: __assign({}, _.clone(YvGridColumnEditProp)) }), column);
            //=========================== 设计模式属性 ===========================
            // if (this._isDesignMode) {
            //     resultCols.push({
            //         suppressMovable: true,
            //         field: easyuiCol.field,
            //         headerName: easyuiCol.title,
            //         resizable: true,
            //         filter: false,
            //         editable: false,
            //         sortable: false,
            //         //unSortIcon: true,
            //         hide: false,
            //         width: easyuiCol.width,
            //         minWidth: easyuiCol.minwidth,
            //         maxWidth: easyuiCol.maxwidth
            //     });
            //     return;
            // }
            //=========================== 基本属性 ===========================
            var col = {
                suppressMovable: true,
                field: easyuiCol.field,
                headerName: easyuiCol.title,
                resizable: easyuiCol.resizable,
                filter: false,
                editable: false,
                sortable: easyuiCol.sortable,
                //unSortIcon: true,
                hide: easyuiCol.hidden
            };
            if (easyuiCol.sortable) {
                // 走服务端排序，客户端排序可以让其无效
                col.comparator = function () {
                    return 0;
                };
            }
            if (typeof easyuiCol.width !== 'undefined')
                col.width = easyuiCol.width;
            if (typeof easyuiCol.minwidth !== 'undefined')
                col.minWidth = easyuiCol.minwidth;
            if (typeof easyuiCol.maxwidth !== 'undefined')
                col.maxWidth = easyuiCol.maxwidth;
            if (typeof easyuiCol.align !== 'undefined') {
                col.cellClass = function (params) {
                    return ['yv-align-' + easyuiCol.align];
                };
            }
            if (_.size(easyuiCol.field) > 0) {
                col.tooltipField = easyuiCol.field;
            }
            //=========================== buttons 属性 ===========================
            if (easyuiCol.buttons) {
                //col.cellRendererFramework = 'yvGridButton'
                col.cellRenderer = 'CtlGridCellButton';
                col.cellRendererParams = {
                    buttons: easyuiCol.buttons
                };
            }
            //=========================== 编辑与formatter属性 ===========================
            var editParams = easyuiCol.editParams;
            var formatable = false;
            if (easyuiCol.editable) {
                if (easyuiCol.editMode === 'checkbox') {
                    //勾选框编辑
                    formatable = false;
                    col.cellRenderer = 'CtlGridCellCheckbox';
                    col.cellRendererParams = {
                        editParams: easyuiCol.editParams,
                        on: editParams.on,
                        off: editParams.off,
                        onChange: function (newValue) {
                            YvEventDispatch(editParams.onValidate, _this, {
                                value: newValue
                            });
                        },
                        onValidate: function (value) {
                            YvEventDispatch(editParams.onValidate, _this, {
                                value: value
                            });
                        }
                    };
                    if (easyuiCol.editable) {
                        //允许编辑
                        _.assign(col, {
                            editable: true,
                            cellEditor: 'CtlGridEditorCombo',
                            cellEditorParams: {
                                editParams: easyuiCol.editParams,
                                options: [
                                    { id: editParams.on, text: '勾选' },
                                    { id: editParams.off, text: '不勾' }
                                ],
                                onChange: function (newValue) {
                                    YvEventDispatch(editParams.onValidate, _this, {
                                        value: newValue
                                    });
                                },
                                onValidate: function (value) {
                                    YvEventDispatch(editParams.onValidate, _this, {
                                        value: value
                                    });
                                }
                            }
                        });
                    }
                }
                else if (easyuiCol.editMode === 'combo') {
                    //下拉框编辑
                    formatable = false;
                    _.assign(col, {
                        editable: true,
                        cellEditor: 'CtlGridEditorCombo',
                        cellEditorParams: {
                            editParams: easyuiCol.editParams,
                            options: _this._getComboFilterData(easyuiCol),
                            onChange: function (newValue) {
                                YvEventDispatch(editParams.onValidate, _this, {
                                    value: newValue
                                });
                            },
                            onValidate: function (value) {
                                YvEventDispatch(editParams.onValidate, _this, {
                                    value: value
                                });
                            }
                        }
                    });
                    //下拉框的 formatter 逻辑是固定的
                    var data_1 = _this._getComboFilterData(easyuiCol);
                    if (typeof data_1 === 'function') {
                        col.valueFormatter = function (params) {
                            return data_1(params.value);
                        };
                    }
                    else {
                        col.valueFormatter = function (params) {
                            if (_.size(params.data) <= 0)
                                return;
                            var optionItem = _.find(data_1, function (item) {
                                var id = _.toString(item['id']);
                                return id && id === _.toString(params.value);
                            });
                            if (optionItem) {
                                //找到text属性值
                                return optionItem['text'];
                            }
                            return params.value;
                        };
                    }
                }
                else if (easyuiCol.editMode === 'area') {
                    //大型富文本框编辑
                    formatable = true;
                    _.assign(col, {
                        editable: true,
                        cellEditor: 'agLargeTextCellEditor',
                        cellEditorParams: {
                            editParams: easyuiCol.editParams,
                            maxLength: editParams.maxlength
                        }
                    });
                }
                else if (easyuiCol.editMode === 'text' || easyuiCol.editMode === 'number') {
                    //普通文本框编辑
                    formatable = true;
                    _.assign(col, {
                        editable: true,
                        cellEditor: 'CtlGridEditorText',
                        cellEditorParams: {
                            type: easyuiCol.editMode,
                            editParams: easyuiCol.editParams,
                            onChange: function (newValue) {
                                YvEventDispatch(editParams.onValidate, _this, {
                                    value: newValue
                                });
                            },
                            onValidate: function (value) {
                                YvEventDispatch(editParams.onValidate, _this, {
                                    value: value
                                });
                            },
                            onInput: function (e) {
                                YvEventDispatch(editParams.onInput, _this, _this, {
                                    event: e
                                });
                            }
                        }
                    });
                }
                else if (easyuiCol.editMode === 'date' || easyuiCol.editMode === 'datetime') {
                    formatable = true;
                    // _.assign(col, {
                    //     editable: true,
                    //     cellEditor: "YvGridEditorDate",
                    //     cellEditorParams: {
                    //         type: easyuiCol.editMode,
                    //         editParams: easyuiCol.editParams,
                    //         onChange: newValue => {
                    //             this.$yvDispatch(editParams.onValidate, newValue, this.getEditRow());
                    //         },
                    //         onValidate: value => {
                    //             this.$yvDispatch(editParams.onValidate, value, this.getEditRow());
                    //         },
                    //         onInput: e => {
                    //             this.$yvDispatch(editParams.onInput, e, this.getEditRow());
                    //         }
                    //     }
                    // });
                    console.error('not support date editor');
                }
            }
            else {
                //不允许编辑的情况，全都允许格式化
                formatable = true;
            }
            //=========================== formatter属性 ===========================
            if (formatable) {
                var data_2 = _this._getComboFilterData(easyuiCol);
                if (data_2) {
                    //从下拉框逻辑中找到了固定映射关系
                    col.valueFormatter = function (params) {
                        if (_.size(params.data) <= 0)
                            return undefined;
                        var optionItem = _.find(data_2, function (item) {
                            var id = _.toString(item['id']);
                            return id && id === _.toString(params.value);
                        });
                        if (optionItem) {
                            //找到text属性值
                            return optionItem['text'];
                        }
                        return params.value;
                    };
                }
                else {
                    //以 function 方式获得显示逻辑
                    var formatter_1 = easyuiCol.formatter;
                    if (typeof easyuiCol.formatter === 'string') {
                        // formatter 是字符串，从全局 YvanUI.formatter 找方法
                        if (!YvanUI.formatter.hasOwnProperty(easyuiCol.formatter)) {
                            console.error('没有发现全局函数 YvanUI.formatter.' + easyuiCol.formatter);
                        }
                        else {
                            formatter_1 = YvanUI.formatter[easyuiCol.formatter];
                        }
                    }
                    if (typeof formatter_1 === 'function') {
                        //formatter 是函数，调用函数来显示
                        col.valueFormatter = function (params) {
                            if (_.size(params.data) <= 0)
                                return undefined;
                            return formatter_1.call(_this, params.data[easyuiCol.field], _this, params.data);
                        };
                    }
                }
            }
            //=========================== 过滤属性 ===========================
            if (_this.filterable && easyuiCol.filterable && !easyuiCol.hidden) {
                var datas = _this._getComboFilterData(easyuiCol);
                if (typeof datas === 'object') {
                    //下拉框过滤
                    _.assign(col, {
                        filter: 'CtlGridFilterSet',
                        //suppressMenu: true,
                        filterParams: {
                            data: datas,
                        },
                    });
                }
                else if (easyuiCol.editMode === 'number') {
                    //数字过滤
                    _.assign(col, {
                        filter: 'agNumberColumnFilter',
                        //suppressMenu: true,
                        filterParams: {
                            applyButton: true,
                            clearButton: true,
                            suppressAndOrCondition: true,
                            filterOptions: [
                                // 服务器已经设置条件，浏览器不进行实际比对
                                { displayKey: 'equals', displayName: '等于', test: function () { return true; } },
                                { displayKey: 'notEqual', displayName: '不等于', test: function () { return true; } },
                                { displayKey: 'lessThan', displayName: '小于', test: function () { return true; } },
                                { displayKey: 'greaterThan', displayName: '大于', test: function () { return true; } },
                                { displayKey: 'lessThanOrEqual', displayName: '小于等于', test: function () { return true; } },
                                { displayKey: 'greaterThanOrEqual', displayName: '大于等于', test: function () { return true; } },
                                { displayKey: 'inRange', displayName: '范围', test: function () { return true; } },
                            ]
                        }
                    });
                }
                else if (easyuiCol.editMode === 'date' || easyuiCol.editMode === 'datetime') {
                    //日期筛选
                    _.assign(col, {
                        filter: 'agDateColumnFilter',
                        filterParams: {
                            applyButton: true,
                            clearButton: true,
                            filterOptions: ['inRange'],
                            suppressAndOrCondition: true,
                            inRangeInclusive: true,
                            comparator: function (v1, v2) {
                                // 服务器已经设置条件，浏览器不进行实际比对
                                // 0 的情况，一定要包含 inRangeInclusive 条件
                                return 0;
                            }
                        }
                    });
                }
                else {
                    //其他情况都是字符串筛选
                    _.assign(col, {
                        filter: 'agTextColumnFilter',
                        filterParams: {
                            applyButton: true,
                            clearButton: true,
                            filterOptions: ['startsWith', 'equals', 'contains'],
                            suppressAndOrCondition: true,
                            textCustomComparator: function () {
                                // 服务器已经设置条件，浏览器不进行实际比对
                                return true;
                            }
                        }
                    });
                }
            }
            //=========================== 渲染属性 ===========================
            if (typeof easyuiCol.onStyle === 'function') {
                _.assign(col, {
                    cellStyle: function (param) {
                        return easyuiCol.onStyle.call(_this, param);
                    }
                });
            }
            resultCols.push(col);
        });
    };
    return CtlGrid;
}(CtlBase));
export { CtlGrid };
//# sourceMappingURL=CtlGrid.js.map
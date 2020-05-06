import { __assign } from "tslib";
import * as YvanUI from './YvanUIExtend';
import { isDesignMode } from './DesignHelper';
var YvanDataSourceGrid = /** @class */ (function () {
    function YvanDataSourceGrid(ctl, option) {
        var _this = this;
        this.watches = [];
        this.isFirstAutoLoad = true; //是否为第一次自动读取
        this.serverQuery = _.debounce(function (option, paramFunction, params) {
            var that = _this;
            //异步请求数据内容
            that.ctl.loading = true;
            var needCount = false;
            if (typeof that.rowCount === 'undefined') {
                //从来没有统计过 rowCount(记录数)
                needCount = true;
                that.lastFilterModel = _.cloneDeep(params.filterModel);
            }
            else {
                if (!_.isEqual(that.lastFilterModel, params.filterModel)) {
                    //深度对比，如果 filter 模型更改了，需要重新统计 rowCount(记录数)
                    needCount = true;
                    that.lastFilterModel = _.cloneDeep(params.filterModel);
                }
            }
            var queryParams = __assign({}, (typeof paramFunction === 'function' ? paramFunction() : undefined));
            YvanUI.dbs[option.db]
                .query({
                params: queryParams,
                limit: params.startRow,
                limitOffset: params.endRow - params.startRow,
                needCount: needCount,
                orderByModel: params.sortModel,
                filterModel: params.filterModel,
                sqlId: option.sqlId
            })
                .then(function (res) {
                var resultData = res.data, totalCount = res.totalCount, resParams = res.params;
                if (needCount) {
                    that.rowCount = totalCount;
                }
                params.successCallback(resultData, that.rowCount);
                /** 如果不分页就在这里设置总条目数量，避免多次刷新分页栏 **/
                if (!that.ctl.pagination) {
                    that.ctl.gridPage.itemCount = that.rowCount;
                }
                that.ctl._bindingComplete();
                if (that.ctl.entityName) {
                    _.set(that.module, that.ctl.entityName + '.selectedRow', that.ctl.getSelectedRow());
                }
            })
                .catch(function (r) {
                params.failCallback();
            })
                .finally(function () {
                _this.ctl.loading = false;
            });
        });
        if (isDesignMode()) {
            return;
        }
        this.ctl = ctl;
        this.option = option;
        this.module = ctl._webix.$scope;
        if (!option) {
            //没有设值，退出
            this.reload = undefined;
            return;
        }
        if (_.isArray(option)) {
            this.setCodeArrayMode(option);
            return;
        }
        if (typeof option === 'function') {
            //以 function 方式运行
            this.setCustomFunctionMode(option, undefined);
            return;
        }
        // 使 watch 生效
        _.forOwn(option.params, function (value) {
            if (!_.has(value, '$watch')) {
                return;
            }
            var watchOption = value;
            _this.module.$watch(watchOption.$watch, function () {
                if (_this.reload) {
                    _this.reload();
                }
            });
        });
        // params 函数
        var paramFunction = function () {
            var result = {};
            _.forOwn(option.params, function (value, key) {
                if (_.has(value, '$get')) {
                    var getOption = value;
                    result[key] = _.get(_this.module, getOption.$get);
                }
                else if (_.has(value, '$watch')) {
                    var watchOption = value;
                    result[key] = _.get(_this.module, watchOption.$watch);
                }
                else {
                    result[key] = value;
                }
            });
            return result;
        };
        if (option.type === 'function') {
            if (typeof option.bind === 'function') {
                this.setCustomFunctionMode(option.bind, paramFunction);
            }
            else {
                // 取 bind 函数
                var bindFunction = _.get(this.module, option.bind);
                if (!bindFunction) {
                    console.error("\u6CA1\u6709\u627E\u5230\u540D\u79F0\u4E3A " + option.bind + " \u7684\u65B9\u6CD5");
                    return;
                }
                this.setCustomFunctionMode(bindFunction, paramFunction);
            }
            return;
        }
        if (option.type === 'SQL') {
            this.setSqlMode(option, paramFunction);
            return;
        }
        console.error("\u5176\u4ED6\u65B9\u5F0F\u6CA1\u6709\u5B9E\u73B0");
    }
    /**
     * SQL取值
     */
    YvanDataSourceGrid.prototype.setSqlMode = function (option, paramFunction) {
        var _this = this;
        var that = this;
        this.reload = function () {
            _this.ctl.loading = true;
            that.clearRowCount();
            if (that.ctl.entityName) {
                _.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
            }
            that.ctl.gridApi.hasDataSource = true;
            if (that.ctl.pagination) {
                /** 分页模式 **/
                that.ctl.gridPage.getPageData = function (currentPage, pageSize) {
                    var params = {};
                    params.successCallback = function (data, rowCount) {
                        if (data.length > 0) {
                            that.ctl.setData(data);
                            that.ctl.gridPage.itemCount = rowCount;
                            that.ctl.gridPage.currentPage = currentPage;
                        }
                    };
                    params.failCallback = function () {
                        console.error('error');
                    };
                    params.startRow = (currentPage - 1) * pageSize;
                    params.endRow = currentPage * pageSize;
                    that.serverQuery(option, paramFunction, params);
                };
                that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize);
            }
            else {
                /** 无限滚动模式 **/
                that.ctl.gridApi.setDatasource({
                    getRows: function (params) {
                        if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
                            that.rowCount = 0;
                            params.successCallback([], that.rowCount);
                            that.ctl.loading = false;
                            that.isFirstAutoLoad = false;
                            return;
                        }
                        that.serverQuery(option, paramFunction, params);
                    }
                });
            }
        };
        this.reload();
    };
    /**
     * 自定义函数式取值
     */
    YvanDataSourceGrid.prototype.setCustomFunctionMode = function (option, paramFunction) {
        var that = this;
        this.reload = function () {
            that.clearRowCount();
            if (that.ctl.entityName) {
                _.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
            }
            that.ctl.loading = true;
            // rowModelType = infinite
            that.ctl.gridApi.setDatasource({
                getRows: function (params) {
                    that.ctl.loading = true;
                    if (that.isFirstAutoLoad && that.ctl.autoLoad === false) {
                        that.rowCount = 0;
                        params.successCallback([], that.rowCount);
                        that.ctl.loading = false;
                        that.isFirstAutoLoad = false;
                        return;
                    }
                    option.call(that.module, that.ctl, {
                        param: typeof paramFunction === 'function' ? paramFunction() : undefined,
                        failCallback: function () {
                            params.failCallback();
                        },
                        successCallback: function (data, dataLength) {
                            params.successCallback(data, dataLength);
                            that.ctl.loading = false;
                            that.ctl._bindingComplete();
                            if (that.ctl.entityName) {
                                _.set(that.module, that.ctl.entityName + '.selectedRow', that.ctl.getSelectedRow());
                            }
                        }
                    });
                }
            });
        };
        this.reload();
    };
    YvanDataSourceGrid.prototype.setCodeArrayMode = function (option) {
        var _this = this;
        var that = this;
        var rowCount = option.length;
        this.reload = function () {
            _this.ctl.loading = true;
            that.clearRowCount();
            if (that.ctl.entityName) {
                _.set(that.module, that.ctl.entityName + '.selectedRow', undefined);
            }
            that.ctl.gridApi.hasDataSource = true;
            if (that.ctl.pagination) {
                /** 分页模式 **/
                that.ctl.gridPage.getPageData = function (currentPage, pageSize) {
                    var d = [];
                    var startRow = (currentPage - 1) * pageSize;
                    var endRow = currentPage * pageSize;
                    endRow = endRow > rowCount ? rowCount : endRow;
                    for (var i = startRow; i < endRow; i++) {
                        d.push(option[i]);
                    }
                    that.ctl.setData(d);
                    that.ctl.gridPage.itemCount = rowCount;
                    that.ctl.gridPage.currentPage = currentPage;
                };
                that.ctl.gridPage.getPageData(1, that.ctl.gridPage.pageSize);
            }
            else {
                /** 不分页模式 **/
                that.ctl.setData(option);
                that.ctl.gridPage.itemCount = rowCount;
            }
        };
        this.reload();
    };
    /**
     * 释放与 YvGrid 的绑定
     */
    YvanDataSourceGrid.prototype.destory = function () {
        // 解除全部 watch
        _.each(this.watches, function (unwatch) {
            unwatch();
        });
        this.reload = undefined;
    };
    /**
     * 清空 rowCount, 下次重新统计总行数
     */
    YvanDataSourceGrid.prototype.clearRowCount = function () {
        delete this.rowCount;
    };
    YvanDataSourceGrid.prototype.updateSupport = function () {
        return false;
    };
    YvanDataSourceGrid.prototype._updateRow = function (param) {
        throw new Error('not implements');
    };
    return YvanDataSourceGrid;
}());
export { YvanDataSourceGrid };
//# sourceMappingURL=YvanDataSourceGridImp.js.map
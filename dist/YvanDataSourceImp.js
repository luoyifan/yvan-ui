import { YvEventDispatch } from './YvanEvent';
import * as YvanUI from './YvanUIExtend';
import { isDesignMode } from './DesignHelper';
var YvDataSource = /** @class */ (function () {
    function YvDataSource(ctl, option, dataSourceProcess) {
        this.watches = [];
        if (isDesignMode()) {
            return;
        }
        this.ctl = ctl;
        this.option = option;
        this.dataSourceProcess = dataSourceProcess;
        this.module = ctl._webix.$scope;
    }
    /**
     * 自定义函数式取值
     */
    YvDataSource.prototype.setCustomFunctionMode = function (option) {
        var that = this;
        this.reload = function () {
            that.ctl.loading = true;
            option.call(that.module, that.ctl, {
                successCallback: function (data) {
                    if (that.dataSourceProcess) {
                        //自定义的数据处理过程
                        that.ctl.dataReal = that.dataSourceProcess(data);
                    }
                    else {
                        that.ctl.dataReal = data;
                    }
                    that.ctl.loading = false;
                    YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
                },
                failCallback: function () {
                    that.ctl.dataReal = [];
                    that.ctl.loading = false;
                    YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
                }
            });
        };
        this.reload();
    };
    /**
     * SQL取值
     */
    YvDataSource.prototype.setSqlMode = function (option) {
        var _this = this;
        var that = this;
        this.reload = function () {
            //异步请求数据内容
            that.ctl.loading = true;
            YvanUI.dbs[option.db]
                .query({
                params: option.params,
                needCount: false,
                sqlId: option.sqlId
            })
                .then(function (res) {
                var resultData = res.data, resParams = res.params;
                if (_this.dataSourceProcess) {
                    //自定义的数据处理过程
                    that.ctl.dataReal = _this.dataSourceProcess(resultData);
                }
                else {
                    that.ctl.dataReal = resultData;
                }
                YvEventDispatch(that.ctl.onDataComplete, that.ctl, undefined);
            })
                .catch(function (r) {
                that.ctl.dataReal = [];
            })
                .finally(function () {
                that.ctl.loading = false;
            });
        };
        this.reload();
    };
    YvDataSource.prototype.init = function () {
        var _this = this;
        if (!this.option) {
            //没有设值，退出
            this.reload = undefined;
            return;
        }
        if (typeof this.option === 'function') {
            //以 function 方式运行
            this.setCustomFunctionMode(this.option);
            return;
        }
        if (_.isArray(this.option)) {
            //结果就是数组
            this.reload = function () {
                _this.ctl.dataReal = _this.option;
                _this.ctl.$yvDispatch(_this.ctl.onDataComplete);
            };
            this.reload();
            return;
        }
        // 使 watch 生效
        _.each(this.option.watch, function (watchExp) {
            var unwatch = _this.module.$watch(watchExp, function () {
                if (_this.reload) {
                    _this.reload();
                }
            });
            _this.watches.push(unwatch);
        });
        if (this.option.type === 'function') {
            // 取 bind 函数
            if (typeof this.option.bind === 'function') {
                this.setCustomFunctionMode(this.option.bind);
            }
            else {
                var bindFunction = _.get(this.module, this.option.bind);
                if (!bindFunction) {
                    console.error("\u6CA1\u6709\u627E\u5230\u540D\u79F0\u4E3A " + this.option.bind + " \u7684\u65B9\u6CD5");
                    return;
                }
                this.setCustomFunctionMode(bindFunction);
            }
        }
        else if (this.option.type === 'SQL') {
            this.setSqlMode(this.option);
        }
        else {
            console.error("\u5176\u4ED6\u65B9\u5F0F\u6CA1\u6709\u5B9E\u73B0");
        }
    };
    YvDataSource.prototype.destory = function () {
        // 解除全部 watch
        _.each(this.watches, function (unwatch) {
            unwatch();
        });
        this.reload = undefined;
        this.ctl.dataReal = [];
    };
    return YvDataSource;
}());
export { YvDataSource };
//# sourceMappingURL=YvanDataSourceImp.js.map
import { __extends } from "tslib";
import { parseYvanPropChangeVJson } from '../../CtlUtils';
import { YvEventDispatch } from '../../YvanEvent';
import { CtlSearchDefault } from '../../CtlDefaultValue';
import { CtlInput } from './CtlInput';
var CtlSearch = /** @class */ (function (_super) {
    __extends(CtlSearch, _super);
    function CtlSearch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*============================ 私有部分 ============================*/
        // 编辑值
        _this.valueEdit = undefined;
        // 是否设置真实值
        _this.supportChangeValue = false;
        // 真实值
        _this.valueReal = undefined;
        return _this;
    }
    CtlSearch.create = function (module, vjson) {
        var that = new CtlSearch(vjson);
        that._module = module;
        var vvjson = _.cloneDeep(vjson);
        _.defaultsDeep(vjson, CtlSearchDefault);
        // 基础属性先执行
        that._create(vjson, that);
        var yvanProp = parseYvanPropChangeVJson(vjson, ['widget', 'value']);
        // 将 vjson 存至 _webix (此时 _webix 还只是 vjson 代理对象)
        that._webixConfig = vjson;
        if (!vjson.id) {
            that.id = _.uniqueId('input_');
        }
        // 将 yvanProp 合并至当前 Ctl 对象
        _.assign(that, yvanProp);
        _.merge(vjson, that._webixConfig, {
            on: {
                onInited: function () {
                    that.attachHandle(this, vvjson);
                    that._refreshIcon();
                },
                // onAfterRender(this: any) {
                //     const $dom: any = $(this.$view);
                //     $dom.on('keydown', (event: KeyboardEvent) => {
                //         if (event.keyCode === 13) {
                //             // 从键盘响应查询
                //             event.stopPropagation();
                //             event.preventDefault();
                //
                //             that.suppressRestore = true;
                //             that._searchRequest(that._webix.getValue(), that.valueOrigin);
                //             return;
                //         }
                //
                //         YvEventDispatch(this.onKeydown, this, event);
                //     });
                // },
                onEnter: function () {
                    // 从键盘响应查询
                    that._searchRequest(that._webix.getValue(), that.valueEdit);
                },
                onFocus: function () {
                    //进入焦点时，用户输入的值既为有效值
                    that.valueReal = that._webix.getValue();
                    YvEventDispatch(that.onFocus, that, undefined);
                },
                onBlur: function () {
                    if (that.onValidate || that._required) {
                        var result = that._resultToShowOrHide();
                        if (result) {
                            that._showValidateError();
                        }
                        else {
                            that._hideValidateError();
                        }
                    }
                    that._hideTootip();
                    //离开焦点时，用户输入的置为无效
                    that._webix.setValue(that.valueReal);
                    YvEventDispatch(that.onBlur, that, undefined);
                },
                // onDestruct(this: any) {
                //     const $dom: any = $(this.$view);
                //     $dom.off('keydown');
                // },
                onSearchIconClick: function (e) {
                    // 从鼠标响应查询
                    e.stopPropagation();
                    e.preventDefault();
                    var $span = $(e.target);
                    if ($span.hasClass('wxi-close')) {
                        // 清空
                        that.clear();
                    }
                    else {
                        // 查询
                        that._searchRequest(that._webix.getValue(), that.valueEdit);
                    }
                }
            }
        });
        return that;
    };
    /**
     * 清空值
     */
    CtlSearch.prototype.clear = function () {
        var _this = this;
        if (!this.widget) {
            return;
        }
        this.supportChangeValue = true;
        // 发出 onClear 事件，如果事件返回 true，代表不用再清空
        var hasHandle = YvEventDispatch(this.widget.onClear, this, undefined);
        if (!hasHandle) {
            //清空
            _.forOwn(this.widget.bind, function (value, key) {
                _.set(_this._module, key, '');
            });
        }
    };
    Object.defineProperty(CtlSearch.prototype, "value", {
        get: function () {
            if (!this._webix) {
                return this._webixConfig.value;
            }
            return this.valueReal;
        },
        set: function (nv) {
            if (!this._webix) {
                this._webixConfig.value = nv;
            }
            else {
                this._webix.setValue(nv);
                this.valueEdit = nv;
            }
            if (this.supportChangeValue) {
                this.valueReal = nv;
                this.supportChangeValue = false;
            }
            YvEventDispatch(this.onChange, this, nv);
            this._refreshIcon();
        },
        enumerable: true,
        configurable: true
    });
    CtlSearch.prototype._refreshIcon = function () {
        var value = this._webix ? this._webix.getValue() : this._webixConfig.value;
        var icon = value ? 'wxi-close' : 'wxi-search';
        var $span = this._webix ? $(this._webix.$view).find('span') : undefined;
        if (!$span || $span.length <= 0) {
            if (this._webix) {
                this._webix.define('icon', icon);
            }
            else {
                this._webixConfig.icon = icon;
            }
        }
        else {
            $span
                .removeClass('wxi-close')
                .removeClass('wxi-search')
                .addClass(icon);
        }
    };
    /**
     * 进入查询框
     */
    CtlSearch.prototype._searchRequest = function (queryValue, restoreValue) {
        var _this = this;
        queryValue = _.toString(queryValue);
        var searchCtl = this;
        if (!searchCtl.widget) {
            console.error('没有设置 widget 属性');
            return;
        }
        var widgetParamter = {
            query: queryValue,
            params: searchCtl.widget.params
        };
        //构造查询的对象
        //从 bind 获取
        var queryObj = {};
        _.forOwn(searchCtl.widget.bind, function (value, key) {
            _.set(queryObj, value, _.get(_this._module, key));
        });
        widgetParamter.existObject = queryObj;
        widgetParamter.onWidgetConfirm = function (data) {
            if (!searchCtl.widget) {
                console.error('没有设置 widget 属性');
                return;
            }
            searchCtl.supportChangeValue = true;
            YvEventDispatch(searchCtl.widget.onConfirm, searchCtl, undefined);
            //写回
            _.forOwn(searchCtl.widget.bind, function (value, key) {
                _.set(searchCtl._module, key, _.get(data, value));
            });
            this.closeDialog();
            searchCtl.focus();
        };
        widgetParamter.onClose = function () {
            //弹窗关闭后恢复原值，并开启还原
            searchCtl.value = restoreValue;
            searchCtl.supportChangeValue = false;
            searchCtl.focus();
        };
        var dlg = new searchCtl.widget.content();
        dlg.showDialog(widgetParamter, searchCtl._module, true);
        // YvanUI.showDialogWidget(this, new searchCtl.widget.content(), widgetParamter);
    };
    return CtlSearch;
}(CtlInput));
export { CtlSearch };
//# sourceMappingURL=CtlSearch.js.map
import { YvEventDispatch } from './YvanEvent';
import { isDesignMode } from './DesignHelper';
import webix from 'webix';
var CtlBase = /** @class */ (function () {
    function CtlBase(vjson) {
        /**
         * 定焦时间
         */
        this.ff = 0;
        this.vjson = _.cloneDeep(vjson);
        if (vjson.hasOwnProperty('debugger')) {
            debugger;
        }
    }
    /**
     * 强制组件获得焦点
     */
    CtlBase.prototype.focus = function () {
        if (!this._webix) {
            return;
        }
        this._webix.focus();
    };
    Object.defineProperty(CtlBase.prototype, "loading", {
        /**
         * 设置正在读取中的状态
         */
        set: function (nv) {
            if (nv) {
                webix.extend(this._webix, webix.OverlayBox);
                //this._webix.showOverlay("<div style='...'>There is no data</div>");
                this._webix.showOverlay('Loading...');
            }
            else {
                this._webix.hideOverlay();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取模块
     */
    CtlBase.prototype.getModule = function () {
        return this._module;
    };
    /**
     * 组件被渲染后触发
     */
    CtlBase.prototype.attachHandle = function (webixHandler) {
        this._webix = webixHandler;
        this._module = this._webix.$scope;
        YvEventDispatch(this.onRender, this, undefined);
        this.refreshState();
    };
    /**
     * 组件被移除后触发
     */
    CtlBase.prototype.removeHandle = function () {
        var d = this._webix;
        if (!d) {
            return;
        }
        this._webix = undefined;
        if (d) {
            d.destructor();
        }
        this.refreshState();
    };
    /**
     * 控件 value 值发生变化后，设置 entityName 对应的值
     */
    CtlBase.prototype.changeToEntity = function (value) {
        if (this.entityName) {
            // 带 entityName 实体绑定
            _.set(this._module, this.entityName, value);
        }
    };
    /**
     * vue 或 webix 组件被设置后触发
     */
    CtlBase.prototype.refreshState = function () {
        var _this = this;
        if (isDesignMode()) {
            return;
        }
        if (this._webix) {
            /* ================================ 安装 ================================ */
            if (this.ctlName) {
                // 带 ctlName 控件属性
                this._module.refs[this.ctlName] = this;
            }
            if (this.entityName) {
                // 带 entityName 实体绑定
                this._entityWatch = this._module.$watch(this.entityName, function (nv, ov) {
                    _.set(_this, 'value', nv);
                }, { immediate: true });
            }
            return;
        }
        /* ================================ 卸载 ================================ */
        if (this.ctlName) {
            // 删除控件
            if (this._module) {
                delete this._module.refs[this.ctlName];
            }
        }
        if (this._entityWatch) {
            // 解除绑定
            this._entityWatch();
            delete this._entityWatch;
        }
        delete this._module;
    };
    Object.defineProperty(CtlBase.prototype, "hidden", {
        get: function () {
            return this._webixConfig.hidden;
        },
        /**
         * 设置隐藏
         */
        set: function (nv) {
            this._webixConfig.hidden = nv;
            if (!this._webix) {
                return;
            }
            if (nv) {
                this._webix.hide();
            }
            else {
                this._webix.show();
            }
        },
        enumerable: true,
        configurable: true
    });
    return CtlBase;
}());
export { CtlBase };
//# sourceMappingURL=CtlBase.js.map
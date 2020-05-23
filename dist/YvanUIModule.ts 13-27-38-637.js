import { __extends } from "tslib";
import Vue from 'vue';
import { componentFactory } from './YvanRender';
/**
 * 扩展 grid 组件
 */
webix.protoUI({
    name: 'grid'
}, webix.ui.template);
/**
 * 扩展 echarts 组件
 */
webix.protoUI({
    name: 'echarts'
}, webix.ui.template);
var BaseModule = /** @class */ (function (_super) {
    __extends(BaseModule, _super);
    function BaseModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 模块被渲染完成之后调用
     */
    BaseModule.prototype.onLoad = function () { };
    /**
     * 每次从隐藏状态换显出来后调用
     */
    BaseModule.prototype.onShow = function () { };
    /**
     * 根据名称，获取空白区域操作句柄
     */
    BaseModule.prototype.getPlace = function (placeId) {
        return webix.$$(_.get(this, 'instanceId') + '$' + placeId);
    };
    return BaseModule;
}(Vue));
export { BaseModule };
var BaseDialog = /** @class */ (function (_super) {
    __extends(BaseDialog, _super);
    function BaseDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 按下 ESC 键
     */
    BaseDialog.prototype.onEsc = function () {
        this.closeDialog();
    };
    /**
     * 按下 Enter 键
     */
    BaseDialog.prototype.onEnter = function () {
        debugger;
    };
    /**
     * 关闭后触发
     */
    BaseDialog.prototype.onClose = function () { };
    Object.defineProperty(BaseDialog.prototype, "title", {
        /**
         * 对话框标题
         */
        get: function () {
            return $(this.layero)
                .find('.layui-layer-title')
                .html();
        },
        /**
         * 设置对话框标题
         */
        set: function (nv) {
            $(this.layero)
                .find('.layui-layer-title')
                .html(nv);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 显示进行中的状态
     */
    BaseDialog.prototype.showLoading = function () {
        webix.extend(this._webixId, webix.OverlayBox);
        //this._webix.showOverlay("<div style='...'>There is no data</div>");
        this._webixId.showOverlay('Loading...');
    };
    /**
     * 关闭进行中的状态
     */
    BaseDialog.prototype.closeLoading = function () {
        this._webixId.hideOverlay();
    };
    return BaseDialog;
}(BaseModule));
export { BaseDialog };
/**
 * 装饰业务模块
 * @param options
 */
export function BizModule(option) {
    return function (Component) {
        return componentFactory(Component, option);
    };
    // const option = {
    //     ...createOption,
    //     template: `<webix-ui ref='webixui' :config='viewResolver()'/>`,
    //     ...createMixins<M, Refs, INP>(createOption)
    // }
    // return VueComponent<BaseModule<M, Refs, INP>>(option)
}
/**
 * 装饰字段（监听某个属性值变化）
 */
export function Watch(propName, deep, immediate) {
    if (deep === void 0) { deep = false; }
    if (immediate === void 0) { immediate = false; }
    if (typeof deep === 'undefined') {
        deep = false;
    }
    if (typeof immediate === 'undefined') {
        immediate = false;
    }
    return function (target, propertyKey, descriptor) {
        if (typeof target.watches === 'undefined') {
            target.watches = [];
        }
        var watch = {
            expr: propName,
            deep: deep,
            immediate: immediate,
            handler: descriptor.value
        };
        target.watches.push(watch);
    };
}
//# sourceMappingURL=YvanUIModule.ts 13-27-38-637.js.map
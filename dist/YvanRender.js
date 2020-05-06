import { __assign } from "tslib";
/* eslint-disable */
import Vue from 'vue';
import { CtlTree } from './CtlTree';
import { CtlTreeTable } from './CtlTreeTable';
import { CtlTab } from './CtlTab';
import { CtlDataview } from './CtlDataview';
import { CtlECharts } from './CtlECharts';
import { CtlButton } from './CtlButton';
import { CtlText } from './form/input/CtlText';
import { CtlCheckBox } from './form/other/CtlCheckBox';
import { CtlCombo } from './form/select/CtlCombo';
import { CtlDatePicker } from './form/input/CtlDatePicker';
import { CtlDateRangePicker } from './form/input/CtlDateRangePicker';
import { CtlForm } from './form/CtlForm';
import { CtlMultiCombo } from './form/select/CtlMultiCombo';
import { CtlSearch } from './form/input/CtlSearch';
import { CtlCarousel } from './CtlCarousel';
import { CtlGrid } from './CtlGrid';
import { CtlSwitch } from './form/other/CtlSwitch';
import { CtlNumber } from './form/input/CtlNumber';
import { CtlRadio } from './form/other/CtlRadio';
import { CtlCodeMirror } from './CtlCodeMirror';
import webix from 'webix';
// export const webix = require("../webix/webix");
webix.i18n.setLocale('zh-CN');
/**
 * 深度遍历 vjson
 * @param vjson 视图JSON
 * @param resolver 分析函数
 * @return 记录 resolver 方法返回 true 时，对象的访问路径
 */
export function deepTravVJson(vjson, resolver) {
    var markerList = [];
    deepTrav1(vjson, resolver, markerList);
    return markerList;
}
function deepTrav1(obj, resolver, marker) {
    var isMarker = resolver(obj);
    if (marker && isMarker === true) {
        marker.unshift({ id: 0, keyName: '', object: obj });
    }
    //设计器组件不扫描
    if (obj.xtype === 'yvDesignCanvas')
        return;
    if (obj.xtype === 'yvDesignProperty')
        return;
    if (obj.xtype === 'yvDesignToolbox')
        return;
    _.forOwn(obj, function (value, key) {
        if (typeof value !== 'object') {
            return;
        }
        if (_.has(obj, 'view') && obj.view === 'toolbar') {
            if (key === 'dataSource' || key === 'suggest' || key === 'options') {
                return;
            }
        }
        else {
            // 模型、数据、数据源不扫描
            if (key === 'data' ||
                key === 'dataSource' ||
                key === 'suggest' ||
                key === 'options') {
                return;
            }
        }
        //事件不扫描
        if (key === 'on' && _.isObject(value)) {
            return;
        }
        if (_.startsWith(key, 'on') && _.size(key) > 2) {
            return;
        }
        var isMarkerChild = deepTrav1(value, resolver, marker);
        if (marker && isMarkerChild === true) {
            isMarker = true;
            marker.unshift({ id: obj.id, keyName: key, object: value });
        }
    });
    return isMarker;
}
function deepTravFindSuper(obj, targetId) {
    //设计器组件不扫描
    if (obj.xtype === 'yvDesignCanvas')
        return;
    if (obj.xtype === 'yvDesignProperty')
        return;
    if (obj.xtype === 'yvDesignToolbox')
        return;
    var rObj = null;
    _.forOwn(obj, function (value, key) {
        if (rObj) {
            return;
        }
        if (typeof value !== 'object') {
            return;
        }
        // 模型、数据、数据源不扫描
        if (key === 'data' ||
            key === 'dataSource' ||
            key === 'suggest' ||
            key === 'options') {
            return;
        }
        //事件不扫描
        if (key === 'on' && _.isObject(value)) {
            return;
        }
        if (key.startsWith('on') && _.size(key) > 2) {
            return;
        }
        if (value.id === targetId) {
            rObj = obj;
            return;
        }
        rObj = deepTravFindSuper(value, targetId);
    });
    return rObj;
}
/**
 * 根据id查找上级vjson
 * @param obj 原始 vjson 视图
 * @param targetId 子元素的id
 */
export function getSuperVjson(obj, targetId) {
    return deepTravFindSuper(obj, targetId);
}
function deepTravFindCurrent(obj, targetId) {
    //设计器组件不扫描
    if (obj.xtype === 'yvDesignCanvas')
        return;
    if (obj.xtype === 'yvDesignProperty')
        return;
    if (obj.xtype === 'yvDesignToolbox')
        return;
    var rObj = null;
    _.forOwn(obj, function (value, key) {
        if (rObj) {
            return;
        }
        if (typeof value !== 'object') {
            return;
        }
        // 模型、数据、数据源不扫描
        if (key === 'data' ||
            key === 'dataSource' ||
            key === 'suggest' ||
            key === 'options') {
            return;
        }
        //事件不扫描
        if (key === 'on' && _.isObject(value)) {
            return;
        }
        if (key.startsWith('on') && _.size(key) > 2) {
            return;
        }
        if (value.id === targetId) {
            rObj = value;
            return;
        }
        rObj = deepTravFindCurrent(value, targetId);
    });
    return rObj;
}
/**
 * 根据id查找vjson
 * @param obj 原始 vjson 视图
 * @param targetId 子元素的id
 */
export function getCurrentVjson(obj, targetId) {
    return deepTravFindCurrent(obj, targetId);
}
function deepTravDeleteVjson(obj, targetId) {
    var isDelete = false;
    //设计器组件不扫描
    if (obj.xtype === 'yvDesignCanvas')
        return isDelete;
    if (obj.xtype === 'yvDesignProperty')
        return isDelete;
    if (obj.xtype === 'yvDesignToolbox')
        return isDelete;
    _.forOwn(obj, function (value, key) {
        if (isDelete) {
            return;
        }
        if (typeof value !== 'object') {
            return;
        }
        // 模型、数据、数据源不扫描
        if (key === 'data' ||
            key === 'dataSource' ||
            key === 'suggest' ||
            key === 'options') {
            return;
        }
        //事件不扫描
        if (key === 'on' && _.isObject(value)) {
            return;
        }
        if (key.startsWith('on') && _.size(key) > 2) {
            return;
        }
        if (value.id === targetId) {
            isDelete = true;
            /** 如果是数组的元素*/
            if (webix.isArray(obj)) {
                obj.splice(key, 1);
            }
            else {
                delete obj[key];
            }
            return;
        }
        isDelete = deepTravDeleteVjson(value, targetId);
        /** 删除因为删除元素后造成的空元素 */
        if (isDelete) {
            if ((webix.isArray(value) && value.length <= 0) ||
                Object.keys(value).length <= 0 ||
                (Object.keys(value).length === 1 && value.id > 0) ||
                value === undefined ||
                value === null) {
                if (webix.isArray(obj)) {
                    obj.splice(key, 1);
                }
                else {
                    delete obj[key];
                }
            }
        }
    });
    return isDelete;
}
/**
 * 根据id删除Vjson 会删除因删除元素造成的空对象
 * @param obj 原始 vjson 视图
 * @param targetId 子元素的id
 */
export function deletVjsonById(obj, targetId) {
    var isDeleted = deepTravDeleteVjson(obj, targetId);
    if (webix.isArray(obj)) {
        if (obj.length <= 0) {
            var T = {
                view: 'template',
                template: '拖动任何组件到此处',
                role: 'placeholder',
                id: webix.uid()
            };
            obj.push(T);
        }
    }
    return isDeleted;
}
/**
 * 根据 vjson 中的 ctlName, 合并属性
 * @param vjson 原始 vjson 视图
 * @param ctlOption 要被扩展的 ctlName 属性对
 */
export function viewExtend(vjson, ctlOption) {
    // 收集所有 ctlName 属性，放到收集器的 collector.ctls
    // 收集所有 entityName 属性，放到收集器的 collector.entity
    var collector = {
        ctls: {}
    };
    deepTravVJson(vjson, function (obj) {
        if (obj.ctlName) {
            _.set(collector.ctls, obj.ctlName, obj);
        }
    });
    _.forOwn(ctlOption, function (extendVJson, ctlName) {
        if (_.has(collector.ctls, ctlName)) {
            _.merge(_.get(collector.ctls, ctlName), extendVJson);
        }
    });
    return vjson;
}
var $internalHooks = ['data', 'destory', 'watches', 'computed'];
/**
 * 收集成员变量
 */
function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return _.get(vm, key); },
                    set: function (value) {
                        _.set(vm, key, value);
                    },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            _.set(plainData, key, data[key]);
        }
    });
    return plainData;
}
/**
 * 收集成员方法
 */
function collectMethods(proto, options) {
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        // 如果是constructor，则不处理。
        if (key === 'constructor') {
            return;
        }
        // 记录下每级的 viewExtend 方法
        if (key === 'viewExtend') {
            // options.viewExtends.push(proto[key]);
            console.error('不支持使用 viewExtend, 请考虑使用 YvanUI.viewExtend(super.viewResolver(),{})');
            return;
        }
        // 记录下每级的 viewIntercept 方法
        if (key === 'viewIntercept') {
            // options.viewIntercepts.push(proto[key]);
            console.error('不支持使用 viewIntercept, 请考虑使用 super.viewResolver()');
            return;
        }
        // 记录下每级的 onLoad 方法
        if (key === 'onLoad') {
            options.onLoads.push(proto[key]);
            return;
        }
        // 记录下每级的 onShow 方法
        if (key === 'onShow') {
            options.onShows.push(proto[key]);
        }
        // 如果原型属性(方法)名是vue生命周期钩子名，则直接作为钩子函数挂载在options最外层
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        // 先获取到原型属性的descriptor。
        // 在前文已提及，计算属性其实也是挂载在原型上的，所以需要对descriptor进行判断
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // 如果属性值是一个function，则认为这是一个方法，挂载在methods下
            if (typeof descriptor.value === 'function') {
                if (!_.has(options.methods, key)) {
                    options.methods[key] = descriptor.value;
                }
            }
            else {
                // 如果不是，则认为是一个普通的data属性。
                // 但是这是原型上，所以更类似mixins，因此挂在mixins下。
                options.mixins.push({
                    data: function () {
                        var _a;
                        return _a = {}, _a[key] = descriptor.value, _a;
                    }
                });
            }
        }
        else if (descriptor.get || descriptor.set) {
            // 如果value是undefined(ps：void 0 === undefined)。
            // 且描述符具有get或者set方法，则认为是计算属性。不理解的参考我上面关于class转换成构造函数的例子
            // 这里可能和普通的计算属性不太一样，因为一般计算属性只是用来获取值的，但这里却有setter。
            // 不过如果不使用setter，与非class方式开发无异，但有这一步处理，在某些场景会有特效。
            ;
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
}
/**
 * 基础混入器
 */
function createCommonMix() {
    return {};
}
/**
 * 根据 vjson 格式，嵌入 yvan 组件, 生成能够为 webix 使用的 vjson
 */
export function wrapperWebixConfig(module, vjson) {
    // 形成最终的 viewResolver 方法
    deepTravVJson(vjson, function (obj) {
        if (obj.view === 'iframe') {
            return;
        }
        if (module && _.has(obj, 'id')) {
            if (obj.id !== 'MainWindowFirstPage') {
                console.error('禁用 ID 属性', obj);
            }
        }
        if (typeof obj.placeId === 'string') {
            obj.id = module.instanceId + '$' + obj.placeId;
        }
        if (typeof obj.view === 'string') {
            switch (obj.view) {
                case 'button':
                    CtlButton.create(obj);
                    break;
                case 'text':
                    CtlText.create(obj);
                    break;
                case 'number':
                case 'counter':
                    CtlNumber.create(obj);
                    break;
                case 'datepicker':
                case 'date':
                case 'datetime':
                    CtlDatePicker.create(obj);
                    break;
                case 'codemirror-editor':
                    CtlCodeMirror.create(obj);
                    break;
                case 'dataview':
                    CtlDataview.create(obj);
                    break;
                case 'echarts':
                    CtlECharts.create(obj);
                    break;
                case 'daterangepicker':
                case 'daterange':
                case 'datetimerange':
                    CtlDateRangePicker.create(obj);
                    break;
                case 'combo':
                case 'combobox':
                    CtlCombo.create(obj);
                    break;
                case 'multicombo':
                    CtlMultiCombo.create(obj);
                    break;
                case 'search':
                case 'searchbox':
                    CtlSearch.create(obj);
                    break;
                case 'check':
                case 'checkbox':
                    CtlCheckBox.create(obj);
                    break;
                case 'switch':
                case 'switchbox':
                    CtlSwitch.create(obj);
                    break;
                case 'radio':
                case 'radiobox':
                    CtlRadio.create(obj);
                    break;
                case 'tree':
                    CtlTree.create(obj);
                    break;
                case 'treetable':
                    CtlTreeTable.create(obj);
                    break;
                case 'tabview':
                    CtlTab.create(obj);
                    break;
                case 'grid':
                    CtlGrid.create(obj);
                    break;
                case 'form':
                    CtlForm.create(obj);
                    break;
                case 'carousel':
                    CtlCarousel.create(obj);
                    break;
            }
        }
    });
    if (module) {
        vjson.$scope = module;
    }
}
/**
 * 将传统 Java Class 转换为 Vue 对象
 */
export function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    //return VueComponent<BaseModule<M, Refs, INP>>(options)
    if (!options.mixins) {
        options.mixins = [];
    }
    if (!options.methods) {
        options.methods = {};
    }
    if (!options.viewExtends) {
        options.viewExtends = [];
    }
    if (!options.viewIntercepts) {
        options.viewIntercepts = [];
    }
    if (!options.onLoads) {
        options.onLoads = [];
    }
    if (!options.onShows) {
        options.onShows = [];
    }
    // 获取构造函数原型，这个原型上挂在了该类的method
    for (var proto = Component.prototype; proto.constructor !== Vue; proto = Object.getPrototypeOf(proto)) {
        // 一直向上收集, 直到 Object 级
        collectMethods(proto, options);
    }
    // 添加公共基础 MIX
    options.mixins.push(createCommonMix());
    // 解析 @Watch 装饰器方法，执行 watch
    var watches = Component.prototype.watches;
    delete Component.prototype.watches;
    // 实例化Component构造函数，并收集其自身的(非原型上的)属性导出
    options.mixins.push({
        data: function () {
            var data = __assign({ refs: {}, _layerIndex: undefined, inParamter: undefined, dialogParent: undefined, instanceId: _.uniqueId('_mins_id_') }, collectDataFromConstructor(this, Component));
            return data;
        },
        created: function () {
            var _this = this;
            if (_.isArray(watches)) {
                _.each(watches, function (item) {
                    _this.$watch(item.expr, item.handler, {
                        deep: item.deep,
                        immediate: item.immediate
                    });
                    //console.log('$watch', item.expr, item.handler, { deep: item.deep, immediate: item.immediate })
                });
            }
        },
        destroyed: function () { },
        methods: {
            onLoad: function () {
                var _this = this;
                _.each(options.onLoads, function (load) {
                    load.call(_this);
                });
            },
            onShow: function () {
                var _this = this;
                _.each(options.onShows, function (load) {
                    load.call(_this);
                });
            },
            buildView: function () {
                // 获取到 viewResolver 方法，拿到最原始的 vjson
                var vjson = this.viewResolver();
                // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
                wrapperWebixConfig(this, vjson);
                return vjson;
            },
            closeDialog: function () {
                layer.close(this._layerIndex);
            },
            showDialog: function (inParamter, container, isFromSearchBox) {
                if (isFromSearchBox === void 0) { isFromSearchBox = false; }
                // 显示对话框
                var module = this;
                module.inParamter = inParamter;
                module.dialogParent = container;
                // 获取到 viewResolver 方法，拿到最原始的 vjson
                var vjson = module.viewResolver();
                if (!_.has(vjson, 'body')) {
                    vjson.body = {
                        template: 'dialog 没有 body'
                    };
                }
                var _a = vjson.title, title = _a === void 0 ? '未命名对话框' : _a, _b = vjson.width, width = _b === void 0 ? 500 : _b, _c = vjson.height, height = _c === void 0 ? 300 : _c, _d = vjson.modal, modal = _d === void 0 ? true : _d, body = vjson.body, btn = vjson.btn;
                // 与 yvan 组件进行交换，使 vjson 能被 webix 使用
                wrapperWebixConfig(module, body);
                var layerConfig = {
                    id: _.uniqueId('layerno_'),
                    zIndex: layer.zIndex,
                    type: 1,
                    area: [width + "px", height + "px"],
                    title: title,
                    shade: modal ? 0.6 : false,
                    maxmin: true,
                    btn: btn,
                    anim: 0,
                    content: ''
                };
                // layer 打开后的回调
                layerConfig.success = function (layero) {
                    module.layero = layero;
                    layer.setTop(layero);
                    // 默认焦点在关闭上
                    layero
                        .find('a.layui-layer-close')
                        .attr('tabindex', 1)
                        .focus();
                    // if (isFromSearchBox) {
                    // 监听回车和取消键
                    layero.on('keydown', function (event) {
                        if (event.keyCode === 13) {
                            module.onEnter();
                            if (isFromSearchBox) {
                                event.stopPropagation();
                            }
                            event.preventDefault();
                        }
                        else if (event.keyCode === 27) {
                            module.onEsc();
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    });
                    // }
                    // DOM 结果出现之后, 渲染 webix
                    body.container = layero.find('.layui-layer-content').attr('id'); // layero[0]; // layero.attr('id');
                    module._layeroInner = body.container;
                    var $innerDOM = $('#' + module._layeroInner);
                    _.extend(body, {
                        width: $innerDOM.innerWidth(),
                        height: $innerDOM.innerHeight()
                    });
                    module._webixId = webix.ui(body);
                    module.onLoad();
                };
                // layer 大小改变后的回调
                layerConfig.restore = layerConfig.full = layerConfig.resizing = function (layero) {
                    //$$(module._webixId).resize();
                    var $innerDOM = $('#' + module._layeroInner);
                    module._webixId.define({
                        width: $innerDOM.innerWidth(),
                        height: $innerDOM.innerHeight()
                    });
                    module._webixId.resize();
                    console.log('resized');
                };
                // layer 关闭后的回调
                layerConfig.end = function () {
                    module.onClose();
                    webix.$$(module._webixId).destructor();
                    module.$destroy();
                };
                module._layerIndex = layer.open(layerConfig);
            }
        }
    });
    // 通过 vue.extend 生成一个 vue 类型的功能模块对象
    var VueModule = Vue.extend(options);
    return VueModule;
}
/**
 * 在目标 DOM 选择器上渲染模块
 */
export function render(selector, baseModule) {
    var lastHandle = _.get(window, 'LastRenderHandler');
    if (lastHandle) {
        lastHandle.destructor();
        _.set(window, 'LastRenderHandler', null);
    }
    var cfg = baseModule.buildView();
    cfg.container = selector;
    baseModule._webixId = webix.ui(cfg);
    baseModule.onLoad();
    webix.event(window, 'resize', function () {
        // $$(baseModule._webixId).resize();
        baseModule._webixId.resize();
    });
    _.set(window, 'LastRenderHandler', baseModule._webixId);
    return baseModule._webixId;
}
/**
 * 在占位空间 spaceId 上渲染 vjson
 * @param module 当前模块
 * @param spaceId 占位空间
 * @param vjson 界面描述
 */
export function renderPlace(module, spaceId, vjson) {
    wrapperWebixConfig(module, vjson);
    webix.ui(vjson, webix.$$(module.instanceId + '$' + spaceId));
}
//# sourceMappingURL=YvanRender.js.map
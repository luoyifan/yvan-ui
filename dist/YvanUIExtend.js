export var version = "3.0.2";
/**
 * 全局 ajax 方法
 */
export var ajax;
/**
 * 全局 数据库连接
 */
export var dbs = {};
/**
 * 全局 formatter 函数
 */
export var formatter = {};
/**
 * 全局 dict 字典
 */
export var dict = {};
/**
 * 全局 校验方法
 */
export var validType = {};
/**
 * 复杂校验通用方法
 */
export var complexValid = {};
/**
 * 组件渲染过滤器, 如果方法返回 false 代表该组件不需要被渲染.
 * 可以修改 vjson 的内容，但不能删除他
 */
export var componentRenderFilter = undefined;
export function getServerPrefix(url) {
    return _.get(window, '_YvanUI_serverJSPrefix') + url;
}
/**
 * YvanUI 全局扩展配置
 * @param option 配置信息
 */
export function extend(option) {
    if (option.ajax) {
        ajax = option.ajax;
    }
    if (option.serverJsPrefix) {
        _.extend(window, { _YvanUI_serverJSPrefix: option.serverJsPrefix });
    }
    if (option.dbs) {
        _.extend(dbs, option.dbs);
    }
    if (option.dict) {
        _.extend(dict, option.dict);
    }
    if (option.validType) {
        _.extend(validType, option.validType);
    }
    if (option.formatter) {
        _.extend(formatter, option.formatter);
    }
    if (option.complexValid) {
        _.extend(complexValid, option.complexValid);
    }
    if (option.componentRenderFilter) {
        componentRenderFilter = option.componentRenderFilter;
    }
}
//# sourceMappingURL=YvanUIExtend.js.map
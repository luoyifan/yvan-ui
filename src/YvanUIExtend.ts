import { Ajax } from './YvanUIAjax';
import { Db } from './YvanUIDb';

export type FormatterFunction = (id: string) => string;

export type ValidFunction = (value: string) => string | ValidFunction | undefined;

export type ComplexValidFunction = (valid: string, value: string) => string | undefined;

export interface DictItem {
    id: string;
    text: string;

    [id: string]: string;
}

export type Dict = DictItem[];

/**
 * YvanUI 全局扩展配置
 */
export interface ExtendOption {
    /**
     * 扩展自定义的 ajax 方法
     */
    ajax: Ajax.Function;

    /**
     * serverJS 请求前缀
     */
    serverJsPrefix: string;

    /**
     * 扩展自定义的数据库
     */
    dbs: { [db: string]: Db.Client };

    /**
     * 扩展全局 formatter 函数
     */
    formatter: { [db: string]: FormatterFunction };

    /**
     * 扩展全局 dict 字典
     */
    dict: { [dictName: string]: Dict };

    /**
     * 扩展全局 校验方法
     */
    validType: { [validName: string]: ValidFunction };

    /**
     * 复杂校验通用方法
     */
    complexValid: { [validName: string]: ComplexValidFunction };

    /**
     * 组件渲染过滤器, 如果方法返回 false 代表该组件不需要被渲染.
     * 可以修改 vjson 的内容，但不能删除他
     */
    componentRenderFilter: (vjson: any) => undefined | boolean
}

export const version = "3.0.2"

/**
 * 全局 ajax 方法
 */
export let ajax: Ajax.Function;

/**
 * 全局 数据库连接
 */
export const dbs: { [db: string]: Db.Client } = {};

/**
 * 全局 formatter 函数
 */
export const formatter: { [db: string]: FormatterFunction } = {};

/**
 * 全局 dict 字典
 */
export const dict: { [dictName: string]: Dict } = {};

/**
 * 全局 校验方法
 */
export const validType: { [validName: string]: ValidFunction } = {};

/**
 * 复杂校验通用方法
 */
export const complexValid: { [validName: string]: ComplexValidFunction } = {};

/**
 * 组件渲染过滤器, 如果方法返回 false 代表该组件不需要被渲染.
 * 可以修改 vjson 的内容，但不能删除他
 */
export let componentRenderFilter: (undefined | ((vjson: any) => undefined | boolean)) = undefined;

/**
 * YvanUI 全局扩展配置
 * @param option 配置信息
 */
export function extend(option: Partial<ExtendOption>) {
    if (option.ajax) {
        ajax = option.ajax
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
        componentRenderFilter = option.componentRenderFilter
    }
}

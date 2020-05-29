import { CtlBase } from './CtlBase';
import * as _ from 'lodash';
export declare class CtlConsoleLog extends CtlBase<CtlConsoleLog> {
    static create(module: any, vjson: any): CtlConsoleLog;
    /**
     * @param logs 需要打印的json
     */
    printLog(logs: any): void;
    renderDom(domHtml: string): void;
    _realHtml: string[];
    realRender: (() => void) & _.Cancelable;
    /**
      * 递归生成html
      */
    log2html(params: any): String;
    obj2html(params: any, title?: any): String;
    /**
     * div打开关闭
     */
    vcfoldclick(params: any): void;
    /**
   * 搜索并打开div
   */
    searchText(inputValue: string): void;
    itemContainsText(params: any, inputValue: any): void;
    removeSelected(params: any): void;
    /**
   * 全部清空
   */
    vcClearAll(): void;
    /**
   * 全部收起
   */
    vcCloseAll(): void;
    /**
     * 全部展开
     */
    vcOpenAll(): void;
    closeOrOpen(items: any, isOpen: boolean): void;
    /**
     * tools
     */
    isNumber(value: any): boolean;
    isString(value: any): boolean;
    isArray(value: any): boolean;
    isBoolean(value: any): boolean;
    isUndefined(value: any): boolean;
    isNull(value: any): boolean;
    isSymbol(value: any): boolean;
    isFunction(value: any): boolean;
    isObject(value: any): boolean;
    /**
   * Simple JSON stringify, stringify top level key-value
   */
    JSONStringify(stringObject: any): any;
    /**
   * get an object's all keys ignore whether they are not enumerable
   */
    getObjAllKeys(obj: any): any;
    /**
     * get an object's prototype name
     */
    getObjName(obj: any): any;
}

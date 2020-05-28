/// <reference types="lodash" />
/// <reference types="lodash/common/common" />
/// <reference types="lodash/common/array" />
/// <reference types="lodash/common/collection" />
/// <reference types="lodash/common/date" />
/// <reference types="lodash/common/function" />
/// <reference types="lodash/common/lang" />
/// <reference types="lodash/common/math" />
/// <reference types="lodash/common/number" />
/// <reference types="lodash/common/object" />
/// <reference types="lodash/common/seq" />
/// <reference types="lodash/common/string" />
/// <reference types="lodash/common/util" />
import { CtlBase } from './CtlBase';
export declare class CtlConsoleLog extends CtlBase<CtlConsoleLog> {
    static create(module: any, vjson: any): CtlConsoleLog;
    /**
     * @param logs 需要打印的json
     */
    printLog(logs: any): void;
    renderDom(domHtml: string): void;
    _realHtml: string[];
    realRender: (() => void) & import("lodash").Cancelable;
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

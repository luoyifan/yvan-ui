/// <reference types="lodash" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/common" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/array" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/collection" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/date" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/function" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/lang" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/math" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/number" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/object" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/seq" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/string" />
/// <reference types="node_modules/@types/lodash/ts3.1/common/util" />
import { GridDataSource, GridDataSourceSql, GridDataSourceServer, GridDataSourceAjax, GridDataSourceStaticFunction } from './YvanDataSourceGrid';
export declare class YvanDataSourceGrid {
    private option;
    private ctl;
    private readonly module;
    private watches;
    private isFirstAutoLoad;
    private reload;
    private rowCount;
    lastFilterModel: any;
    lastSortModel: any;
    serverQuery: ((option: GridDataSourceServer | GridDataSourceAjax | GridDataSourceSql, paramFunction: (() => any) | undefined, params: any) => void) & import("lodash").Cancelable;
    /**
     * SQL取值
     */
    setSqlMode(option: GridDataSourceSql | GridDataSourceServer | GridDataSourceAjax, paramFunction: undefined | (() => any)): void;
    /**
     * 自定义函数式取值
     */
    setCustomFunctionMode(option: GridDataSourceStaticFunction, paramFunction: undefined | (() => any)): void;
    setCodeArrayMode(option: Array<any>): void;
    constructor(ctl: any, option: GridDataSource);
    /**
     * 释放与 YvGrid 的绑定
     */
    destory(): void;
    /**
     * 清空 rowCount, 下次重新统计总行数
     */
    clearRowCount(): void;
    updateSupport(): boolean;
    _updateRow(param: any): void;
}

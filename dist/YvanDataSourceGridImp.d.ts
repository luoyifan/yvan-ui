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

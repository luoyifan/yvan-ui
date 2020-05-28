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
import { DataSource, DataSourceStaticFunction, DataSourceDb, DataSourceServer, DataSourceProcessFunction } from './YvanDataSource';
export declare class YvDataSource<T> {
    private readonly module;
    private option;
    private dataSourceProcess?;
    private ctl;
    private watches;
    reload: undefined | (() => void);
    customFunctionModeDebounce: ((option: DataSourceStaticFunction<T>) => void) & import("lodash").Cancelable;
    sqlModeDebounce: ((option: DataSourceDb<T> | DataSourceServer<T>) => void) & import("lodash").Cancelable;
    /**
     * 自定义函数式取值
     */
    setCustomFunctionMode(option: DataSourceStaticFunction<T>): void;
    /**
     * SQL取值
     */
    setSqlMode(option: DataSourceDb<T> | DataSourceServer<T>): void;
    constructor(ctl: any, option: DataSource<T>, dataSourceProcess?: DataSourceProcessFunction);
    init(): void;
    destory(): void;
}

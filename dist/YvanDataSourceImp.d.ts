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

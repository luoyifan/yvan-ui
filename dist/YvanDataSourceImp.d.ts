import { DataSource, DataSourceStaticFunction, DataSourceDb, DataSourceServer, DataSourceProcessFunction } from './YvanDataSource';
export declare class YvDataSource<T> {
    private readonly module;
    private option;
    private dataSourceProcess?;
    private ctl;
    private watches;
    reload: undefined | (() => void);
    customFunctionModeDebounce: ((option: DataSourceStaticFunction<T>) => void) & import("lodash").Cancelable;
    sqlModeDebounce: ((option: DataSourceDb | DataSourceServer) => void) & import("lodash").Cancelable;
    /**
     * 自定义函数式取值
     */
    setCustomFunctionMode(option: DataSourceStaticFunction<T>): void;
    /**
     * SQL取值
     */
    setSqlMode(option: DataSourceDb | DataSourceServer): void;
    constructor(ctl: any, option: DataSource<T>, dataSourceProcess?: DataSourceProcessFunction);
    init(): void;
    destory(): void;
}

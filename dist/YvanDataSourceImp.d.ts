import { DataSource, DataSourceStaticFunction, DataSourceDb, DataSourceServer, DataSourceProcessFunction } from './YvanDataSource';
import * as _ from 'lodash';
export declare class YvDataSource<T> {
    private readonly module;
    private option;
    private dataSourceProcess?;
    private ctl;
    private watches;
    reload: undefined | (() => void);
    customFunctionModeDebounce: ((option: DataSourceStaticFunction<T>) => void) & _.Cancelable;
    sqlModeDebounce: ((option: DataSourceDb<T> | DataSourceServer<T>) => void) & _.Cancelable;
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
